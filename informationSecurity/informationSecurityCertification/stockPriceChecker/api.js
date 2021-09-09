"use strict"

module.exports = function (app) {
  app.route("/api/stock-prices").get((req, res) => {
    const stocks = req.query.stock

    if (typeof stocks === "string") {
      const result = {
        stockData: {
          stock: stocks,
          price: 12,
          likes: 3
        }
      }
      return res.status(200).send(result)
    }

    const dataResult = stocks.map((currentStock, i) => {
      return { stock: currentStock, price: 12, rel_likes: 5 }
    })

    return res.status(200).send({ stockData: dataResult })
  })
}
