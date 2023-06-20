const express = require('express')
const router = express.Router()
const URL = require('../../models/URL') // Include URL Schema

// Set home route
router.get('/', (req, res) => {
  return res.render('index')
})

// Set shortUrl route 
router.get(`/:uniText`, (req, res) => {
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

module.exports = router 