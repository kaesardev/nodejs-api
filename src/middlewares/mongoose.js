const mongoose = require('mongoose');
const requireDir = require('require-dir');

//Iniciando o DB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Could not connect to MongoDB...'));

//Mongoose Models load
const Models = requireDir('../models');

module.exports = Models;
