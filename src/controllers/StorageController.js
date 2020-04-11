const mongoose = require('mongoose');
const Storage = mongoose.model('Storage');

const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;
    const storages = await Storage.paginate({}, { page, limit: 10 });
    return res.json(storages);
  },

  async show(req, res) {
    const storage = await Storage.findById(req.params.id);
    res.type(storage.mimetype);
    return res.send(storage.content);
  },

  async store(req, res) {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    const storage = await Storage.create({
      filename: req.file.originalname,
      encoding: 'base64',
      mimetype: req.file.mimetype,
      size: req.file.size,
      content: new Buffer(encode_image, 'base64'),
    });

    //Upload bucket clear
    await unlinkAsync(req.file.path);
    return res.json(storage);
  },

  async update(req, res) {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    const storage = await Storage.findByIdAndUpdate(req.params.id, {
      filename: req.file.originalname,
      encoding: 'base64',
      mimetype: req.file.mimetype,
      size: req.file.size,
      content: new Buffer(encode_image, 'base64'),
    });
    //Upload bucket clear
    await unlinkAsync(req.file.path);
    return res.json(storage);
  },

  async destroy(req, res) {
    await Storage.findByIdAndRemove(req.params.id);
    return res.send();
  },
};
