const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { getOffset } = require('../helpers/pagination-helpers')

const questionController = {
  // GET api/questions 取得所有問題且附帶一筆最新回答
  getQuestions: async (req, res, next) => {
    try {
      const DEFAULT_PAGE = 1
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || DEFAULT_PAGE
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const count = await prisma.question.count({
        skip: offset,
        take: limit,
      })
      const questions = await prisma.question.findMany({
        include: {
          _count: {
            select: {
              Answers: true
            },
          },
          User: {
            select: {
              id: true,
              role: true,
              avatar: true,
            },
          },
          Answers: {
            include: {
              User: {
                select: {
                  id: true,
                  role: true,
                  avatar: true,
                },
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit,
      })
      res.status(200).json({
        status: 'success',
        message: "Get questions",
        count,
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
