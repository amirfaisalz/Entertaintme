const { getDatabase } = require('../config/mongo');
const { ObjectId } = require('mongodb');

const db = getDatabase();
const tvSeries = db.collection('tvSeries');

class TvSeriesModel {
  static findAll() {
    return tvSeries.find({}).toArray();
  }

  static findById(id) {
    return tvSeries.find({_id: ObjectId(id) }).toArray();
  }

  static createTvSeries(newTvSeries) {
    return tvSeries.insertOne(newTvSeries);
  }

  static deleteTvSeries(id) {
    return tvSeries.deleteOne({ _id: ObjectId(id) });
  }

  static updateTvSeries(id, tvSeriesUpdate) {
    return tvSeries.updateOne({ _id: ObjectId(id) }, { $set: tvSeriesUpdate });
  }
}

module.exports = TvSeriesModel;
