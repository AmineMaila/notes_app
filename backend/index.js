const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Ajv = require('ajv')
const ajv = new Ajv()

const schema = {
	type: 'object',
	properties: {
		id: {type: 'string'},
		content: {type: 'string'},
		important: {type: 'boolean'}
	},
	required: ['content'],
	additionalProperties: false
}

const validate = ajv.compile(schema)

let notes = [
	{
		id: "1",
		content: "Hello from webserver",
		important: true
	},
	{
		id: "2",
		content: "HTML is easy",
		important: false
	},
	{
		id: "3",
		content: "CSS is hard",
		important: true
	}
]

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
	res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
	const id = req.params.id
	const note = notes.find((n) => n.id === id)
	if (!note)
		res.status(404).end('<h1>Resource doesn\'t exist</h1>')
	res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
	const id = req.params.id
	notes = notes.filter((n) => n.id !== id)

	res.status(204).end()
})

const generateId = () => {
	const newID = notes.length > 0
		? Math.max(...notes.map(note => Number(note.id)))
		: 0
	return (String(newID + 1))
}

app.post('/api/notes', (req, res) => {
	const body = req.body

	if (!body.content) {
		res.status(400).json({
			error: "content missing"
		})
		return ;
	}

	const note = {
		id: generateId(),
		content: body.content,
		important: false,
	}

	notes = notes.concat(note)
	res.json(note)
})

app.put('/api/notes/:id', (req, res) => {
	const body = req.body

	if (!validate(body))
		console.log('non valid')
	else
		console.log('valid')
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.REPLIT_PORT || process.env.PORT || 5000

app.listen(PORT, (err) => {
	if (err)
		console.log(err)
	else
		console.log('Server is running on port ', PORT)
})

