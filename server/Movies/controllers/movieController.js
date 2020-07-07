const movieModel = require('../models/movieModel');

class movieController {
  static async findAll(req, res) {
    try {
      const movies = await movieModel.findAll();
      return res.status(200).json(movies);
    } catch (error) {
      console.log(error, 'error findall-movie-model =========');
    }
  }

  static async findById(req, res) {
    try {
      const id = req.params.id;
      const movies = await movieModel.findById(id);
      return res.status(200).json(movies);
    } catch (error) {
      console.log(error, 'error findall-movie-model =========');
    }
  }

  static async createMovie(req, res) {
    try {
      const movie = await movieModel.createMovie(req.body);
      return res.status(201).json(movie);
    } catch (error) {
      console.log(error, 'error create-movie-model ========');
    }
  }

  static async deleteMovie(req, res) {
    try {
      const movie = await movieModel.deleteMovie(req.params.id);
      return res.status(200).json({ msg: 'Movie has been deleted' });
    } catch (error) {
      console.log(error, 'error delete-movie-model ========');
    }
  }

  static async updateMovie(req, res) {
    try {
      const id = req.params.id;
      const movieUpdate = req.body;
      const movie = await movieModel.updateMovie(id, movieUpdate);
      return res.status(200).json(movie);
    } catch (error) {
      console.log(error, 'error update-movie-model ========');
    }
  }
}

module.exports = movieController;
