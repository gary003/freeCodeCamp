require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
const moment = require("moment")
const { ObjectId } = require("mongodb")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors())
app.use(express.static("public"))

let users = new Array()

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/views/index.html")
})

app.get("/api/users", (req, res) => {
  return res.status(200).send(users)
})

app.post("/api/users", (req, res) => {
  const newUser = {
    _id: new ObjectId(),
    username: req.body.username,
    log: [],
    count: 0
  }

  users = [...users, newUser]

  return res.status(200).send(newUser)
})

app.post("/api/users/:_id/exercises", (req, res) => {
  const year = new Date().getFullYear()
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0")
  const date = new Date().getDate().toString().padStart(2, "0")

  const defaultDate = `${year}-${month}-${date}`

  const selectedUser = users.find((u) => u._id == req.params._id)

  const newLog = {}
  newLog.description = req.body.description
  newLog.duration = +req.body.duration
  newLog.date = moment(req.body.date || defaultDate)
    .toDate()
    .toDateString()

  selectedUser.log = [...selectedUser.log, newLog]
  selectedUser.count += 1

  const response = {
    _id: selectedUser._id,
    username: selectedUser.username,
    description: newLog.description,
    duration: newLog.duration,
    date: newLog.date
  }

  return res.status(200).send(response)
})

app.get("/api/users/:_id/logs", (req, res) => {
  let { from, to, limit } = req.query

  if (!!from) from = moment(from)
  if (!!to) to = moment(to)

  const user = users.find((user) => user._id == req.params._id)
  let selectedLogs = user.log.filter((currentLog) => {
    currentLogDate = moment(new Date(currentLog.date))

    if (!!from && !!to) return currentLogDate.isBetween(from, to)
    if (!!from && !to) return currentLogDate.isAfter(from)
    if (!from && !!to) return currentLogDate.isBefore(to)

    return true
  })

  if (!!limit) selectedLogs = selectedLogs.slice(0, +limit)

  const response = {
    _id: user._id,
    username: user.username,
    count: selectedLogs.length,
    log: selectedLogs
  }

  return res.status(200).send(response)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
