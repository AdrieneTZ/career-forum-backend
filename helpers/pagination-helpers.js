const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next
  }
}
module.exports = {
  getOffset,
  getPagination
}

// //使用範例：
// const { Restaurant, Category } = require('../models')
// const { getOffset, getPagination } = require('../helpers/pagination-helper')
// const restaurantServices = {
//   getRestaurants: (req, cb) => {
//     const DEFAULT_LIMIT = 9
//     const categoryId = Number(req.query.categoryId) || ''
//     const page = Number(req.query.page) || 1
//     const limit = Number(req.query.limit) || DEFAULT_LIMIT
//     const offset = getOffset(limit, page)
//     Promise.all([
//       Restaurant.findAndCountAll({
//         include: Category,
//         where: {
//           ...categoryId ? { categoryId } : {}
//         },
//         limit, //prisma 是 take
//         offset, // prisma 是 skip
//         nest: true,
//         raw: true
//       }),
//       Category.findAll({ raw: true })
//     ])