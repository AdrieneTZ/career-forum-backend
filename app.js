if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const cors = require('cors')
const passport = require('./config/passport')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded)
app.use(express.json())
app.use(passport.initialize({ extended: true }))

app.use('/api', routes)
app.listen(port, () => console.log(`This app is listening on port ${port}.`))

module.exports = app
