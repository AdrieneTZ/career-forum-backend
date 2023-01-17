const express = require('express')
const router = express.Router()
const user = require('./modules/user')
const question = require('./modules/question')
// const answer = require('./modules/answer')
// const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const { authenticated, authPermissionRole } = require('../middlewares/auth-req')

// User login
router.post('/login', userController.login)
// User register
router.post('/register', userController.register)

router.use('/users', authenticated, user)
router.use('/questions', authenticated, question)
// router.use('/answers', authenticated, answer)
// router.use('/admin', authenticated, authPermissionRole, admin)

module.exports = router