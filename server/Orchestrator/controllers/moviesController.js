const baseUrl = 'http://localhost:3001';
const axios = require('axios');
const redis = require('../redis');

class MoviesController {
  static async getAll(req, res) {
    try {
      const cache = await redis.get('movies');
      if (cache) {
        res.json(JSON.parse(cache));
      } else {
        const { data } = await axios({
          method: 'get',
          url: `${baseUrl}/movies`,
        });
        await redis.set('movies', JSON.stringify(data));
        res.status(200).json({
          movies: data,
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  static async addMovie(req, res) {
    try {
      const addMovie = await axios({
        method: 'post',
        url: `${baseUrl}/movies`,
        data: req.body,
      });
      const movies = addMovie.data;

      if (movies) {
        res.status(201).json(movies);
        const cacheMovie = await redis.get('movies');
        const cache = JSON.parse(cacheMovie);
        cache.push(movies.ops[0]);
        await redis.set('movies', JSON.stringify(cache));
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  static async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      const cacheMovie = await redis.get('movies');
      const cache = JSON.parse(cacheMovie);

      const deleteMovie = await axios({
        method: 'delete',
        url: `${baseUrl}/movies/${id}`,
      });
      const { data } = deleteMovie;
      if (data) {
        const newCache = cache.filter((element) => {
          return element._id !== id;
        });
        await redis.set('movies', JSON.stringify(newCache));
        res.status(201).json(data.msg);
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  static async updateMovie(req, res) {
    try {
      const { id } = req.params;
      const { title, overview, poster_path, popularity, tags } = req.body;
      const movie = {
        id,
        title,
        overview,
        poster_path,
        popularity,
        tags,
      };

      const cacheMovie = await redis.get('movies');
      const cache = JSON.parse(cacheMovie);
      const newCache = cache.filter((element) => {
        return element._id !== id;
      });

      const updateMovie = await axios({
        method: 'patch',
        url: `${baseUrl}/movies/${id}`,
        data: movie,
      });
      const { data } = updateMovie;

      if (data) {
        newCache.push(movie);
        await redis.set('movies', JSON.stringify(newCache));
        res.status(201).json({ msg: 'Movie has been updated' });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = MoviesController;
