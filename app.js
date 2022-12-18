const express = require('express')

const routes = require('./routes')

const app = express()
const port = 3001

app.use('/api', routes)
app.listen(port, () => console.log(`This app is listening on port ${port}.`))

module.exports = app
