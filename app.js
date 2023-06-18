const express = require('express') // Include express
const exphbs = require('express-handlebars') // Include express-handlebars modules
const mongoose = require('mongoose') // Include mongoose to connect database
const bodyParser = require('body-parser') // Include body-parser module to decode info from "POST" method
const URL = require('./models/URL')

// Use dotenv in non-production machine
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // Connect to MongoDB
const db = mongoose.connection // Get the connection status on MongoDB

// connect error
db.on('error', () => {
  console.log('mongodb error')
})

//connect successfully
db.once('open', () => {
  console.log('mongodb connect!')
})

const port = 3000 // Set web port
const app = express() // Use express

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // Set hbs engine: defaultLayout and extname
app.set('view engine', 'hbs') //use view engine

// app.use(express.static('public')) // Use static files including JS and CSS
app.use(bodyParser.urlencoded({ extended: true })) // Regulate each request to be prepared by body-parser

// Set home route
app.get('/', (req, res) => {
  return res.render('index')
})

// Set url shorten page route
app.post('/copy', (req, res) => {

  const urlInput = req.body.url // get user's input

  return URL.find({}) // find all data
    .lean()
    .then((urls) => {
      const data = urls.find(url => url.originalUrl === urlInput || url.shortUrl === urlInput)
      if (data) { // if urlInput already exists in mongodb, just render it
        return res.render('copy', { originalUrl: data.originalUrl, url: data.shortUrl })
      } else { // if not, create new url to mongodb
        const urls = urlShortener(urlInput) // [originalUrl, shortUrl, uniText]
        URL.create({ originalUrl: urls[0], shortUrl: urls[1], uniText: urls[2] })
        return res.render('copy', { originalUrl: urls[0], url: urls[1] })
      }
    })
    .catch((error) => console.log(error))
})

// Set shortUrl route
app.get(`/:uniText`, (req, res) => {
  const uniText = req.params.uniText
  return URL.findOne({ uniText: uniText })
    .lean()
    .then(url => {
      if (!url) {
        return res.render('error', { error: 'This page is not available! Please try again!' })
      } else {
        return res.redirect(url.originalUrl)
      }
    })
})

// Check whether server works
app.listen(port, () => {
  console.log(`Web is running on http://localhost:${port}`)
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
  const uniText = uniTextShuffler(sampleCodes).join('') // Generate uniText
  const shortUrl = 'http://localhost:3000/' + uniText

  return [originalUrl, shortUrl, uniText]
}