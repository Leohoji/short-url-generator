const express = require('express') // Include express
const exphbs = require('express-handlebars') // Include express-handlebars modules
const bodyParser = require('body-parser') // Include body-parser module to decode info from "POST" method
const routes = require('./routes')

const port = 3000 // Set web port
const app = express() // Use express

// Use dotenv in non-production machine
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose') //Include mongoose module

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // Set hbs engine: defaultLayout and extname
app.set('view engine', 'hbs') //use view engine

app.use(bodyParser.urlencoded({ extended: true })) // Regulate each "post" request to be prepared by body-parser
app.use(routes) // Introduce request to routes

// Check whether server works
app.listen(port, () => {
  console.log(`Web is running on http://localhost:${port}`)
})