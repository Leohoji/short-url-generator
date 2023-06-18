const express = require('express') // Include express
const exphbs = require('express-handlebars') // Include express-handlebars modules
const mongoose = require('mongoose') // Include mongoose to connect database
const bodyParser = require('body-parser') // Include body-parser module to decode info from "POST" method

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
  const url = urlShortener(req.body.url)
  console.log(url)
  return res.render('copy')
})

// Check whether server works
app.listen(port, () => {
  console.log(`Web is running on http://localhost:${port}`)
})


// Gibberish generator
function gibberishGenerator(database) {
  /*
  This function will generate a gibberish.
  Parameter:
  database: Array
  Return: 
  Random value of index in database
  */
  const index = Math.floor(Math.random() * database.length)
  return database[index]
}

// Shuffle algorithm
function gibberishShuffler(sampleCodes) {
  /*
  This function will generate a gibberish shuffled.
  Parameter:
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
function urlShortener(url) {
  /* 
  This is an url shortener function, inputting the url what you would like to shorten.
  Parameter:
  url: String
  Return: 
  An array: [url, newUrl, gibberish]
  */
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()
  const numbers = '1234567890'
  const gibberishDatabase = [lowerCaseLetters, upperCaseLetters, numbers]
  const sampleCodes = []
  let newUrl = ''

  // Generate three codes containing lowercase, uppercase and number
  for (let randomSample of gibberishDatabase) {
    sampleCodes.push(gibberishGenerator(randomSample))
  }

  // Generate two random codes from gibberishDatabase
  for (let i = 0; i < 2; i++) {
    const randomCode = gibberishGenerator(gibberishDatabase)
    sampleCodes.push(gibberishGenerator(randomCode))
  }

  // Further randomize sampleCodes to generate a real gibberish
  const gibberish = gibberishShuffler(sampleCodes).join('') // Generate gibberish

  let urlElements = url.split('/') // Split url
  // Check whether 'https' string is present 
  if (urlElements.includes('https:')) {
    newUrl += urlElements[0] + '//url-shortener-fly-io/' + gibberish
  } else {
    newUrl += 'https://url-shortener-fly-io/' + gibberish
  }

  return [url, newUrl, gibberish]
}