let mongoose = require('mongoose');
let MovieSchema = require('../schemas/model');
let Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;