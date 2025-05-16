import { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import DashBoard from './components/DashBoard'

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
	const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

	return (
	  <div>
		<h1>Notes</h1>
		<Notification message={errorMessage} />
		{
			user === null
				? <LoginForm setUser={setUser} setErrorMessage={setErrorMessage} />
				: <DashBoard setErrorMessage={setErrorMessage} user={user} setUser={setUser} />
		}
		<Footer />
	  </div>
	)
}

export default App
