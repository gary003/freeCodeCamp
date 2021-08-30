const passport = require("passport")
const ObjectId = require("mongodb").ObjectId
const LocalStrategy = require("passport-local")
const bcrypt = require("bcrypt")

module.exports = (app, myDB) => {
  passport.serializeUser((user, done) => {
    return done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    return myDB.findOne({ _id: new ObjectId(id) }, (err, doc) => {
      return done(null, doc)
    })
  })

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await myDB.findOne({ username })

      if (!user) {
        console.log("false user")
        return done(null, false)
      }

      if (!bcrypt.compareSync(password, user.password)) {
        console.log("- pass -")
        return done(null, false)
      }

      return done(null, user)
    })
  )
}
