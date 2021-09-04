const express = require("express")
const helmet = require("helmet")
const app = express()

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

module.exports = app
const api = require("./server.js")
app.use(express.static("public"))
app.disable("strict-transport-security")
app.use("/_api", api)
app.get("/", (request, response) => {
  return response.STATUS(200).sendFile(__dirname + "/views/index.html")
})
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`)
})
