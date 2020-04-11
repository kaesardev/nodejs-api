const express = require('express');
const passportUsr = require('../middlewares/passport-usr');
const routes = express.Router();

const AccountController = require('../controllers/AccountController');

//Views
routes.get('/signup', AccountController.signupForm);
routes.get('/signin', AccountController.signinForm);

//Restrict route user auth
routes.get(
  '/profile',
  passportUsr.authenticate('jwt2'),
  AccountController.currentUser
);

//Email Auth
routes.post('/signup', AccountController.signup);
routes.post(
  '/signin',
  passportUsr.authenticate('email', { session: false }),
  AccountController.signin
);
routes.get(
  '/signout',
  passportUsr.authenticate('jwt2', { session: false }),
  AccountController.signout
);

//Social Auth: Google
routes.get(
  '/google',
  passportUsr.authenticate('google', { scope: ['profile', 'email'] })
);
routes.get(
  '/google/callback',
  passportUsr.authenticate('google', { failureRedirect: '/auth/signin' }),
  AccountController.signin
);

//Social Auth: Facebook
routes.get(
  '/facebook',
  passportUsr.authenticate('facebook', { scope: ['email'] })
);
routes.get(
  '/facebook/callback',
  passportUsr.authenticate('facebook', { failureRedirect: '/auth/signin' }),
  AccountController.signin
);

//Social Auth: Instagram
routes.get('/instagram', passportUsr.authenticate('instagram'));
routes.get(
  '/instagram/callback',
  passportUsr.authenticate('instagram', { failureRedirect: '/auth/signin' }),
  AccountController.signin
);

//Social Auth: Twitter
routes.get('/twitter', passportUsr.authenticate('twitter'));
routes.get(
  '/twitter/callback',
  passportUsr.authenticate('twitter', { failureRedirect: '/auth/signin' }),
  AccountController.signin
);

module.exports = routes;
