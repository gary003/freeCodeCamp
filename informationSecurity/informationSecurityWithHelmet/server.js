"use strict"
const express = require("express")
const bodyParser = require("body-parser")
const fccTesting = require("./freeCodeCamp/fcctesting.js")
const bcrypt = require("bcrypt")
const helmet = require("helmet")
const app = express()
fccTesting(app)
const saltRounds = 12
const myPlaintextPassword = "sUperpassw0rd!"
const someOtherPlaintextPassword = "pass123"

app.use(helmet.hidePoweredBy())
app.use(helmet.frameguard({ action: "deny" }))
app.use(helmet.xssFilter())
app.use(helmet.noSniff())
app.use(helmet.ieNoOpen())
app.use(helmet.hsts({ maxAge: 90 * 24 * 60 * 60, force: true }))
app.use(helmet.dnsPrefetchControl())
app.use(helmet.noCache())
app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'", "trusted-cdn.com"] } }))

app.use(
  helmet({
    frameguard: {
      // configure
      action: "deny"
    },
    contentSecurityPolicy: {
      // enable and configure
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["style.com"]
      }
    },
    dnsPrefetchControl: false // disable
  })
)
//START_ASYNC -do not remove notes, place code between correct pair of notes.

bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
  console.log(hash)
  bcrypt.compare(myPlaintextPassword, hash, (err, res) => {
    console.log(res)
  })
})

//END_ASYNC

//START_SYNC
let hash = bcrypt.hashSync(myPlaintextPassword, saltRounds)
console.log(hash)
let result = bcrypt.compareSync(myPlaintextPassword, hash)
console.log(result)
//END_SYNC

app.listen(process.env.PORT || 3000, () => {})
