const tvSeriesModel = require('../models/tvSeriesModel');

class tvSeriesController {
  static async findAll(req, res) {
    try {
      const tvSeries = await tvSeriesModel.findAll();
      return res.status(200).json(tvSeries);
    } catch (error) {
      console.log(error, 'error findall-tvSeries-model =========');
    }
  }

  static async findById(req, res) {
    try {
      const id = req.params.id;
      const tvSeries = await tvSeriesModel.findById(id);
      return res.status(200).json(tvSeries);
    } catch (error) {
      console.log(error, 'error findall-movie-model =========');
    }
  }

  static async createTvSeries(req, res) {
    try {
      const tvSeries = await tvSeriesModel.createTvSeries(req.body);
      return res.status(201).json(tvSeries);
    } catch (error) {
      console.log(error, 'error create-tvSeries-model ========');
    }
  }

  static async deleteTvSeries(req, res) {
    try {
      const tvSeries = await tvSeriesModel.deleteTvSeries(req.params.id);
      return res.status(200).json({ msg: 'TV Series has been deleted' });
    } catch (error) {
      console.log(error, 'error delete-tvSeries-model ========');
    }
  }

  static async updateTvSeries(req, res) {
    try {
      const id = req.params.id;
      const tvSeriesUpdate = req.body;
      const tvSeries = await tvSeriesModel.updateTvSeries(id, tvSeriesUpdate);
      return res.status(200).json(tvSeries);
    } catch (error) {
      console.log(error, 'error update-tvSeries-model ========');
    }
  }
}

module.exports = tvSeriesController;
