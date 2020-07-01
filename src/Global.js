const BASE = 'https://testingapi_plataformaqa.solucionesdigitalesteco.com.ar/api/v1'

let Global = {
    login: `${BASE}/login`,
    getUsers: `${BASE}/users`,
    createUser: `${BASE}/users/new`,
    deleteUser: `${BASE}/users/`,
    modifyUser: `${BASE}/users/`,
    changeStatus: `${BASE}/users/`,
    passChange: `${BASE}/users/passchange/`,
    permissions: `${BASE}/permissions/`,
    frontUtilities: `${BASE}/frontUtilities`,
    getGroups: `${BASE}/groups`,
    getRoles: `${BASE}/roles`,
    sendNomina: `${BASE}/backoffice/nomina`,
    getAllPrograms: `${BASE}/programs`,
    getAllProgramsGroups: `${BASE}/programs/groups`,
    newPrograms: `${BASE}/programs/new`,
}

export default Global;