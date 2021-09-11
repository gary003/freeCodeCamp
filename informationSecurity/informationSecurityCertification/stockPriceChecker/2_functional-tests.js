const chaiHttp = require("chai-http")
const chai = require("chai")
const assert = chai.assert
const server = require("../server")

chai.use(chaiHttp)

suite("Functional Tests", () => {
  /*
    Viewing one stock: GET request to /api/stock-prices/
    Viewing one stock and liking it: GET request to /api/stock-prices/
    Viewing the same stock and liking it again: GET request to /api/stock-prices/
    Viewing two stocks: GET request to /api/stock-prices/
    Viewing two stocks and liking them: GET request to /api/stock-prices/
  */

  test("Viewing one stock: GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .query({
        stock: "GOOG"
      })
      .end((err, res) => {
        if (!!err) return done(err)

        assert.isObject(res.body, "is a object response")
        assert.isDefined(res.body.stockData, "stockData is defined")
        assert.equal(res.body.stockData.stock, "GOOG")

        return done()
      })
  })

  test("Viewing one stock and liking it: GET request to /api/stock-prices/", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .query({
        stock: "GOOG",
        like: true
      })
      .end((err, res) => {
        if (!!err) return done(err)

        assert.isObject(res.body, "is a object response")
        assert.isDefined(res.body.stockData, "stockData is defined")
        assert.isNumber(res.body.stockData.likes, "stockData.like is specified")
        assert.equal(res.body.stockData.likes, 3, "correct likes number")
        assert.equal(res.body.stockData.stock, "GOOG")

        return done()
      })
  })

  test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", () => {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .query({
        stock: "GOOG",
        like: true
      })
      .end((err, res) => {
        if (!!err) return done(err)

        assert.isNumber(res.body.stockData.likes, "stockData.like is specified")
        assert.equal(res.body.stockData.likes, 4, "correct likes number, one more than previous test")

        return done()
      })
  })

  test("Viewing two stocks: GET request to /api/stock-prices/", () => {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .query({
        stock: ["GOOG", "PUYO"]
      })
      .end((err, res) => {
        if (!!err) return done(err)

        assert.equal(res.body.stockData.rel.likes, 10, "correct rel_likes number")

        return done()
      })
  })

  test("Viewing two stocks and liking them: GET request to /api/stock-prices/", () => {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .query({
        stock: ["GOOG", "PUYO"],
        like: true
      })
      .end((err, res) => {
        if (!!err) return done(err)

        assert.equal(res.body.stockData.rel.likes, 10, "correct rel_likes number")

        return done()
      })
  })
})
