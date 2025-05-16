const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

notesRouter.get('/', async (req, res, next) => {
	// .lean() returns a js obj instead of a mongoose document that has member methods like .save() ...
	try {
		const notes = await Note.find({}).populate('user', { name: 1, username: 1 }) // Note is a Database model
		res.json(notes)
	}
	catch (e) {
		next(e)
	}
})

notesRouter.get('/:id', async (req, res, next) => {
	try {
		const foundNote = await Note.findById(req.params.id).populate('user', { name: 1, username: 1 })
		if (!foundNote)
			return res.status(404).end()
		res.json(foundNote)
	}
	catch (e) {
		next(e)
	}
})

notesRouter.delete('/:id', async (req, res, next) => {
	try {
		const note = await Note.findById(req.params.id)
		const user = await User.findById(note.user)
		user.notes = user.notes.filter(n => n !== note._id)
		await note.deleteOne()
		res.status(204).end()
	}
	catch (e) {
		next(e)
	}
})

const extractToken = request => {
	const token = request.get('Authorization')
	if (token && token.includes('Bearer')) {
		return (token.replace('Bearer ', ''))
	}
	return (null)
}

notesRouter.post('/', async (req, res, next) => {
	const body = req.body
	try {
		const decodedToken = jwt.verify(extractToken(req), SECRET)
		if (!decodedToken.id)
			return (res.status(401).json({ error: 'token invalid'}))

		const user = await User.findById(decodedToken.id)
		if (!user)
			return (res.status(400).json({ error: 'userId missing or not valid' }))

		const note = new Note({
			content: body.content,
			important: body.important || false,
			user: user._id
		})

		const savedNote = await note.save()
		user.notes.push(savedNote._id)
		await user.save()
		res.status(201).send(savedNote)
	}
	catch (e) {
		next(e)
	}
})

notesRouter.put('/:id', async (req, res, next) => {
	const { content, important } = req.body

	try {
		const decodedToken = jwt.verify(extractToken(req), SECRET)
		if (!decodedToken.id)
			return (res.status(401).json({ error: 'token invalid'}))

		const user = await User.findById(decodedToken.id)
		if (!user)
			return (res.status(400).json({ error: 'userId missing or not valid' }))

		const foundNote = await Note.findById(req.params.id)
		if (!foundNote) {
			const newNote = new Note({
				content: content,
				important: important || false
			})
			await newNote.save()
			user.notes.push(newNote._id)
			await user.save()
			return (res.status(201).send(newNote))
		} else if (foundNote.user.toString() !== decodedToken.id) {
			return (res.status(401).json({ error: 'the note does note belong to the user' }))
		}

		foundNote.content = content
		foundNote.important = important

		await foundNote.save()
		res.status(204).end()
	} 
	catch (e) {
		next(e)
	}
})

module.exports = notesRouter