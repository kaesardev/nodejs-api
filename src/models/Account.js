const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const AccountSchema = new mongoose.Schema({
  displayName: { type: String, require: true },
  photoURL: { type: String },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, require: true },
  googleId: { type: String, unique: true },
  facebookId: { type: String, unique: true },
  instagramId: { type: String, unique: true },
  twitterId: { type: String, unique: true },
  provider: { type: String, default: 'email' },
  createdAt: { type: Date, default: Date.now },
});

AccountSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 8);
});

AccountSchema.methods = {
  val() {
    const user_json = JSON.stringify(this);
    var user_val = JSON.parse(user_json);
    delete user_val.password;
    delete user_val._v;
    return user_val;
  },
  validPassword(hash) {
    return bcrypt.compare(hash, this.password);
  },
  genToken() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24, //1d
    });
  },
};

module.exports = mongoose.model('Account', AccountSchema);
