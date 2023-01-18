require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/Persons')
const cors = require('cors')

//middlewares
app.use(cors())
app.use(express.json())

//variables
const date = new Date()

//routes

app.get('/', (req, res) => {
  res.send('<h1 style="text-align: center; margin-top: 40px;">Home</h1>')
})

app.get('/api/info', (req, res) => {
  Person.find({}).then((person) => {
    res.send(
      `<p>Phonebook has info for ${person.length} people</p> <p>${date}</p> `
    )
  })
})

//persons routes

app.get('/api/persons', (req, res) => {
  Person.find({}).then((person) => {
    res.status(200).json(person)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.status(200).json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      res.status(200).json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

//error handler

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

