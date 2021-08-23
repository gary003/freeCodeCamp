// server.js
// where your node app starts

// init project
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
  return res.sendFile(__dirname + "/views/index.html")
})

// your first API endpoint...
app.get("/api/hello", (req, res) => {
  return res.json({ greeting: "hello API" })
})

// your first API endpoint...
app.get("/api", (req, res) => {
  return res.json({ unix: new Date().getTime(), utc: new Date().toUTCString() })
})

// your first API endpoint...
app.get("/api/:date", (req, res) => {
  const requestedDate = req.params.date

  let formattedDate = ""
  if (requestedDate.match(/^[0-9]{13}$/g)) formattedDate = new Date(+requestedDate)
  else if (requestedDate === "") formattedDate = Date.now()
  else formattedDate = new Date(requestedDate)

  if (!formattedDate.getTime()) return res.json({ error: "Invalid Date" })

  // console.log(requestedDate, typeof formattedDate.getTime(), formattedDate.getTime(), formattedDate.toUTCString())

  return res.json({ unix: formattedDate.getTime(), utc: formattedDate.toUTCString() })
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
