const BASE = 'http://200.89.175.2:8000/api/v1'

let Global = {
    login: `${BASE}/login`,
    getUsers: `${BASE}/users`,
    createUser: `${BASE}/users/new`,
    deleteUser: `${BASE}/users/`,
    passChange: `${BASE}/users/passchange/`
}

export default Global;