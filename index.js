require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/Persons')

const cors = require('cors')
app.use(cors())

app.use(express.json())

const date = new Date()

const newId = () => {
  const ids = persons.map((person) => person.id)
  const maxId = persons.length > 0 ? Math.max(...ids) : 0
  return maxId + 1
}

app.get('/', (req, res) => {
  res.send('<h1 style="text-align: center; margin-top: 40px;">Home</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((person) => {
    res.json(person)
  })
})

app.get('/api/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p> `
  )
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person)
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  // const isNumberRepeated = person.find((person) => person.number == body.number)

  if (!body.name) {
    return res.status(404).json({
      error: 'name missing',
    })
  } else if (!body.number) {
    return res.status(404).json({
      error: 'phone number missed',
    })
  }
  // else if (isNumberRepeated) {
  //   return res.status(403).json({
  //     error: 'number must be unique',
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    res.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((person) => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

// mongodb+srv://steevened:<password>@cluster0.behi3du.mongodb.net/?retryWrites=true&w=majority
