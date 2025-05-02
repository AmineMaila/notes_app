import { useEffect, useState } from 'react'
import Note from './components/Note'
import noteServices from './services/notes'

const Notification = ({ message }) => {
	if (message === null){
		return null
	}

	return (
		<div className='error'>
			{message}
		</div>
	)
}

const Footer = () => {
	const footerStyle = {
		color: 'grey',
		fontStyle: 'italic',
		fontSize: '15',
		paddingTop: '20px',
		textAlign: 'center'
	}

	return (
		<div style={footerStyle}>
			<footer>Note App, Department Of Computer Science, Mmaila Coorprate</footer>
		</div>
	)
}

const App = () => {
	const [notes, setNotes] = useState([])
	const [newNote, setNewNote] = useState('')
	const [showAll, setShowAll] = useState(true)
	const [errorMessage, setErrorMessage] = useState(null)

	useEffect(() => {
		const nonExisting = {
			id: '1000',
			content: 'HI FROM x',
			important: false
		}
		noteServices
			.getAll()
			.then((initialNotes) => {
				setNotes(initialNotes.concat(nonExisting))
			})
			.catch((error) => console.log('could not fetch notes: ', error))
	}, [])

	const notesToShow = showAll
		? notes
		: notes.filter((obj) => obj.important)

	const addNote = (event) => {
		event.preventDefault()
		
		const noteObj = {
			id: (notes.length + 1).toString(),
			content: newNote,
			important: Math.random() < 0.5
		}

		noteServices
			.create(noteObj)
			.then((returnedNote) => {
				console.log('Note saved to the database: ', returnedNote)
				setNotes(notes.concat(returnedNote))
				setNewNote('')
			})
			.catch((error) => {
				alert('Could not save note to the server')
				console.log(error)
			})
	}

	const handleNoteChange = (event) => {
		setNewNote(event.target.value)
	}

	const toggleImportanceOf = (id) => {
		const note = notes.find(n => n.id === id)
		const changedNote = { ...note, important: !note.important }
		
		noteServices
			.update(id, changedNote)
			.then((returnedNote) => {
				setNotes(notes.map((n) => n.id === id ? returnedNote : n))
			})
			.catch((error) => {
				setErrorMessage(`the note "${note.content}" doesn't exist on the server`)
				console.log(error)

				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
				setNotes(notes.filter((n) => n.id !== id))
			})
	}

	return (
	  <div>
		<h1>Notes</h1>
		<Notification message={errorMessage} />
		<div className="show-important">
			<button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
		</div>
		<ul>
			{notesToShow.map((note) => 
				<Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
			)}
		</ul>
		<form onSubmit={addNote}>
			<input value={newNote} onChange={handleNoteChange} placeholder='add note'/>
			<button type="submit">save</button>
		</form>
		<Footer />
	  </div>
	)
}

export default App
