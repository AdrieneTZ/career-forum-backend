const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function generateAnswers() {
  // [ { id: 10 }, { id: 8 }, { id: 7 }, { id: 9 } ]
  const userIds = await prisma.user.findMany({
    select: {
      id: true,
    },
  })
  const questionIds = await prisma.question.findMany({
    select: {
      id: true,
    },
  })

  for (const questionIdObj of questionIds) {
    for (const userIdObj of userIds) {
      await prisma.answer.create({
        data: {
          content: `wwwwwwwww`,
          userId: userIdObj.id,
          questionId: questionIdObj.id,
        },
      })
    }
  }
}

module.exports = generateAnswers
