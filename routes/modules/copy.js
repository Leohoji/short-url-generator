const express = require('express')
const router = express.Router()
const URL = require('../../models/URL')
const Swal = require('sweetalert2')

// Set url shorten page route
router.post('/', (req, res) => {

  const urlInput = req.body.url // get user's input

  return URL.find({}) // find all data
    .lean()
    .then((urls) => {
      // if urlInput already exists in mongodb, just render it
      const data = urls.find(url => url.originalUrl === urlInput || url.shortUrl === urlInput)
      if (data) {
        return res.render('copy', { originalUrl: data.originalUrl, url: data.shortUrl })
      }

      // if not, create new url to mongodb
      const urlOutput = urlShortener(urlInput) // [originalUrl, shortUrl, uniText]
      const checkUnique = urls.find(url => url.uniText === urlOutput[2]) // check whether uniText is unique
      while (checkUnique) {
        urlOutput = urlShortener(urlInput)
        checkUnique = urls.find(url => url.uniText === urlOutput[2])
      }
      URL.create({ originalUrl: urlOutput[0], shortUrl: urlOutput[1], uniText: urlOutput[2] })
      return res.render('copy', { originalUrl: urlOutput[0], url: urlOutput[1] })
    })
    .catch((error) => console.log(error))
})


// UniText generator
function uniTextGenerator(database) {
  /*
  This function will generate a uniText.
  database: Array
  Return: 
  Random value of index in database
  */
  const index = Math.floor(Math.random() * database.length)
  return database[index]
}

// Shuffle algorithm
function uniTextShuffler(sampleCodes) {
  /*
  This function will generate a uniText shuffled.
  sampleCodes: Array containing elements what you would like to shuffle
  Return: 
  SampleCodes shuffled
  */
  for (let index = sampleCodes.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * index + 1);
    [sampleCodes[index], sampleCodes[randomIndex]] = [sampleCodes[randomIndex], sampleCodes[index]]
  }
  return sampleCodes
}

// Set url shortener
function urlShortener(originalUrl) {
  /* 
  This is an url shortener function, inputting the url what you would like to shorten.
  url: String
  Return: 
  An array: [originalUrl, shortUrl, uniText]
  */
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  const uniTextDatabase = [lowerCaseLetters, upperCaseLetters, numbers]
  const sampleCodes = []

  // Generate three codes containing lowercase, uppercase and number
  for (let randomSample of uniTextDatabase) {
    sampleCodes.push(uniTextGenerator(randomSample))
  }

  // Generate two random codes from uniTextDatabase
  for (let i = 0; i < 2; i++) {
    const randomCode = uniTextGenerator(uniTextDatabase)
    sampleCodes.push(uniTextGenerator(randomCode))
  }

  // Further randomize sampleCodes to generate a real uniText
  const uniText = uniTextShuffler(sampleCodes).join('')

  // Generate short-url
  const shortUrl = 'http://localhost:3000/' + uniText

  return [originalUrl, shortUrl, uniText]
}


module.exports = router