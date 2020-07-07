const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');

const { connect } = require('./config/mongo.js');

connect((error) => {
  if (!error) {    
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/', require('./routes'));

    app.listen(PORT, (_) => {
      console.log(`app listening port ${PORT}`);
    });
  }
});
