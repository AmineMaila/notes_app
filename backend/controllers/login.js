const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { SECRET } = require('../utils/config')

loginRouter.post('/', async (req, res, next) => {
const { username, password } = req.body

	try {
		const user = await User.findOne({ username })
		const passwordCorrect = user && password
			? await bcrypt.compare(password, user.passwordHash)
			:	false

		if (!user || !passwordCorrect) {
			return res.status(401).json({
				error: 'username or password invalid'
			})
		}

		const payload = {
			username,
			id: user._id
		}

		const token = jwt.sign(
			payload,
			SECRET,
			{ expiresIn: 3600 }
		)

		res.status(200).send({
			token, username, name: user.name
		})

	} catch (e) {
		next(e)
	}
})

module.exports = loginRouter