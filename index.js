//No express method
//const http = require("http")
// const app = http.createServer((request, response) => {
//   response.writeHead(200, {"Content-Type": "application/json"})
//   response.end(JSON.stringify(notes))
// })

const express = require('express')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(express.static('build'))
app.use(cors())

let notes = [
  {
    id: 1,
    content: "First note",
    date: new Date().toISOString(),
    important: true
  },
  {
    id: 2,
    content: "Second note",
    date: new Date().toISOString(),
    important: false
  },
  {
    id: 3,
    content: "Third note",
    date: new Date().toISOString(),
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  //console.log(request.headers)
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
    // console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    if(note) {
      console.log('Done process')
      response.json(note)
    } else {
      console.log("404 Not Found")
      response.send("<h1>404 Not Found</h1>")
      response.status(404).end()
    }
  console.log(note)
  response.json(note)
})

app.delete('/api/notes/:id' , (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0

  console.log(maxId)

  return maxId + 1
}

app.post('/api/notes/', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date().toISOString(),
    id: generateId()
  }

  notes = notes.concat(note)

  response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

