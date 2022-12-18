const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  const returnUserOrError = (error, user) => {
    if (error || !user) {
      return res.status(401).json({ message: 'Unauthorized request' })
    }

    req.user = user
    next()
  }

  passport.authenticate('jwt', { session: false }, returnUserOrError)(
    req,
    res,
    next
  )
}

module.exports = {
  authenticated,
}
