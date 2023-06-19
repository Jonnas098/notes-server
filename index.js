const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const Note = require("./models/note")

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :response-time ms | :res[content-length]| :body'))

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0
  
  console.log(maxId)
  return maxId + 1
}

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
  
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if(note){
      console.log("Note found");
      response.json(note)
    } else {
      response.status(404).end()
      response.send("<h1>404 Not Found</h1>")
      console.log("404 not found")
    }
  })
  .catch(error => next(error))
})
        
app.delete('/api/notes/:id' , (request, response, next) => {
  const id = (request.params.id)
  Note.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})
       
app.post('/api/notes/', (request, response) => {
  const body = request.body
  
  if (body.content === undefined) {
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

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id
  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(id, note, {new: true})
  .then(updatedNote => {
    response.json(updatedNote)
  })
  .catch(error => next(error))
})

//Middlewares
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, resquest, response, next) => {
  console.error(error.message);

  if(error.name === 'CastError') { 
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//No express method
//const http = require("http")
//const app = http.createServer((request, response) => {
//  response.writeHead(200, {"Content-Type": "application/json"})
//  response.end(JSON.stringify(notes))
// })
  
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