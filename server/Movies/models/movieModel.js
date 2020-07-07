const { getDatabase } = require('../config/mongo');
const { ObjectId } = require('mongodb');

const db = getDatabase();
const Movie = db.collection('movies');

class movieModel {
  static findAll() {
    return Movie.find({}).toArray();
  }

  static findById(id) {
    return Movie.find({_id: ObjectId(id) }).toArray();
  }

  static createMovie(newMovie) {
    return Movie.insertOne(newMovie);
  }

  static deleteMovie(id) {
    return Movie.deleteOne({ _id: ObjectId(id) });
  }

  static updateMovie(id, movieUpdate) {
    return Movie.updateOne({ _id: ObjectId(id) }, { $set: movieUpdate });
  }
}

module.exports = movieModel;
