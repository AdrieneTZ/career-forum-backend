const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
// const { getUser } = require('../helpers/req-helpers')

const prisma = new PrismaClient()

const userController = {
  // User register
  // POST /api/users/register
  register: async (req, res, next) => {
    let { role, email, account, password, confirmPassword } = req.body

    // Check data type
    if (
      typeof role !== 'string' ||
      typeof email !== 'string' ||
      typeof account !== 'string' ||
      typeof password !== 'string' ||
      typeof confirmPassword !== 'string'
    ) {
      return res.status(400).json({
        type: 'Register failed',
        title: 'Incorrect datatype',
        field_errors: {
          role: 'string',
          email: 'string',
          account: 'string',
          password: 'string',
          confirmPassword: 'string',
        },
      })
    }

    // Remove white space in each string
    role = role.replace(/\s+/g, '')
    email = email.replace(/\s+/g, '')
    account = account.replace(/\s+/g, '')
    password = password.replace(/\s+/g, '')
    confirmPassword = confirmPassword.replace(/\s+/g, '')

    // Check if there is missing data
    if (!role || !email || !account || !password || !confirmPassword) {
      return res.status(400).json({
        type: 'Register failed',
        title: 'Missing required data',
        field_errors: {
          role: 'required',
          email: 'required',
          account: 'required',
          password: 'required',
          confirmPassword: 'required',
        },
      })
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      })

      // Check if email have been registered
      if (!user) {
        await prisma.user.create({
          data: {
            role: role,
            email: email,
            account: account,
            approvalStatus: 'reviewing',
            password: await bcrypt.hash(password, 10),
            isAdmin: false,
            isSuspended: false,
            isDeleted: false,
          },
        })
      } else if (user) {
        return res.status(400).json({
          type: 'Register failed',
          title: 'Email is used',
          field_errors: {
            email: 'used',
          },
        })
      }

      return res.status(201).end()
    } catch (error) {
      next(error)
    }
  },

  // User login with an eamil address
  // POST /api/users/login
  login: async (req, res, next) => {
    let { email, password } = req.body

    // Remove white space in each string
    email = email.replace(/\s+/g, '')
    password = password.replace(/\s+/g, '')

    // Check if there is missing data
    if (!email || !password) {
      return res.status(400).json({
        type: 'Login failed',
        title: 'Missing required data',
        field_errors: {
          email: 'required',
          password: 'required',
        },
      })
    }

    // Check data type
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        type: 'Login failed',
        title: 'Incorrect datatype',
        field_errors: {
          email: 'string',
          password: 'string',
        },
      })
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      })

      // Check if the current user has been suspended or deleted
      if (user.isSuspended || user.isDeleted) {
        return res.status(400).json({
          type: 'Login failed',
          title: 'Been suspended or deleted',
          field_errors: {
            isSuspended: 'true',
            isDeleted: 'true',
          },
        })
      }

      // Check if the current user has registered an account
      if (!user) {
        return res.status(400).json({
          type: 'Login failed',
          title: 'Incorrect email or password',
          field_errors: {
            email: 'incorrect',
            password: 'incorrect',
          },
        })
      }

      // Check password
      const isCorrectPassword = await bcrypt.compare(password, user.password)
      if (!isCorrectPassword) {
        return res.status(400).json({
          type: 'Login failed',
          title: 'Incorrect email or password',
          field_errors: {
            email: 'incorrect',
            password: 'incorrect',
          },
        })
      }

      // Check approval status
      if (user.approvalStatus !== 'approved') {
        res.status(400).json({
          type: 'Login failed',
          title: 'Unapproved user',
          field_errors: {
            approvalStatus: 'must be approved',
          },
        })
        // add admin login with admin account
      } else if (user.approvalStatus === 'approved') {
        // Remove password from user object for security purpose
        const { password, ...restUserData } = user

        // Sign a token
        const token = jwt.sign(restUserData, process.env.JWT_SECRET, {
          expiresIn: '9d',
        })

        return res.status(200).json({ token: token })
      }
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
          account: true,
          avatar: true,
          cover: true,
          createdAt: true,
          updatedAt: true,
        }
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User does not exist'
        })
      }
      res.status(200).json(user)
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
          account: true,
          avatar: true,
          cover: true,
          approvalStatus: true,
          createdAt: true,
          updatedAt: true,
        }
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User does not exist'
        })
      }
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  },
  putUserSetting: async (req, res, next) => {
    try {
      // const currentUser = helpers.getUser(req)
      // const { account, name, email, password, checkPassword } = req.body
      // const paramsId = Number(req.params.id)
      // if (!account?.trim() || !name?.trim() || !email?.trim() || !password?.trim() || !checkPassword?.trim()) throw new Error('所有欄位皆為必填!')
      // if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
      // if (name?.length > 50) throw new Error('暱稱 name 上限 50 字!')
      // const [user, userFoundByAccount, userFoundByEmail] = await Promise.all([
      //   User.findByPk(paramsId),
      //   User.findOne({ where: { account }, raw: true }),
      //   User.findOne({ where: { email }, raw: true })
      // ])
      // if ((account === userFoundByAccount?.account) && (userFoundByAccount?.id !== currentUser.id)) throw new Error('account 已重複註冊!')
      // if ((email === userFoundByEmail?.email) && (userFoundByEmail?.id !== currentUser.id)) throw new Error('email 已重複註冊!')
      // const renewUser = await user.update({
      //   account,
      //   name,
      //   email,
      //   password: bcrypt.hashSync(password, 10)
      // })
      // const renewUserData = renewUser.toJSON()
      // delete renewUserData.password
      // res.json({ status: 'success', message: '帳號內容已成功修改!', renewUser: renewUserData })
    } catch (error) {
      next(error)
    }
  },
  patchUserAvatar: async (req, res, next) => {
    try {
      // const paramsId = Number(req.params.id)
      // const user = await User.findByPk(paramsId)
      // if (!user) throw new Error('使用者不存在!')
      // const updatedUser = await user.update({
      //   cover: 'https://i.imgur.com/dIsjVjn.jpeg' || user.cover
      // })
      // const updatedUserData = updatedUser.toJSON()
      // delete updatedUserData.password
      // res.status(200).json(updatedUserData)
    } catch (error) {
      next(error)
    }
  },
  patchUserCover: async (req, res, next) => {
    try {
      // const paramsId = Number(req.params.id)
      // const user = await User.findByPk(paramsId)
      // if (!user) throw new Error('使用者不存在!')
      // const updatedUser = await user.update({
      //   cover: 'https://i.imgur.com/dIsjVjn.jpeg' || user.cover
      // })
      // const updatedUserData = updatedUser.toJSON()
      // delete updatedUserData.password
      // res.status(200).json(updatedUserData)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
