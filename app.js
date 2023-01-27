if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const cors = require('cors')
const passport = require('./config/passport')
const { clearTempFile } = require('./helpers/file-helpers')
const { generalErrorHandler } = require('./middlewares/error-handler')
const routes = require('./routes')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(passport.initialize())

app.use('/api/v1', routes)
app.use('/', (req, res) => { res.send('Fallback: Oops! Something went wrong.') }) //Fallback
app.use('/', generalErrorHandler) // Error handler

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`This app is listening on port ${port}.`))
}

setInterval(clearTempFile, 43200000) // 單位是ms毫秒，相當於半天(12小時)清理一次

module.exports = app
