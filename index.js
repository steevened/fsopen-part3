const express = require('express')
const morgan = require('morgan')
const app = express()


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('body', (req, res) => {return JSON.stringify(req.body)})

app.use(express.json())
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`))


const date = new Date()

const newId = () => {
  const ids = persons.map(person => person.id)
  const maxId = persons.length > 0 
    ? Math.max(...ids)
    : 0
  return maxId + 1
}

app.get('/', (req, res) => {
  res.send('<h1 style="text-align: center; margin-top: 40px;">Home</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p> `)
})


app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if(person) {
    res.json(person)    
  }else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const isNumberRepeated = persons.find(person => person.number == body.number)

  if (!body.name) {
    return res.status(404).json({
      error: "name missing"
    })
  } else if(!body.number) {
    return res.status(404).json({
      error: "phone number missed"
    })
  } else if(isNumberRepeated) {
    return res.status(403).json({
      error: "number must be unique"
    })
  }

  const person = {
    id: newId(),
    name: body.name,
    number: body.number 
  }
  persons = persons.concat(person)
  res.json(person)

})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})




const PORT = 3000
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})