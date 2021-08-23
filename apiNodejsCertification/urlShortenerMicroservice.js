require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

// Basic Configuration
const port = process.env.PORT || 3000

app.use(cors())

app.use("/public", express.static(`${process.cwd()}/public`))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const memorizedUrls = []

app.get("/", (req, res) => {
  return res.status(200).sendFile(process.cwd() + "/views/index.html")
})

// Your first API endpoint
app.get("/api/hello", (req, res) => {
  return res.status(200).json({ greeting: "hello API" })
})

// Your first API endpoint
app.post("/api/shorturl", (req, res) => {
  const resJSON = {
    original_url: req.body.url,
    short_url: memorizedUrls.length + 1
  }

  const isGoodUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(req.body.url)

  if (!isGoodUrl) resJSON.error = "invalid url"

  memorizedUrls.push(resJSON)

  return res.status(200).json(resJSON)
})

app.get("/api/shorturl/:shortUrl", (req, res) => {
  const urlToRedirectTo = memorizedUrls.find((urls) => urls.short_url == req.params.shortUrl)

  return res.status(300).redirect(urlToRedirectTo.original_url)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
