const passportApp = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const Models = require('./mongoose');
const App = Models.App;

passportApp.use(
  'local',
  new LocalStrategy(
    { usernameField: 'app_key', passwordField: 'app_pass' },
    function (app_key, app_pass, done) {
      App.findOne({ app_key, app_pass }, (err, user) => {
        if (err) return done(err);
        if (!user)
          return done(null, false, { error: 'Incorrect api credentials!' });
        return done(null, user);
      });
    }
  )
);

passportApp.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, cb) {
      App.findById(jwtPayload.id)
        .then((user) => cb(null, user))
        .catch((err) => cb(err));
    }
  )
);

passportApp.serializeUser(function (user, done) {
  done(null, user.id);
});

passportApp.deserializeUser(function (id, done) {
  App.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passportApp;
