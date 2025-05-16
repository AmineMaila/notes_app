import { useEffect, useState } from 'react'
import login from '../services/login'
import { setToken } from '../services/notes'

const LoginForm = ({ setUser, setErrorMessage }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setToken(user.token)
			setUser(user)
		}
	}, [])

	const handleLogin = async (event) => {
		event.preventDefault()
		
		try {
			const user = await login({ username, password })

			window.localStorage.setItem(
				'loggedNoteAppUser', JSON.stringify(user)
			)
			console.log(window.localStorage)
			
			setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		}
		catch (e) {
			setErrorMessage('Invalid username or password')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}

	return (
		<form onSubmit={handleLogin}>
			<div>
				username
				<input
					type="text"
					value={username}
					name="Username"
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				password
					<input
					type="password"
					value={password}
					name="Password"
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type="submit">login</button>
		</form>
	)
}

export default LoginForm