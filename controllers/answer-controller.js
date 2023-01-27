const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { getOffset } = require('../helpers/pagination-helpers')

const answerController = {
  // Get the specific answer with its id
  // GET /api/v1/answers/:id
  getAnswer: async (req, res, next) => {
    try {
      const answerId = Number(req.params.id)

      const answer = await prisma.answer.findUnique({
        where: { id: answerId },
      })

      // Check if the answer exists
      if (!answer) {
        return res.status(404).json({
          status: 'error',
          message: 'The specific answer is not found.',
        })
      } else if (answer) {
        return res.status(200).json({
          status: 'success',
          message: 'Get the specific answer.',
          answer,
        })
      }
    } catch (error) {
      next(error)
    }
  },

  // Create an answer
  // POST /api/v1/questions/:id/answers
  postAnswer: async (req, res, next) => {
    try {
      const questionId = Number(req.params.id)
      const userId = Number(req.user.id)
      let { content } = req.body

      // To prevent error happening, check the content
      if (!content) {
        return res.status(400).json({
          status: '400F',
          message: 'Field: content is required.',
        })
      }

      if (typeof content !== 'string') {
        return res.status(400).json({
          status: '400F',
          message: 'Field: datatype of the content must be string.',
        })
      }

      content = content.trim()
      if (content.length > 500) {
        return res.status(406).json({
          status: 'error',
          message: 'Content length must be less than 500 characters.',
        })
      }

      const answer = await prisma.answer.create({
        data: {
          content: content,
          userId: userId,
          questionId: questionId,
        },
      })
      return res.status(200).json({
        status: 'success',
        message: 'Create an answer.',
        answer,
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = answerController
