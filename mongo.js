const mongoose = require("mongoose")

if(process.argv.length < 3) {
  console.log("Please provide the password as an argument: node mongo.js <password>");
  process.exit(1)
}

const password = process.argv[2]

const url = 
`mongodb+srv://fullstack:${password}@cluster0.6ldx4ji.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model("Note", noteSchema)

const note = new Note({
  content: "Third Note",
  date: new Date(),
  important: true
})

//Create a note
// note.save().then(result => {
//   console.log("Note saved!");
//   mongoose.connection.close()
// })

//Returns all saved notes
Note.find({}).then(result => {
  result.forEach(note => {
    console.log("Notes:", note)
  })
  mongoose.connection.close()
})
//Note.find({important: true}).the..... De esta manera podemos filtrar las notas mostrando...
//...solo las importantes