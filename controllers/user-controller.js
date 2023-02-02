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
        },
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User does not exist',
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
          message: 'User does not exist',
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
  putUser: async (req, res, next) => {
    try {
      const { role, name, password, confirmPassword } = req.body
      const paramsId = Number(req.params.id)
      if (!role?.trim() || !password?.trim() || !confirmPassword?.trim())
        return res.status(400).json({
          status: '400FR',
          message:
            'Field: role, account, password and confirmPassword are required.',
        })
      if (name.length > 20)
        return res.status(400).json({
          status: '400FL',
          message: 'Field: name length has to be less than 20 characters.',
        })
      if (password !== confirmPassword)
        return res.status(400).json({
          status: '400FM',
          message: 'Field: password and confirmPassword are not matched.',
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
          message: 'User is not found',
        })
      const updatedUser = await prisma.user.update({
        where: { id: paramsId },
        data: {
          role,
          name,
          password: await bcrypt.hash(password, 10),
          avatar: avatarFilePath || user.avatar,
          cover: coverFilePath || user.cover,
        },
      })
      delete updatedUser.password
      res.status(200).json({
        status: 'success',
        message: '成功修改個人資料',
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
          message: 'User is not found',
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
        message: '成功刪除封面照',
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
          message: 'User is not found',
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
        message: '成功刪除頭像',
        user: updatedUser,
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = userController
