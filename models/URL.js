// This file sets the Schema while creating data to mongodb
const mongoose = require('mongoose') // Include mongoose module
const Schema = mongoose.Schema // Use schema module
const urlSchema = new Schema({
  url: {
    type: String,
    require: true,
  }
})

module.exports = mongoose.module('URL', urlSchema)