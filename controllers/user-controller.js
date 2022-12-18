const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const userController = {
  // User register
  // POST /api/users/register
  register: async (req, res, next) => {
    const { role, email, account, password, confirmPassword } = req.body

    // Check if there is missing data
    if (!role || !email || !account || !password || !confirmPassword) {
      return res.status(400).json({
        type: 'Register failed',
        field_errors: {
          role: 'required',
          email: 'required',
          account: 'required',
          password: 'required',
          confirmPassword: 'required',
        },
      })
    }

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
        field_errors: {
          role: 'string',
          email: 'string',
          account: 'string',
          password: 'string',
          confirmPassword: 'string',
        },
      })
    }

    try {
      // Check if email or account have been registered
      const user = await prisma.user.findFirst({
        where: {
          email: email,
          account: account,
        },
      })

      if (!user) {
        await prisma.user.create({
          data: {
            role: role,
            email: email,
            account: account,
            password: await bcrypt.hash(password, 10),
          },
        })
      } else if (user) {
        return res.status(400).json({
          type: 'Register failed',
          field_errors: {
            email: 'used',
            account: 'used',
          },
        })
      }

      return res.status(201).end()
    } catch (error) {
      next(error)
    }
  },
}

module.exports = userController
