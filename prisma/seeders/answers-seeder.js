const { faker } = require('@faker-js/faker')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function generateAnswers() {
  // userIds: [ { id: 10 }, { id: 8 }, { id: 7 }, { id: 9 } ]
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
          content: faker.lorem.sentence(10),
          userId: userIdObj.id,
          questionId: questionIdObj.id,
        },
      })
    }
  }
}

module.exports = generateAnswers
