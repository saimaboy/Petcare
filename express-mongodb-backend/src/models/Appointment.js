const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  vetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vetName: String,
  vetBusiness: String,
  date: String,
  time: String,
  petName: String,
  ownerName: String,
  reason: String,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);