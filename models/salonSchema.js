const mongoose = require('mongoose');

const SalonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  addressLine: { type: String, required: true },
  suburb: { type: String, required: true },
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  categoriesAndServices: [
    {
      category: { type: String, required: true },
      services: { type: [String], required: true }, // Array of services under each category
    },
  ],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Reference to the Admin
});

module.exports = mongoose.model('Salon', SalonSchema);