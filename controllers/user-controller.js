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
      // ??????????????????????????????????????????????????????
      if (
        oldPassword.includes(' ') ||
        password.includes(' ') ||
        confirmPassword.includes(' ')
      )
        return res.status(400).json({
          status: '400FS',
          message:
            'Field: white space is not allowed in oldPassword, password or confirmPassword.',
        })
      if (!oldPassword?.trim() || !password?.trim() || !confirmPassword?.trim())
        // ???????????????????????????????????????????????????????????????
        return res.status(400).json({
          status: '400FR',
          message:
            'Field: oldPassword, password and confirmPassword are required.',
        })
      // ???????????????????????????????????????8
      if (password.trim().length < 8)
        return res.status(400).json({
          status: '400FL',
          message:
            'Field: password and confirmPassword length have to be more than 8 characters.',
        })
      // ???????????????????????????
      if (password !== confirmPassword)
        return res.status(400).json({
          status: '400FM',
          message: 'Field: password and confirmPassword are not matched.',
        })
      // ??? id ???????????????
      const user = await prisma.user.findUnique({ where: { id: paramsId } })
      if (!user)
        return res.status(404).json({
          status: 'error',
          message: 'User is not found.',
        })
      // ???????????????????????????????????????
      const passwordCompare = await bcrypt.compare(oldPassword, user.password)
      if (!passwordCompare) {
        const error = new Error('Wrong oldPassword.')
        error.status = 401
        throw error
      }
      // ?????????????????????
      const updatedUser = await prisma.user.update({
        where: { id: paramsId },
        data: {
          password: await bcrypt.hash(password, 10),
        },
      })
      // ????????????????????????????????????
      delete updatedUser.password
      // ?????? email ????????? admin ??????????????? admin ????????????????????????????????? admin ??????
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
