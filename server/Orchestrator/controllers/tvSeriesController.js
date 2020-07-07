const baseUrl = 'http://localhost:3002';
const axios = require('axios');
const redis = require('../redis');

class TvSeriesController {
  static async getAll(req, res) {
    try {
      const cache = await redis.get('tv-series');
      if (cache) {
        res.json(JSON.parse(cache));
      } else {
        const { data } = await axios({
          method: 'get',
          url: `${baseUrl}/tv`,
        });
        await redis.set('tv-series', JSON.stringify(data));
        res.status(200).json({
          tvSeries: data,
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  static async addTv(req, res) {
    try {
      const addTvSeries = await axios({
        method: 'post',
        url: `${baseUrl}/tv`,
        data: req.body,
      });
      const tvSeries = addTvSeries.data;

      if (tvSeries) {
        res.status(201).json(tvSeries);
        const cacheTvSeries = await redis.get('tv-series');
        const cache = JSON.parse(cacheTvSeries);
        cache.push(tvSeries.ops[0]);
        await redis.set('tv-series', JSON.stringify(cache));
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  static async deleteTv(req, res) {
    try {
      const { id } = req.params;
      const cacheTvSeries = await redis.get('tv-series');
      const cache = JSON.parse(cacheTvSeries);

      const deleteTvSeries = await axios({
        method: 'delete',
        url: `${baseUrl}/tv/${id}`,
      });
      const { data } = deleteTvSeries;
      if (data) {
        const newCache = cache.filter((element) => {
          return element._id !== id;
        });
        await redis.set('tv-series', JSON.stringify(newCache));
        res.status(201).json(data.msg);
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  static async updateTv(req, res) {
    try {
      const { id } = req.params;
      const { title, overview, poster_path, popularity, tags } = req.body;
      const tvSeries = {
        id,
        title,
        overview,
        poster_path,
        popularity,
        tags,
      };

      const cacheTvSeries = await redis.get('tv-series');
      const cache = JSON.parse(cacheTvSeries);
      const newCache = cache.filter((element) => {
        return element._id !== id;
      });

      const updateTvSeries = await axios({
        method: 'patch',
        url: `${baseUrl}/tv/${id}`,
        data: tvSeries,
      });
      const { data } = updateTvSeries;

      if (data) {
        newCache.push(tvSeries);
        await redis.set('tv-series', JSON.stringify(newCache));
        res.status(201).json({ msg: 'TV Series has been updated' });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = TvSeriesController;
