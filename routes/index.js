const express = require('express')
const router = express.Router()
const userController = require('../controller = require('./modules/user-controller')
const user/user')
const question = require('./modules/question')
// const answer')
con = require('./modulest question = require('./modules/question/answer')
// const answer = require('./modules/answer')
// const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
// const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const { authenticated, authAdmin, authAdmin } = require('../middlewares/auth-req')

// User login
router.post('/login', userController.login)
// User register
router.post('/register', userController.register)

// User login
router.post('/login', userController.login)
// User register
router.post('/register', userController.register)

router.use('/users', authenticated, user)
router.use('/questions', authenticated, question)
// router.use('/answers', authenticated, answer)
// router.use('/admin', authenticated, authAdmin, admin)
router.use('/users', authenticated, user)
router.use('/questions', authenticated, question)
// router.use('/answers', authenticated, answer)
// router.use('/admin', authenticated, authAdmin, admin)

module.exports = router
