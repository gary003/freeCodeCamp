"use strict"
require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const apiRoutes = require("./routes/api.js")
const fccTestingRoutes = require("./routes/fcctesting.js")
const runner = require("./test-runner")
const helmet = require("helmet")

const app = express()

app.use("/public", express.static(process.cwd() + "/public"))

app.use(cors({ origin: "*" })) //For FCC testing purposes only

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  helmet({
    contentSecurityPolicy: {
      // enable and configure
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"]
      }
    }
  })
)

//Index page (static HTML)
app.route("/").get((req, res) => {
  return res.status(200).sendFile(process.cwd() + "/views/index.html")
})

app.route("/api/stock-prices").get((req, res) => {
  let stocks = req.query.stock

  if (typeof stocks === "string") {
    const result = {
      stockData: {
        stock: stocks,
        price: 12,
        likes: 3
      }
    }

    console.log(result)

    return res.status(200).send(result)
  }

  const dataResult = stocks.map((currentStock, i) => {
    return { stock: currentStock, price: 12, rel_likes: 5 }
  })

  console.log({ stockData: dataResult })

  return res.status(200).send({ stockData: dataResult })
})

//For FCC testing purposes
fccTestingRoutes(app)

//Routing for API
apiRoutes(app)

//404 Not Found Middleware
app.use((req, res, next) => {
  return res.status(404).type("text").send("Not Found")
})

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...")
    setTimeout(function () {
      try {
        runner.run()
      } catch (e) {
        console.log("Tests are not valid:")
        console.error(e)
      }
    }, 3500)
  }
})

module.exports = app //for testing
