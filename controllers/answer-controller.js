const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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

  // Edit the specific answer
  // PUT /api/v1/answers/:id
  putAnswer: async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      const answerId = Number(req.params.id)
      let { content } = req.body

      // Check if the specific answer exists
      const answer = await prisma.answer.findUnique({
        where: {
          id: answerId,
        },
      })

      // If the specific answer doesn't exist, earily return
      if (!answer) {
        return res.status(404).json({
          status: 'error',
          message: 'The specific answer is not found.',
        })
      }

      // User can only edit his own answer
      if (answer.userId !== currentUserId) {
        return res.status(403).json({
          status: 'error',
          message: 'Current user can only edit his own answer.',
        })
      }

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

      // Update the specific answer
      const updatedAnswer = await prisma.answer.update({
        where: {
          id: answerId,
        },
        data: {
          content: content,
          userId: currentUserId,
          questionId: answer.questionId,
        },
      })
      return res.status(200).json({
        status: 'success',
        message: 'The specific answer is updated.',
        updatedAnswer,
      })
    } catch (error) {
      next(error)
    }
  },

  // Delete the specific answer
  // DELETE /api/v1/answers/:id
  deleteAnswer: async (req, res, next) => {
    try {
      const currentUserId = req.user.id
      const answerId = Number(req.params.id)

      // Check if the specific answer exists
      const answer = await prisma.answer.findUnique({
        where: {
          id: answerId,
        },
      })

      // If the specific answer doesn't exist, earily return
      if (!answer) {
        return res.status(404).json({
          status: 'error',
          message: 'The specific answer is not found.',
        })
      }

      // User can only delete his own answer
      if (answer.userId !== currentUserId) {
        return res.status(403).json({
          status: 'error',
          message: 'Current user can only delete his own answer.',
        })
      }

      // Delete the specific answer
      const deletedAnswer = await prisma.answer.delete({
        where: {
          id: answerId,
        },
      })
      return res.status(200).json({
        status: 'success',
        message: 'The specific answer is deleted.',
        deletedAnswer,
      })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = answerController
