const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { getOffset } = require('../helpers/pagination-helpers')

const questionController = {
  // GET api/questions 取得所有問題且附帶一筆最新回答
  // count的問題還沒解決：https://github.com/prisma/prisma/discussions/3087
  getQuestions: async (req, res, next) => {
    try {
      const DEFAULT_PAGE = 1
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || DEFAULT_PAGE
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const questions = await prisma.question.findMany({
        include: {
          user: {
            select: {
              id: true,
              role: true,
              account: true,
              avatar: true,
            },
          },
          answers: {
            include: {
              user: {
                select: {
                  id: true,
                  role: true,
                  account: true,
                  avatar: true,
                },
              }
            },
            orderBy:{
              createdAt: 'desc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip:offset,
        take:limit,
        count: true
      })
      res.status(200).json({
        status: 'success',
        message: "Get questions",
        // count,
        page,
        limit,
        questions
      })
    } catch (error) {
      next(error)
    }
  },
  postQuestion: async (req, res, next) => {
    try {
      const { title, content } = req.body
      const userId = req.user.id
      if (!content || !title) return res.status(400).json({
        status: 'error',
        message: 'Title and content is required.',
      })
      const question = await prisma.question.create({
        data: {
          title,
          content,
          userId
        },
      })
      res.status(200).json({
        status: 'success',
        message: "成功新增問題",
        question
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = questionController
