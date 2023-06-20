const mongoose = require('mongoose') // Include mongoose to connect database

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

module.exports = db