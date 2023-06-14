const express = require('express') // Include express
const exphbs = require('express-handlebars') //Include express-handlebars modules




const port = 3000 // Set web port

const app = express() // Use express

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) // Set hbs engine: defaultLayout and extname
app.set('view engine', 'hbs') //use view engine

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`Web is running on http://localhost:${port}`)
})