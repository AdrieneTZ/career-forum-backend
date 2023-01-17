const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// import seed generator functions
const usersSeeder = require('./seeders/users-seeder')

async function main() {
  await usersSeeder()
  await generateQuestions()
}

main()
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
