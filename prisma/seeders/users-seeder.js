const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function generateUsers() {
  const names = ['lois', 'gino', 'sean', 'adriene']
  for (const name of names) {
    await prisma.user.create({
      data: {
        role: 'graduate',
        name: name,
        email: `${name}@${name}.com`,
        password: await bcrypt.hash('12345678', 10),
        approvalStatus: 'reviewing',
        permissionRole: 'user',
      },
    })
  }
}

module.exports = generateUsers
