const passport = require('../config/passport')
const { getUser } = require('../helpers/req-helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized request' })
    req.user = user
    next()
  })(req, res, next)
}
const authAdmin = (req, res, next) => {
  if (getUser(req) && getUser(req).isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'Unauthorized request' })
}
const authRole = (req, res, next) => {
  if (getUser(req) && getUser(req).role === ('TA' || 'STUDENT' || 'GRADUATE')) return next()
  return res.status(403).json({ status: 'error', message: 'Unauthorized request' })
}
const authApprovalStatus = (req, res, next) => {
  if (getUser(req) && getUser(req).approvalStatus === 'approved') return next()
  return res.status(403).json({ status: 'error', message: 'Unauthorized request' })
}
const authCurrentUser = (req, res, next) => {
  if (getUser(req).id === Number(req.params.id)) return next()
  return res.status(403).json({ status: 'error', message: 'You can only edit your own data' })
}

module.exports = {
  authenticated,
  authAdmin,
  authRole,
  authApprovalStatus,
  authCurrentUser
}
