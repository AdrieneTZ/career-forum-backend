const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

// 取得當前使用者
router.get('/current_user', userController.getCurrentUser)

module.exports = router
