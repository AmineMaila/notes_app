import axios from 'axios'

const baseUrl = '/api/notes'
let token = null

export const setToken = newToken => {
	token = `Bearer ${newToken}`
}

const getAll = () => {
	return (axios
		.get(baseUrl).then(response => response.data)
	)
}

const create = async (newObject) => {
	const config = {
		headers: { Authorization: token }
	}

	const response = await axios
		.post(baseUrl, newObject, config)
	
	return (response.data)
}

const update = async (id, newObject) => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
	return (response.data)
}

export default { getAll, create, update }
