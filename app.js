const express = require('express') // Include express
const exphbs = require('express-handlebars') //Include express-handlebars modules


// Use dotenv in non-production machine
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = 3000 // Set web port
const app = express() // Use express

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // Set hbs engine: defaultLayout and extname
app.set('view engine', 'hbs') //use view engine

app.use(express.static('public')) // Use static files including JS and CSS

// Set home route
app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Web is running on http://localhost:${port}`)
})