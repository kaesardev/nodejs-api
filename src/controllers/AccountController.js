const mongoose = require('mongoose');
const Account = mongoose.model('Account');

module.exports = {
  async currentUser(req, res) {
    return res.json({ data: req.user.val() });
  },

  async signin(req, res, next) {
    req.login(req.user, function (err) {
      if (err) return next(err);
      const token = req.user.genToken();
      return res.json({ data: req.user.val(), token });
    });
  },

  async signup(req, res, next) {
    try {
      const filter = { email: req.body.email, provider: 'email' };
      if (await Account.findOne(filter)) {
        return res.status(400).json({ error: 'Email is already in use!' });
      }

      const user = await Account.create(req.body);

      req.login(user, function (err) {
        if (err) return next(err);
        const token = user.genToken();
        return res.json({ data: user.val(), token });
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: 'User registration failed' });
    }
  },

  async signout(req, res) {
    if (req.user) {
      req.logout();
      return res.json({ auth: true, result: true });
    }
    return res.json({ auth: false, result: false });
  },

  async signinForm(req, res) {
    return res.render('signin');
  },

  async signupForm(req, res) {
    return res.render('signup');
  },
};
