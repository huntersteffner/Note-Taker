const fs = require('fs')
const express = require('express')
const util = require('util')
const path = require('path')
const notes = require('./db/db.json')
const { v4: uuidv4 } = require('uuid');
const app = express()
// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// Function to read and append to JSON database
const readFileAsync = util.promisify(fs.readFile)
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
  };
// function for writing new information to JSON database
  const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );
// Get all notes
app.get('/api/notes', (req, res) => {
  let database = readFileAsync('./db/db.json', 'utf8')
  .then( (database) => {
    database = JSON.parse(database)
      res.json(notes)
  }
  )
})
// // Get single note
app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id
    for(let i = 0; i < notes.length; i++) {
      if(noteId == notes[i].id) {
        res.json(notes[i])
       } 
    }
})
// Function for posting new note
app.post('/api/notes', (req, res) => {
    const randomNumber = uuidv4()
    const { title, text } = req.body;
    if (req.body) {
      const newNote = {
        id: randomNumber,
        title,
        text,
      };
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully 🚀`);
    } else {
      res.error('Error in adding note');
    }
  });
// Function for deleting a note
  app.delete('/api/notes/:id', (req, res) => {
    const found = notes.some(note => note.id === req.params.id)
    if(!found) {
      res.status(400).json({msg: `ID ${req.params.id} not found`})
    } else {
      const newNotes = notes.filter(note => note.id != req.params.id)
      fs.writeFile('./db/db.json', JSON.stringify(newNotes), 'utf8', (err) => {
        err ? console.error(err) : console.info(`\n${req.params.id} Deleted`)
      })
      res.json(notes)
    }
  })
// Linking html pages to different URL paths
app.use(express.static('public'))
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))