const mongoose = require('mongoose');
const axios = require('axios');

const Dev = mongoose.model('Dev');

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;
    const devs = await Dev.paginate({}, { page, limit: 10 });
    //const devs = await Dev.find();
    return res.json(devs);
  },

  async show(req, res) {
    const dev = await Dev.findById(req.params.id);
    return res.json(dev);
  },

  async store(req, res) {
    const { github_username = '', techs, latitude, longitude } = req.body;
    const techArray = techs.split(',').map((tech) => tech.trim());
    const ApiResponse = await axios.get(
      `https://api.github.com/users/${github_username}`
    );
    const {
      message = 'Found',
      name = login,
      avatar_url,
      bio,
    } = ApiResponse.data;

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    if (message !== 'Not Found') {
      const dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techArray,
        location,
      });
      return res.json(dev);
    }
    return res.json();
  },

  async update(req, res) {
    const dev = await Dev.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(dev);
  },

  async destroy(req, res) {
    await Dev.findByIdAndRemove(req.params.id);
    return res.send();
  },
};
