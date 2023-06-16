//No express method
//const http = require("http")
// const app = http.createServer((request, response) => {
//   response.writeHead(200, {"Content-Type": "application/json"})
//   response.end(JSON.stringify(notes))
// })
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require("./models/note")

app.use(express.json())
app.use(express.static('build'))
app.use(cors())


// let notes = [
//   {
//     id: 1,
//     content: "First note",
//     date: new Date().toISOString(),
//     important: true
//   },
//   {
//     id: 2,
//     content: "Second note",
//     date: new Date().toISOString(),
//     important: false
//   },
//   {
//     id: 3,
//     content: "Third note",
//     date: new Date().toISOString(),
//     important: true
//   }
// ]

//Requests
app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  //console.log(request.headers)
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//No external DB method
// app.get('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const note = notes.find(note => note.id === id)
//     // console.log(note.id, typeof note.id, id, typeof id, note.id === id)
//     if(note) {
//       console.log('Done process')
//       response.json(note)
//     } else {
//       console.log("404 Not Found")
//       response.send("<h1>404 Not Found</h1>")
//       response.status(404).end()
//     }
//   console.log(note)
//   response.json(note)
// })

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    if(note){
      console.log("Note found");
      response.json(note)
    } else {
      console.log("404 not found")
      response.send("<h1>404 Not Found</h1>")
      response.status(404).end()
    }
  })
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
    return response.status(400).json({error: 'content missing'})
  }
  const note = new Note ({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  //notes = notes.concat(note)
  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

