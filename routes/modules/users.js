const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

// User login
router.post('/login', userController.login)
// User register
router.post('/register', userController.register)

module.exports = router
