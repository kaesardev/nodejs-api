const express = require('express');
const routes = express.Router();
const passportApp = require('../middlewares/passport-app');

//App Routes
routes.post('/app', passportApp.authenticate('local'), (req, res) => {
  console.log(req.user);
  return res.json({ token: req.user.genToken() });
});

//Authenticate Routes
const authRoutes = require('./auth');
routes.use('/auth', passportApp.authenticate('jwt'), authRoutes);

//Database Routes
const databaseRoutes = require('./database');
routes.use('/database', passportApp.authenticate('jwt'), databaseRoutes);

//Storage Routes
const storageRoutes = require('./storage');
routes.use('/storage', passportApp.authenticate('jwt'), storageRoutes);

module.exports = routes;
