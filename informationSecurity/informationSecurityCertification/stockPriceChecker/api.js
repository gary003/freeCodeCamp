"use strict"

const storage = [{ stockData: { stock: "GOOG", price: 102, likes: 2 } }, { stockData: { stock: "MSFT", price: 45, likes: 9 } }, { stockData: { stock: "PUYO", price: 52, likes: 12 } }]

module.exports = (app) => {
  app.route("/api/stock-prices").get((req, res) => {
    // console.log(req.query.stock)
    if (typeof req.query.stock === "string") {
      const foundStock = storage.findIndex((stock) => stock.stockData.stock == req.query.stock)

      const stockResult = foundStock >= 0 ? storage[foundStock] : null

      if (!!stockResult && !!req.query.like) {
        stockResult.stockData.likes += 1
      }

      // console.log(stockResult)

      return res.status(200).send(stockResult)
    }

    const dataResult = req.query.stock.map((currentStock) => {
      const foundStock = storage.findIndex((stockC) => stockC.stockData.stock === currentStock)

      const stockF = storage[foundStock].stockData.stock
      const priceF = storage[foundStock].stockData.price

      if (foundStock >= 0 && !!req.query.like) {
        storage[foundStock].stockData.likes += 1
      }

      return {
        stock: stockF || "",
        price: priceF || 0
      }
    })

    const allLikes = req.query.stock.map((sto) => {
      const foundS = storage.find((currentStorageStock) => currentStorageStock.stockData.stock == sto)

      return foundS.stockData.likes
    })

    const like_diff = Math.abs(allLikes[0] - allLikes[1])

    dataResult[0].rel_likes = like_diff
    dataResult[1].rel_likes = like_diff

    return res.status(200).send({ stockData: dataResult })
  })
}
