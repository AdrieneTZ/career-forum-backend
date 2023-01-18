const express = require('express')
const router = express.Router()
const users = require('./modules/users')
const questions = require('./modules/questions')
// const answers = require('./modules/answers')
// const admins = require('./modules/admins')

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const { authenticated, authPermissionRole, authApprovalStatus } = require('../middlewares/auth-req')

// User login
router.post('/login', passport.authenticate('local', { session: false }), userController.login)
// User register
router.post('/register', userController.register)

router.use('/users', authenticated, authApprovalStatus, users)
router.use('/questions', authenticated, authApprovalStatus, questions)
// router.use('/answers', authenticated, answers)
// router.use('/admin', authenticated, authPermissionRole, admins)

module.exports = router