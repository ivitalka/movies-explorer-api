const validator = require('validator');
const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
    },
  },
  trailer: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
    },
  },
  owner: {
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    select: false,
  },
  movieId: {
    type: Number,
    require: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('movie', MovieSchema);
