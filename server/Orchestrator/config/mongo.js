const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'entertainme';

var db;
const client = new MongoClient(url, { useUnifiedTopology: true });

function connect(callback) {
  client.connect(function (error) {
    if (error) {
      console.log(error, '<=====failed to connect mongo db');
    } else {
      console.log('success to connect mongo db');
      db = client.db(dbName);
    }
    callback(error);
  });
}

function getDatabase() {
  return db;
}

module.exports = { connect, getDatabase };
