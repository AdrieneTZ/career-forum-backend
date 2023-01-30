const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { getOffset } = require('../helpers/pagination-helpers')

const adminController = {
  // Admin get all users on backstage
  // GET /api/v1/admins/users?approvalStatus=&page=&limit=
  getUsers: async (req, res, next) => {
    try {
      // Get current page number
      const queryPage = Number(req.query.page)
      const queryLimit = Number(req.query.limit)
      const queryApprovalStatus = req.query.approvalStatus

      // Pagination
      const DEFAULT_PAGE = 1
      const DEFAULT_LIMIT = 10
      const page = queryPage || DEFAULT_PAGE
      const limit = queryLimit || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      // Data
      let users
      let count

      // If there is no approvalStatus value in request query, get all users data
      // If there is value in approvalStatus, get users data with the request value
      if (!queryApprovalStatus) {
        count = await prisma.user.count({
          skip: offset,
          take: limit,
        })

        users = await prisma.user.findMany({
          select: {
            id: true,
            role: true,
            email: true,
            approvalStatus: true,
            avatar: true,
            createdAt: true,
          },
          skip: offset,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        })
      } else if (queryApprovalStatus) {
        count = await prisma.user.count({
          where: {
            approvalStatus: queryApprovalStatus,
          },
          skip: offset,
          take: limit,
        })

        users = await prisma.user.findMany({
          where: {
            approvalStatus: queryApprovalStatus,
          },
          select: {
            id: true,
            role: true,
            email: true,
            approvalStatus: true,
            avatar: true,
          },
          skip: offset,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        })
      }

      if (!users) {
        return res.status(404).json({
          status: 'error',
          message: 'Users data are not found.',
        })
      } else if (users) {
        return res.status(200).json({
          status: 'success',
          message: 'Get users.',
          count,
          users,
        })
      }
    } catch (error) {
      next(error)
    }
  },
  // Admin change user's approval status on backstage
  // PATCH /api/v1/admins/users/:id
  patchUser: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const { approvalStatus } = req.body

      // Check if user data exists
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User data is not found.',
        })
      }

      // Update approvalStatus
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          approvalStatus: approvalStatus,
        },
      })

      delete updatedUser.password
      return res.status(200).json({
        status: 'success',
        message: 'Update approvalStatus',
        updatedUser,
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = adminController
