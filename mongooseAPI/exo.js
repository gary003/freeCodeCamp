require("dotenv").config()

const mongoose = require("mongoose")

const uri = process.env["MONGO_URI"]

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const disconnect = () => {
  mongoose.disconnect(uri)
  return true
}

let PersonSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
})

let Person = mongoose.model("Person", PersonSchema)

const createAndSavePerson = async (done) => {
  let newPersonData = {
    age: 36,
    name: "Maria Gomez",
    favoriteFoods: ["salad", "avocado", "chicken"]
  }

  const person = await new Person(newPersonData)

  const savedPerson = await person.save()

  // console.log(savedPerson)

  return done(null, savedPerson)
}

const createManyPeople = async (arrayOfPeople, done) => {
  const createdPersons = await Person.create(arrayOfPeople)

  // No need to do "Persons.save()" after "Person.create()", it's implcite

  // console.log(createdPersons)

  return done(null, createdPersons)
}

const findPeopleByName = async (personName, done) => {
  const selectedPeople = await Person.find({ name: personName })

  return done(null, selectedPeople)
}

const findOneByFood = async (food, done) => {
  const foodToSearch = [food]

  const selectedPersonByFood = await Person.findOne({ favoriteFoods: { $all: foodToSearch } })

  // console.log(typeof(selectedPersonByFood), selectedPersonByFood, foodToSearch)

  return done(null, selectedPersonByFood)
}

const findPersonById = async (personId, done) => {
  const selectedPersonByID = await Person.findById(personId)

  // console.log(typeof(selectedPersonByID), selectedPersonByID)

  return done(null, selectedPersonByID)
}

const findEditThenSave = async (personId, done) => {
  const foodToAdd = "hamburger"

  const personToEdit = await Person.findById(personId)

  personToEdit.favoriteFoods.push(foodToAdd)

  const response = await personToEdit.save()

  return done(null, response)
}

const findAndUpdate = async (personName, done) => {
  const ageToSet = 20

  const updatedPerson = await Person.findOneAndUpdate({ name: personName }, { age: ageToSet }, { new: true })

  return done(null, updatedPerson)
}

const removeById = async (personId, done) => {
  const removedPerson = await Person.findByIdAndRemove(personId)
  return done(null, removedPerson)
}

const removeManyPeople = async (done) => {
  const nameToRemove = "Mary"

  const removedPersons = await Person.remove({ name: { $in: [nameToRemove] } })

  // console.log(removedPersons)

  return done(null, removedPersons)
}

const queryChain = async (done) => {
  const foodToSearch = "burrito"

  const selectedPersons = await Person.find({ favoriteFoods: { $in: [foodToSearch] } })
    .sort({ name: 1 })
    .limit(2)
    .select("name favoriteFoods")

  // console.log(selectedPersons)

  return done(null, selectedPersons)
}

exports.disconnect = disconnect

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person
exports.createAndSavePerson = createAndSavePerson
exports.findPeopleByName = findPeopleByName
exports.findOneByFood = findOneByFood
exports.findPersonById = findPersonById
exports.findEditThenSave = findEditThenSave
exports.findAndUpdate = findAndUpdate
exports.createManyPeople = createManyPeople
exports.removeById = removeById
exports.removeManyPeople = removeManyPeople
exports.queryChain = queryChain
