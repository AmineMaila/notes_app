const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
	logger.error(error.message)
	console.error(error.name)

	if (error.name === 'CastError') {
		return (res.status(400).json({ error: 'malformed id' }))
	} else if (error.name === 'ValidationError') {
		return (res.status(400).json({ error: error.message }))
	} else if (error.code === 11000) {
		return (res.status(400).json({ error: 'expected `username` to be unique' }))
	} else if (error.name ===  'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpirationError') {
		return res.status(401).json({ error: 'token expired' })
	}
	next(error)
}

const unknownEndpoint = (request, response, next) => {
	response.status(404).json({ error: 'unknown endpoint' })
	next()
}

const requestLogger = (req, res, next) => {
	logger.info('Method: ', req.method)
	logger.info('Path: ', req.path)
	logger.info('body: ', req.body)
	logger.info('---')
	next()
}

module.exports = {unknownEndpoint, errorHandler, requestLogger}