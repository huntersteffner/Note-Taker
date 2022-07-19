const express = require('express')
const path = require('path')
const notes = require('./db/db.json')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Get all notes
app.get('/api/notes', (req, res) => {
    res.json(notes)
})
// // Get single member
// app.get('api/notes/:id', (req, res) => {
//     const found = notes.some(note => note.id === parseInt(req.params.id))

//     if(found) {

//         res.json(notes.filter(note => note.id === parseInt(req.params.id)))
//     } else {
//         res.status(400).json({msg: `No results for ${req.params.id}`})
//     }

// })

app.use(express.static('public'))

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))