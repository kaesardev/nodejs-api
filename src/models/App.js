const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const AppSchema = new mongoose.Schema({
  app_key: { type: String, require: true },
  app_pass: { type: String, required: true },
});

AppSchema.methods = {
  genToken() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24, //1d
    });
  },
};

module.exports = mongoose.model('App', AppSchema);
