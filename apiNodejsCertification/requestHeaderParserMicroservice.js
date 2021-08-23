// server.js
// where your node app starts

// init project
require("dotenv").config()
const express = require("express")
const app = express()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require("cors")
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  return res.status(200).sendFile(__dirname + "/views/index.html")
})

// your first API endpoint...
app.get("/api/hello", (req, res) => {
  return res.status(200).json({ greeting: "hello API" })
})

// your first API endpoint...
app.get("/api/whoami", (req, res) => {
  const responseJSON = {
    ipaddress: `ffff::${req.headers["x-forwarded-for"]}`,
    language: req.headers["accept-language"],
    software: req.headers["user-agent"]
  }

  // console.log(responseJSON)

  return res.status(200).json(responseJSON)
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
