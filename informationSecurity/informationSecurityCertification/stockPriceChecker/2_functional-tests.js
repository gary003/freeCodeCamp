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

  test("Should get one stock", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices/")
      .query({
        stock: "goog"
      })
      .end((err, res) => {
        if (!!err) return done(err)

        assert.isObject(res.body, "is a object response")
        assert.isDefined(res.body.stockData, "stockData is defined")

        return done()
      })
  })

  test("Should get one stock and liking it", () => {})

  test("Should get the same stock and liking it again", () => {})

  test("Should get two stocks", () => {})

  test("Should get two stocks and liking them", () => {})
})
