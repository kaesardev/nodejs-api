const passportUsr = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const Models = require('./mongoose');
const Account = Models.Account;

passportUsr.use(
  'email',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, done) {
      const filter = { email: email, provider: 'email' };
      Account.findOne(filter, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect email.' });
        if (!user.validPassword(password))
          return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
      });
    }
  )
);

passportUsr.use(
  'jwt2',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromHeader('authorization2'),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, cb) {
      Account.findById(jwtPayload.id)
        .then((user) => cb(null, user))
        .catch((err) => cb(err));
    }
  )
);

function socialLogin(accessToken, refreshToken, profile, cb) {
  const valueFilter = (param) =>
    param && param[0] && param[0].value ? param[0].value : undefined;
  const socialUser = {
    [`${profile.provider}Id`]: profile.id,
    displayName: profile.displayName || undefined,
    photoURL: valueFilter(profile.photos),
    email: valueFilter(profile.emails),
    provider: profile.provider,
  };
  const filter = { [`${profile.provider}Id`]: profile.id };
  Account.findOne(filter, async (err, user) => {
    if (!user) return cb(null, await Account.create(socialUser));
    return cb(null, await Account.findOneAndUpdate(filter, socialUser));
  });
}

passportUsr.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback`,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    socialLogin
  )
);

passportUsr.use(
  'facebook',
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    socialLogin
  )
);

passportUsr.use(
  'instagram',
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/instagram/callback`,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    socialLogin
  )
);

passportUsr.use(
  'twitter',
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}/auth/twitter/callback`,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    },
    socialLogin
  )
);

passportUsr.serializeUser(function (user, done) {
  done(null, user.id);
});

passportUsr.deserializeUser(function (id, done) {
  Account.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passportUsr;
