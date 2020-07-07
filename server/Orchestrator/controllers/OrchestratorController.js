const movieUrl = 'http://localhost:3001/movies';
const tvSeriesUrl = 'http://localhost:3002/tv';
const axios = require('axios');
const redis = require('../redis');
const { client } = require('../redis');

class OrchestratorController {
  static async getAll(req, res) {
    try {
      const cacheMovies = await redis.get('movies');
      const cacheTV = await redis.get('tv-series');
      if (cacheMovies && cacheTV) {
        res.json({
          Response: {
            movies: JSON.parse(cacheMovies),
            tvSeries: JSON.parse(cacheTV),
          },
        });
      } else {
        const dataMovies = await axios({
          method: 'get',
          url: movieUrl,
        });
        const dataTvSeries = await axios({
          method: 'get',
          url: tvSeriesUrl,
        });
        let movies = dataMovies.data;
        let tvSeries = dataTvSeries.data;
        if (movies && tvSeries) {
          await redis.set('movies', JSON.stringify(movies));
          await redis.set('tv-seires', JSON.stringify(tvSeries));
          res.status(200).json({ Response: { movies, tvSeries } });
        }
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = OrchestratorController;
