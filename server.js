const fs = require('fs')
const express = require('express')
const util = require('util')
const path = require('path')
const notes = require('./db/db.json')
const { v4: uuidv4 } = require('uuid');
const app = express()
// const api = require('./public/assets/js/index')

// const notesStringed = JSON.stringify(notes)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
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

  const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

  // const readFromFile = util.promisify(fs.readFile);

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
    // const found = notes.some(note => note.id === parseInt(req.params.id))
    // // console.log(found)

    // if(found) {

    //     res.json(notes.filter(note => note.id === parseInt(req.params.id)))
    // } else {
    //     res.status(400).json({msg: `No results for ${req.params.id}`})
    // }

    let idDisplay = ''

    const noteId = req.params.id
    console.log(noteId)
    console.log(notes)
    

    for(let i = 0; i < notes.length; i++) {
      console.log(notes[i].id)
      if(noteId == notes[i].id) {
        res.json(notes[i])
       } 
    }



})

app.post('/api/notes', (req, res) => {
    console.log(req.body);
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


app.use(express.static('public'))

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))