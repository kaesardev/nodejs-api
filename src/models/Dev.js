const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const PointSchema = require('./utils/PointSchema');

const DevSchema = new mongoose.Schema({
  name: String,
  github_username: String,
  bio: String,
  avatar_url: String,
  techs: [String],
  locations: { type: PointSchema, index: '2dsphere' },
});

DevSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Dev', DevSchema);
