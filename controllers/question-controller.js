const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const questionController = {
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
