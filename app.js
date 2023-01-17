if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const passport = require('./config/passport')
const { generalErrorHandler } = require('./middlewares/error-handler')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

app.use('/api/v1', routes)
app.use('/', (req, res) => { res.send('Fallback: Oops! Something went wrong.') })
app.use('/', generalErrorHandler)

app.listen(port, () => console.log(`This app is listening on port ${port}.`))

module.exports = app
