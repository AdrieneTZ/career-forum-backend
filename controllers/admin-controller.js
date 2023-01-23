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
      const offset = getOffset(page, limit)

      // Count user data
      const count = await prisma.user.count({
        skip: offset,
        take: limit,
      })

      // If no approvelStatus value in request query, get all users data
      if (queryApprovalStatus === '') {
        const users = await prisma.user.findMany({
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
        console.log(users)

        if (users === 'undefined') {
          return res.status(404).json({
            status: 'error',
            message: 'Users data are not found.',
          })
        } else if (users) {
          return res.status(200).json({
            status: 'success',
            message: 'Get users',
            count,
            users,
          })
        }
      } else if (queryApprovalStatus) {
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

        if (users === 'undefined') {
          return res.status(404).json({
            status: 'error',
            message: 'Users data are not found.',
          })
        } else if (users) {
          users.count = count
          return res.status(200).json({
            status: 'success',
            message: 'Get users',
            count,
            users,
          })
        }
      }
    } catch (error) {
      next(error)
    }
  },
  // Admin change user's approval status on backstage
  // PATCH /api/v1/admins/users/:id
  patchUsers: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
    } catch (error) {
      next(error)
    }
  },
}

module.exports = adminController
