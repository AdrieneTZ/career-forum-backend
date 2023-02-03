const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { imgurUploadImageHandler } = require('../helpers/file-helpers')

const userController = {
  // User register
  // POST /api/v1/register
  register: async (req, res, next) => {
    try {
      const { role, email, name, password } = req.body

      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      })

      // Check if email have been registered
      if (!user) {
        const user = await prisma.user.create({
          data: {
            role: role,
            email: email,
            name: name,
            password: await bcrypt.hash(password, 10),
            approvalStatus: 'reviewing',
            permissionRole: 'user',
          },
        })

        delete user.password
        return res.status(201).json({
          status: 'success',
          message: 'Register successfully',
          user,
        })
      } else if (user) {
        return res.status(400).json({
          status: '400FD',
          message: 'Field: email has been used.',
        })
      }
    } catch (error) {
      next(error)
    }
  },

  // User login with an eamil address
  // POST /api/v1/login
  login: async (req, res, next) => {
    const user = req.user

    try {
      // Check if the current user has been suspended or deleted
      if (user.suspendedAt || user.deletedAt) {
        return res.status(403).json({
          status: '403',
          message: 'The user is suspended or deleted.',
        })
      }

      // Remove password from user object for security purpose
      const { password, ...restUserData } = user

      // Sign a token
      const token = jwt.sign(restUserData, process.env.JWT_SECRET, {
        expiresIn: '9d',
      })

      return res.status(200).json({ token: token })
    } catch (error) {
      next(error)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      const user = await prisma.user.findUnique({
        where: {
          id: currentUserId,
        },
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          avatar: true,
          cover: true,
          createdAt: true,
          updatedAt: true,
          permissionRole: true,
        },
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User does not exist.',
        })
      }
      res.status(200).json({
        status: 'success',
        message: 'Get current user.',
        user,
      })
    } catch (error) {
      next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const paramsId = Number(req.params.id)
      const user = await prisma.user.findUnique({
        where: {
          id: paramsId,
        },
        select: {
          id: true,
          role: true,
          name: true,
          email: true,
          avatar: true,
          cover: true,
          approvalStatus: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User does not exist.',
        })
      }
      res.status(200).json({
        status: 'success',
        message: 'Get specific user.',
        user,
      })
    } catch (error) {
      next(error)
    }
  },
  putUserProfile: async (req, res, next) => {
    try {
      const { role, name } = req.body
      const paramsId = Number(req.params.id)
      if (!role?.trim() || !name?.trim())
        return res.status(400).json({
          status: '400FR',
          message: 'Field: role and name are required.',
        })
      if (name.length > 20)
        return res.status(400).json({
          status: '400FL',
          message: 'Field: name length has to be less than 20 characters.',
        })
      const { files } = req
      const [user, avatarFilePath, coverFilePath] = await Promise.all([
        prisma.user.findUnique({ where: { id: paramsId } }),
        imgurUploadImageHandler(files?.avatar ? files.avatar[0] : null),
        imgurUploadImageHandler(files?.cover ? files.cover[0] : null),
      ])
      if (!user)
        return res.status(404).json({
          status: 'error',
          message: 'User is not found.',
        })
      const updatedUser = await prisma.user.update({
        where: { id: paramsId },
        data: {
          role,
          name,
          avatar: avatarFilePath || user.avatar,
          cover: coverFilePath || user.cover,
        },
      })
      delete updatedUser.password
      res.status(200).json({
        status: 'success',
        message: 'Update user profile.',
        user: updatedUser,
      })
    } catch (error) {
      next(error)
    }
  },
  putUserSetting: async (req, res, next) => {
    try {
      const { oldPassword, password, confirmPassword } = req.body
      const paramsId = Number(req.params.id)
      // 舊密碼、新密碼及新密碼確認三個欄位皆為必填
      if (!oldPassword?.trim() || !password?.trim() || !confirmPassword?.trim())
        return res.status(400).json({
          status: '400FR',
          message:
            'Field: oldPassword, password and confirmPassword are required.',
        })
      // 密碼與確認密碼長度必須大於8
      if (password.trim().length < 8)
        return res.status(400).json({
          status: '400FL',
          message:
            'Field: password and confirmPassword length have to be more than 8 characters.',
        })
      // 密碼與確認密碼不符
      if (password !== confirmPassword)
        return res.status(400).json({
          status: '400FM',
          message: 'Field: password and confirmPassword are not matched.',
        })
      // 用 id 去找使用者
      const user = await prisma.user.findUnique({ where: { id: paramsId } })
      if (!user)
        return res.status(404).json({
          status: 'error',
          message: 'User is not found.',
        })
      // 看舊密碼跟資料庫的是否一致
      const passwordCompare = await bcrypt.compare(oldPassword, user.password)
      if (!passwordCompare) {
        const error = new Error('Wrong oldPassword.')
        error.status = 401
        throw error
      }
      // 更新使用者密碼
      const updatedUser = await prisma.user.update({
        where: { id: paramsId },
        data: {
          password: await bcrypt.hash(password, 10),
        },
      })
      // 把密碼欄位刪掉不回傳前端
      delete updatedUser.password
      // 如果 email 中包含 admin 且身份也是 admin 權限的話，此為測試專用 admin 帳號
      if (user?.email.includes('admin') && user?.permissionRole === 'admin')
        return res.status(403).json({
          status: 'error',
          message: `Admin-testing account's password can not be modified.`,
        })
      res.status(200).json({
        status: 'success',
        message: 'Update user setting.',
        user: updatedUser,
      })
    } catch (error) {
      next(error)
    }
  },
  patchUserCover: async (req, res, next) => {
    try {
      const paramsId = Number(req.params.id)
      const user = await prisma.user.findUnique({ where: { id: paramsId } })
      if (!user)
        return res.status(404).json({
          status: 'error',
          message: 'User is not found.',
        })
      const updatedUser = await prisma.user.update({
        where: { id: paramsId },
        data: {
          cover: '',
        },
        select: {
          id: true,
          cover: true,
        },
      })
      res.status(200).json({
        status: 'success',
        message: 'Delete cover.',
        user: updatedUser,
      })
    } catch (error) {
      next(error)
    }
  },
  patchUserAvatar: async (req, res, next) => {
    try {
      const paramsId = Number(req.params.id)
      const user = await prisma.user.findUnique({ where: { id: paramsId } })
      if (!user)
        return res.status(404).json({
          status: 'error',
          message: 'User is not found.',
        })
      const updatedUser = await prisma.user.update({
        where: { id: paramsId },
        data: {
          avatar: '',
        },
        select: {
          id: true,
          avatar: true,
        },
      })
      res.status(200).json({
        status: 'success',
        message: 'Delete avatar.',
        user: updatedUser,
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = userController
