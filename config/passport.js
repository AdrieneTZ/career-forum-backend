const passport = require('passport')
const passportJWT = require('passport-jwt')
const { PrismaClient } = require('@prisma/client')

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const prisma = new PrismaClient()

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

      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  })
)

module.exports = passport
