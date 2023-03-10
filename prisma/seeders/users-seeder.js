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
        email: `${name}@careerforum.com`,
        password: await bcrypt.hash(`As123456!`, 10),
        approvalStatus: 'approved',
        permissionRole: 'user',
      },
    })
  }

  await prisma.user.createMany({
    data: [
      {
        role: 'TA',
        name: 'admin',
        email: `admin@careerforum.com`,
        password: await bcrypt.hash(`As123456!`, 10),
        approvalStatus: 'approved',
        permissionRole: 'admin',
      },
      {
        role: 'student',
        name: 'user',
        email: `user@careerforum.com`,
        password: await bcrypt.hash(`As123456!`, 10),
        approvalStatus: 'approved',
        permissionRole: 'user',
      },
    ],
  })
}

module.exports = generateUsers
