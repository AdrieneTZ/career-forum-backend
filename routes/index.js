const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')
const users = require('./modules/users')
const { authenticated } = require('../middlewares/auth-req')

// User login
router.post('/login', userController.login)
// User register
router.post('/register', userController.register)
// user routes
router.use('/users', authenticated, users)

module.exports = router
