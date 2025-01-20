const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photo: { type: String },
  role: { type: String, default: 'admin' }, // 'user' by default
});

module.exports = mongoose.model('Admin', AdminSchema);