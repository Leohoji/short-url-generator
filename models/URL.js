// This file sets the Schema while creating data to mongodb
const mongoose = require('mongoose') // Include mongoose module
const Schema = mongoose.Schema // Use schema module
const urlSchema = new Schema({
  originalUrl: {
    type: String,
    require: true,
  },
  shortUrl: {
    type: String,
    require: true,
  },
  gibberish: {
    type: String,
    require: true
  }
})

/*
mongoose.model will copy the Schema object we defined and compile it to an available model object, we name the model as URL before exportation for other files to use URL directly and operate any data related url shortener!
*/
module.exports = mongoose.model('URL', urlSchema)