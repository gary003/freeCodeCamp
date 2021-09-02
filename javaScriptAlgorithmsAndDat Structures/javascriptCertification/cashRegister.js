const moneyToNames = { 1: "PENNY", 5: "NICKEL", 10: "DIME", 25: "QUARTER", 100: "ONE", 500: "FIVE", 1000: "TEN", 2000: "TWENTY", 10000: "ONE HUNDRED" }
const money = [1, 5, 10, 25, 100, 500, 1000, 2000, 10000]
const moneyNames = ["PENNY", "NICKEL", "DIME", "QUARTER", "ONE", "FIVE", "TEN", "TWENTY", "ONE HUNDRED"]

const isAvalaibleChange = (
  change,
  cid,
  a = {
    PENNY: 0,
    NICKEL: 0,
    DIME: 0,
    QUARTER: 0,
    ONE: 0,
    FIVE: 0,
    TEN: 0,
    TWENTY: 0,
    "ONE HUNDRED": 0
  }
) => {
  if (change.length === 0) return true

  const changeJSON = change.reduce((acc, val) => {
    acc[moneyToNames[val]] += val
    return acc
  }, a)

  return Object.entries(changeJSON).every((val, i) => val[1] / 100 <= cid[i][1])
}

const checkCashRegister = (price, cash, cid) => {
  if (cash < price) return { status: "INSUFFICIENT_FUNDS", change: [] }

  const sumCash = cid.reduce((acc, val) => acc + val[1], 0)

  if (cash - price === sumCash) return { status: "CLOSED", change: cid }

  const changeBack = Math.round((cash - price) * 100)
  const table = Array(changeBack + 1).fill(null)
  table[0] = []

  for (let i = 0; i < changeBack; i += 1) {
    for (let j of money) {
      if (table[i] && i + j <= changeBack) {
        const newChange = [...table[i], j]
        if (isAvalaibleChange(newChange, cid)) {
          if (table[i + j] === null) table[i + j] = newChange
        }
      }
    }
  }

  const allPossibleChanges = table[changeBack]

  if (allPossibleChanges == null) return { status: "INSUFFICIENT_FUNDS", change: [] }

  const changeList = allPossibleChanges.reduce((acc, val) => {
    if (!(moneyToNames[val] in acc)) acc[moneyToNames[val]] = val / 100
    else acc[moneyToNames[val]] += val / 100

    return acc
  }, {})

  return { status: "OPEN", change: Object.entries(changeList).sort((a, b) => moneyNames.indexOf(b[0]) - moneyNames.indexOf(a[0])) }
}

console.log(
  checkCashRegister(3.26, 100, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
  ]),
  checkCashRegister(19.4, 20, [
    ["PENNY", 0.3],
    ["NICKEL", 0],
    ["DIME", 0.3],
    ["QUARTER", 0],
    ["ONE", 10],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0]
  ])
)
