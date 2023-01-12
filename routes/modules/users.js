const express = require('express')
const router = express.Router()
const upload = require('../../middlewares/multer')
const userController = require('../../controllers/user-controller')
const { authCurrentUser } = require('../../middlewares/auth-req')

// 取得當前使用者
router.get('/current_user', userController.getCurrentUser)

// // 修改個人資料中的頭像
// router.patch('/:id/avatar', authCurrentUser, upload.fields({ name: 'cover', maxCount: 1 }), userController.patchUserAvatar)
// // 修改個人資料中的背景圖
// router.patch('/:id/cover', authCurrentUser, upload.fields({ name: 'cover', maxCount: 1 }), userController.patchUserCover)
// // 修改個人資料
// router.put('/:id', authCurrentUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUserSetting)

module.exports = router
