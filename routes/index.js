const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const { authenticated } = require('../middlewares/auth-req')

router.use('/users', authenticated, users)

module.exports = router
