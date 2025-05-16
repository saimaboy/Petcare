const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  species: {
    type: String,
    required: [true, 'Please specify the species'],
    enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile', 'Small mammal', 'Other']
  },
  breed: {
    type: String,
    maxlength: [100, 'Breed cannot be more than 100 characters']
  },
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown']
  },
  weight: Number,
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pet', PetSchema);