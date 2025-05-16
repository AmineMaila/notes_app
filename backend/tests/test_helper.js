const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const ft_populate = async (note) => {
	const user = await User.findById(note.user).lean()
	if (!user)
		return (null)
	note.user = {
		id: user._id.toString(),
		name: user.name,
		username: user.username
	}
	return (note)
}

const getUserToken = async (username) => {
	const user = await User.findOne({ username })
	if (!user)
		return null

	const payload = {
		id: user._id,
		username
	}

	return jwt.sign(payload, SECRET)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const insertUserInNotes = (userId) => {
	return (initialNotes.map(n => ({
		...n,
		user: userId
	})))
}

module.exports = {
  initialNotes,
	nonExistingId,
	notesInDb,
	usersInDb,
	insertUserInNotes,
	ft_populate,
	getUserToken,
}