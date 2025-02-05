const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photo: { type: String },
  role: { type: String, default: 'user' },
});

module.exports = mongoose.model('User', UserSchema);