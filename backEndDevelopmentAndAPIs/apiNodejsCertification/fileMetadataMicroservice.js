require("dotenv").config()

const express = require("express")
const cors = require("cors")
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors())
app.use("/public", express.static(process.cwd() + "/public"))

app.get("/", (req, res) => {
  res.status(200).sendFile(process.cwd() + "/views/index.html")
})

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  // console.log(req.file)

  const response = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  }

  return res.status(200).json(response)
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`)
})
