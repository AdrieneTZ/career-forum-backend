const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
// Passport的LocalStrategy負責協助"驗證帳號密碼是否正確"(authentication)
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  // authenticate user
  async (email, password, cb) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        const error = new Error('User does not exist!')
        error.statusCode = 401
        cb(error)
        return
      }
      const passwordCompare = await bcrypt.compare(password, user.password)
      if (!passwordCompare) {
        const error = new Error('Passwords do not match!')
        error.statusCode = 401
        cb(error)
        return
      }
      return cb(null, user)
    } catch (err) {
      cb(err, false)
    }
  }
))
//JWT負責協助驗證"授權"(authorization)
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}
passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.id },
      })
      if (user) return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  })
)

module.exports = passport
