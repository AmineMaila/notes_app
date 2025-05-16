const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: [5, 'content must be at least 5 characters long'],
    required: [true, 'content missing'],
  },
  important: Boolean,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)