const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function generateQuestions() {
  const userIds = await prisma.user.findMany({ select: { id: true } }) // [ { id: 10 }, { id: 8 }, { id: 7 }, { id: 9 } ]

  for (const userIdObj of userIds) {
    await prisma.question.createMany({
      data: [
        {
          title: `投出履歷前需要把全部的leetcode easy題刷完嗎？`,
          content: `聽說面試會考leetcode，這樣要把leetcode刷到什麼程度才可以把履歷投出去？或是要刷哪些topic？謝謝解惑。`,
          userId: userIdObj.id,
        },
        {
          title: `技能要掌握的什麼程度才能放在履歷上？`,
          content: `對於一項技術要掌握到什麼程度，才適合放在履歷上？對於每一項技術都不敢說自己超級了解，所以目前都不敢放QAQ`,
          userId: userIdObj.id,
        },
        {
          title: `什麼區間的薪資範圍才算合理？`,
          content: `拿到一份offer開25000/月，沒有年終，主管說過三個月試用期後會調薪，但沒說調多少，想請問這樣的薪資數字算合理嗎？`,
          userId: userIdObj.id,
        },
        {
          title: `JD的技能和條件是否要全部符合？`,
          content: `JD上列的技能和條件，我未必全部都符合，有些只有符合八成，或四項中符合三項，這樣我可以投這個職缺嗎？`,
          userId: userIdObj.id,
        },
      ],
    })
  }
}

module.exports = generateQuestions
