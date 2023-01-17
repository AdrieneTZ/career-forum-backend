const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const questions = require('./modules/questions')
// const answers = require('./modules/answers')
// const admins = require('./modules/admins')

const userController = require('../controllers/user-controller')
const { authenticated, authPermissionRole } = require('../middlewares/auth-req')

// User login
router.post('/login', userController.login)
// User register
router.post('/register', userController.register)

router.use('/users', authenticated, users)
router.use('/questions', authenticated, questions)
// router.use('/answers', authenticated, answers)
// router.use('/admin', authenticated, authPermissionRole, admins)

module.exports = router