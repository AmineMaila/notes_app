const usersRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res, next) => {
	try {
		const users = await User.find({}).populate('notes', { content: 1, important: 1 })
		res.json(users)
	}
	catch (e) {
		next(e)
	}
})

usersRouter.get('/:username', async (req, res, next) => {
	try {
		const user = await User.findOne({ username: req.params.username })
		if (!user)
			res.status(404).json({ message: 'user not found' })
		res.json(user)
	}
	catch (e) {
		next(e)
	}
})

usersRouter.post('/', async (req, res, next) => {
	const { username, name, password } = req.body
	try {
		const saltRounds = 10
		const passwordHash = await bcrypt.hash(password, saltRounds)

		const user = new User({
			username,
			name,
			passwordHash
		})

		await user.save()

		res.status(201).json(user)
	}
	catch (e) {
		next(e)
	}
})

usersRouter.delete('/:username', async (req, res, next) => {
	try {
		const deleted = await User.findOneAndDelete({ username: req.params.username })
		if (!deleted)
				return (res.status(404).end())
		await Note.deleteMany({ _id: { $in: deleted.notes } })
		res.status(204).end()
	}
	catch (e) {
		next(e)
	}
})

module.exports = usersRouter