const express = require('express')
const router = express.Router()
const upload = require('../../middlewares/multer')
const userController = require('../../controllers/user-controller')
const { authCurrentUser } = require('../../middlewares/auth-req')

// 取得當前使用者
router.get('/current_user', userController.getCurrentUser)
// 修改個人資料中的頭像
router.patch('/:id/avatar', authCurrentUser, upload.fields({ name: 'cover', maxCount: 1 }), userController.patchUserAvatar)
// 修改個人資料中的背景圖
router.patch('/:id/cover', authCurrentUser, upload.fields({ name: 'cover', maxCount: 1 }), userController.patchUserCover)
// 修改個人檔案
router.put('/:id/profile', authCurrentUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUserProfile)
// 修改個人帳號設定
router.put('/:id/setting', authCurrentUser, userController.putUserSetting)
// 取得單筆使用者
router.get('/:id', userController.getUser)

module.exports = router
