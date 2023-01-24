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
}

module.exports = answerController
