const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photo: { type: String },
  role: { type: String, default: 'admin' }, // 'admin' by default
  salonDetailsCompleted: { type: Boolean, default: false }, // Tracks if salon details are filled
  salon: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon' }, // Reference to the Salon

});

module.exports = mongoose.model('Admin', AdminSchema);