const passport = require("passport")
const bcrypt = require("bcrypt")

module.exports = (app, myDB) => {
  app.route("/").get((req, res) => {
    const pageData = {
      title: "Connected to Database",
      message: "Please login",
      showLogin: true,
      showRegistration: true
    }

    return res.status(200).render("index", pageData)
  })

  app.post("/login", passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
    return res.status(304).redirect("/profile")
  })

  app.route("/profile").get(ensureAuthenticated, (req, res) => {
    console.log(req.user)
    return res.status(200).render("profile", { username: req.user.username, ...req.user })
  })

  app.route("/logout").get((req, res) => {
    req.logout()
    return res.status(301).redirect("/")
  })

  app.route("/register").post(
    async (req, res, next) => {
      const dbUser = await myDB.findOne({ username: req.body.username }).catch((err) => console.log(err))
      if (!!dbUser) {
        // console.log('user already exists')
        return res.status(301).redirect("/")
      }

      const insertionNew = await myDB
        .insertOne({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 12)
        })
        .catch((err) => console.log(err))

      if (!insertionNew.ops[0]) return res.status(301).redirect("/")

      return next(null, insertionNew.ops[0])
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res, next) => {
      return res.status(301).redirect("/profile")
    }
  )

  app.use((req, res, next) => {
    return res.status(404).type("text").send("Not Found")
  })
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next()
  console.log("unOauth")

  return res.status(301).redirect("/")
}
