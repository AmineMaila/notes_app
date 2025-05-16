import { useState, useEffect } from "react"
import noteServices from '../services/notes'
import Note from '../components/Note'

const DashBoard = ({ setErrorMessage, user, setUser }) => {
	const [notes, setNotes] = useState([])
	const [newNote, setNewNote] = useState('')
	const [showAll, setShowAll] = useState(true)
	
	useEffect(() => {
		noteServices
			.getAll()
			.then((initialNotes) => {
				setNotes(initialNotes)
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
				setNotes(notes.concat(returnedNote))
				setNewNote('')
			})
			.catch((error) => {
				if (error.response.status === 401) {
					window.localStorage.removeItem('loggedNoteAppUser')
					setUser(null)
				}
				setErrorMessage(error.response.data.error)
				setTimeout(() => {
					setErrorMessage(null)
				}, 5000)
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
			.then(() => { // put returns 204 No Content according to MDN
				setNotes(notes.map((n) => n.id === id ? changedNote : n))
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
		<>
			<p>Welcome {user.name}</p>
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
		</>
	)
}

export default DashBoard