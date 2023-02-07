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
              name: true,
              avatar: true,
            },
          },
          Answers: {
            include: {
              User: {
                select: {
                  id: true,
                  role: true,
                  name: true,
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
      if (!questions) res.status(404).json({
        status: 'error',
        message: 'Questions are not found.'
      })
      const renewQuestions = questions
        .map(question => ({
          ...question,
          answersCount: question._count.Answers
        }))
      res.status(200).json({
        status: 'success',
        message: "Get questions",
        count,
        page,
        limit,
        questions: renewQuestions
      })
    } catch (error) {
      next(error)
    }
  },
  // GET api/question/:id 取得一筆問題
  getQuestion: async (req, res, next) => {
    try {
      const questionId = Number(req.params.id)
      const [question, answerCount] = await Promise.all([
        prisma.question.findUnique({
          where: {
            id: questionId
          },
          include: {
            User: {
              select: {
                id: true,
                role: true,
                name: true,
                avatar: true,
              },
            }
          }
        }),
        prisma.answer.count({ where: { questionId } })
      ])
      if (!question) res.status(404).json({
        status: 'error',
        message: 'The question is not found.'
      })
      question.answerCount = answerCount
      res.status(200).json({
        status: 'success',
        message: "Get specific question.",
        question
      })
    } catch (error) {
      next(error)
    }
  },
  // GET api/questions/:id/answers 取得問題底下所有回答
  getQuestionAnswers: async (req, res, next) => {
    try {
      const DEFAULT_PAGE = 1
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || DEFAULT_PAGE
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const questionId = Number(req.params.id)
      const answers = await prisma.answer.findMany({
        where: { questionId },
        include: {
          User: {
            select: {
              id: true,
              role: true,
              name: true,
              avatar: true,
            },
          }
        },
        skip: offset,
        take: limit,
      })
      if (!answers) {
        return res.status(404).json({
          status: 'error',
          message: `The question's answers are not found.`,
        })
      }
      const count = await prisma.answer.count({
        where: { questionId },
        skip: offset,
        take: limit,
      })
      res.status(200).json({
        status: 'success',
        message: `Get specific question's answers.`,
        count,
        page,
        limit,
        answers
      })
    } catch (error) {
      next(error)
    }
  },
  postQuestion: async (req, res, next) => {
    try {
      const { title, content } = req.body
      const userId = req.user.id
      if (!title || !content) return res.status(400).json({
        status: '400FR',
        message: 'Field: title and content are required.'
      })
      if (title?.trim().length > 50) return res.status(400).json({
        status: '400FL',
        message: 'Field: title length should be under 50 characters.'
      })
      if (content?.trim().length > 500) return res.status(400).json({
        status: '400FL',
        message: 'Field: content length should be under 500 characters.'
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
  // PUT api/question/:id 修改問題
  putQuestion: async (req, res, next) => {
    try {
      const questionId = Number(req.params.id)
      const userId = req.user.id
      const { title, content } = req.body
      const question = await prisma.question.findUnique({
        where: { id: questionId }
      })
      if (!question) return res.status(404).json({
        status: 'error',
        message: 'The question is not found.'
      })
      if (question.userId !== userId) return res.status(403).json({
        status: 'error',
        message: 'Permission denied.'
      })
      if (!title || !content) return res.status(400).json({
        status: '400FR',
        message: 'Field: title and content are required.'
      })
      if (title?.trim().length > 50 ) return res.status(400).json({
        status: '400FL',
        message: 'Field: title length should be under 50 characters.'
      })
      if (content?.trim().length > 500) return res.status(400).json({
        status: '400FL',
        message: 'Field: content length should be under 500 characters.'
      })
      const updatedQuestion = await prisma.question.update({
        where: { id: questionId },
        data: {
          title,
          content
        }
      })
      res.status(200).json({
        status: 'success',
        message: 'Successfully modify the question',
        question: updatedQuestion
      })
    } catch (error) {
      next(error)
    }
  },
  // DELETE api/question/:id 刪除問題；刪除時連同關聯回答一併刪除
  deleteQuestion: async (req, res, next) => {
    try {
      const questionId = Number(req.params.id)
      const userId = req.user.id
      const question = await prisma.question.findUnique({
        where: { id: questionId }
      })
      if (!question) return res.status(404).json({
        status: 'error',
        message: 'The question is not found.'
      })
      if (question.userId !== userId) return res.status(403).json({
        status: 'error',
        message: 'Permission denied.'
      })
      const deletedQuestion = await prisma.question.delete({
        where: { id: questionId }
      })
      res.status(200).json({
        status: 'success',
        message: 'Successfully delete the question',
        question: deletedQuestion
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = questionController
