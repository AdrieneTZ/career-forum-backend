const passport = require('../config/passport')
const { getUser } = require('../helpers/req-helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    req.user = user
    next()
  })(req, res, next)
}
const authPermissionRole = (req, res, next) => {
  if (getUser(req) && getUser(req).permissionRole === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'Forbidden permission role' })
}
const authApprovalStatus = (req, res, next) => {
  if (getUser(req) && getUser(req).approvalStatus === 'approved') return next()
  return res.status(403).json({ status: 'error', message: 'Forbidden approvalStatus' })
}
const authCurrentUser = (req, res, next) => {
  if (getUser(req).id === Number(req.params.id)) return next()
  return res.status(403).json({ status: 'error', message: 'You can only edit your own data' })
}

module.exports = {
  authenticated,
  authPermissionRole,
  authApprovalStatus,
  authCurrentUser
}
