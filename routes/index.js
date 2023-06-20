const express = require('express') // Include express
const router = express.Router() // Use Router module
const home = require('./modules/home') // Include home route
const Copy = require('./modules/copy') // Include copy route


// Set 'home' route: if address matches '/' route, use 'home' router
router.use('/', home)

// Set 'copy' route: if address matches '/copy' route, use 'home' router
router.use('/copy', Copy)

module.exports = router // export router