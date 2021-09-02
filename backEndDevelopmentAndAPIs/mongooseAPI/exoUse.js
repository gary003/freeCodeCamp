const mongooseServices = require("./exo")

const arrOfPersons = [
  {
    favoriteFoods: ["potato", "hot-dog"],
    name: "Igor Slovinski",
    age: 29
  },
  {
    favoriteFoods: ["burrito", "salad"],
    name: "Maria Gomez",
    age: 39
  },
  {
    favoriteFoods: ["salad", "hot-dog"],
    name: "Sven Andersen",
    age: 19
  },
  {
    favoriteFoods: ["potato", "salad"],
    name: "Olivia Palinski",
    age: 41
  }
]

// mongooseServices.createManyPeople(arrOfPersons, (err, data) => {
//   !!err ? console.log(err) : console.log(data)
//   mongooseServices.disconnect()
// })

mongooseServices.findOneByFood("salad", (err, data) => {
  !!err ? console.log(err) : console.log(data)
  mongooseServices.disconnect()
})

mongooseServices.queryChain((err, data) => {
  !!err ? console.log(err) : console.log(data)
  mongooseServices.disconnect()
})
