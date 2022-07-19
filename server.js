const express = require('express')
const path = require('path')
const api = require('./db/db.json')

const app = express()

// Get all members
app.get('/api/members', (req, res) => {
    res.json(api)
})
// Get single member
app.get('api/members/:id', (req, res) => {
    res.json(api.filter(api => api.id === parseInt(req.params.id)))
})

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))