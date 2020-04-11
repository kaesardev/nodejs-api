const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const StorageSchema = new mongoose.Schema({
  filename: { type: String, require: true },
  encoding: { type: String, require: true },
  mimetype: { type: String, require: true },
  size: { type: String, require: true },
  content: { type: Buffer, require: true },
});

StorageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Storage', StorageSchema);
