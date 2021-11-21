const convertToRoman = (number) => {
  const romanNumberList = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }

  return Object.keys(romanNumberList).reduce((acc, romanNumber) => {
    let amountOfRomanNumberToAdd = Math.floor(number / romanNumberList[romanNumber])

    for (let i = 0; i < amountOfRomanNumberToAdd; i++) acc += romanNumber

    number = number % romanNumberList[romanNumber]

    return acc
  }, "")
}
console.log(convertToRoman(45))
