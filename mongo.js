const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]
const nameArg = process.argv[3]
const numberArg = process.argv[4]

const url = `mongodb+srv://steevened:${password}@cluster0.behi3du.mongodb.net/PhonesApp?retryWrites=true&w=majority`

const personShema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personShema)

mongoose.connect(url).then((res) => {
  console.log('connected')

  const person = new Person({
    name: nameArg,
    number: numberArg,
  })
  if (process.argv.length < 4) {
    return Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(person)
      })
      mongoose.connection.close()
    })
  }

  return person.save().then((res) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
})
