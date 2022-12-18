if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const express = require('express')
const passport = require('./config/passport')
const routes = require('./routes')

const app = express()
const port = 3000

app.use(passport.initialize())

app.use('/api', routes)
app.listen(port, () => console.log(`This app is listening on port ${port}.`))

module.exports = app
