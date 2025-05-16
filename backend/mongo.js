const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const app = express()

app.use(express.json())

const noteSchema = mongoose.Schema({
	content: String,
	important: Boolean,
})

noteSchema.set('toJSON', {
	transform: (document, returnedObj) => {
		returnedObj.id = document._id.toString()
		delete returnedObj._id
		delete returnedObj.__v
	}
})

const Note = mongoose.model('Note', noteSchema)

mongoose.connect(config.MONGODB_URI)
	.then(() => logger.info('Connected to MongoDB for testing.'))
	.catch((err) => {
		logger.error(err)
		process.exit(1)
	})

app.get('/api/notes', (req, res) => {
	Note.find({})
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((err) => {
			logger.error(err)
			res.status(500).end()
		})
})

app.post('/api/notes', (req, res) => {
	const { content, important } = req.body

	if (!content)
			return res.status(400).send({ message: 'content missing' })
	const note = new Note({
		content: content,
		important: important ? important : false
	})

	note.save()
		.then((result) => {
			logger.info('Note saved to db')
			res.status(201).send(result)
		})
		.catch((err) => {
			logger.error(err)
			res.status(500).end()
		})
})

const PORT = config.PORT || 3001

app.listen(PORT, (err) => {
	if (!err)
		logger.info('listening on port ', PORT)
	else {
		logger.error(err)
		mongoose.connection.close()
		process.exit(1)
	}
})