const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// import seed generator functions
const generateUsers = require('./seeders/users-seeder')
const generateQuestions = require('./seeders/questions-seeder')
const generateAnswers = require('./seeders/answers-seeder')

async function main() {
  await prisma.answer.deleteMany({})
  await prisma.question.deleteMany({})
  await prisma.user.deleteMany({})

  await generateUsers()
  await generateQuestions()
  await generateAnswers()
}

main()
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
