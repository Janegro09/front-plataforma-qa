require('dotenv').config();

const BASE = (() => {
    switch(process.env.REACT_APP_ENV) {
        case 'local':
            return 'http://localhost:8000/api/v1'
            break;
        case 'development': 
            return 'https://testingapi_plataformaeqa.solucionesdigitalesteco.com.ar/api/v1'
            break;
        case 'production':
        default:
            return 'https://apieqa.solucionesdigitalesteco.com.ar/api/v1'
            break;

    }
})();

let Global = {
    login: `${BASE}/login`,
    getUsers: `${BASE}/users`,
    createUser: `${BASE}/users/new`,
    deleteUser: `${BASE}/users/`,
    modifyUser: `${BASE}/users/`,
    changeStatus: `${BASE}/users/`,
    dashboard: `${BASE}/home`,
    passChange: `${BASE}/users/passchange/`,
    permissions: `${BASE}/permissions/`,
    frontUtilities: `${BASE}/frontUtilities`,
    getGroups: `${BASE}/groups`,
    getRoles: `${BASE}/roles`,
    sendNomina: `${BASE}/backoffice/nomina`,
    getAllPrograms: `${BASE}/programs`,
    getAllProgramsGroups: `${BASE}/programs/groups`,
    newPrograms: `${BASE}/programs/new`,
    getAllFiles: `${BASE}/analytics/file`,
    reasignProgram: `${BASE}/analytics/file`,
    download: `${BASE}/downloadFile`,
    files: `${BASE}/files`,
    getPartitureModels: `${BASE}/analytics/partituresModels`,
    getAllForms: `${BASE}/forms/customfields`,
    getAllPartitures: `${BASE}/analytics/partitures`,
    getAllPartituresModel: `${BASE}/analytics/partituresModels`,
    exportsDatabase: `${BASE}/backoffice/exports`,
    newModel: `${BASE}/analytics/cuartilesModels`,
    perfilamientosModel: `${BASE}/analytics/perfilamientosModel`,
    newFormModel: `${BASE}/forms/models`,
    getForms: `${BASE}/forms`,
    monitoreos: `${BASE}/qa/monitoring`,
    calibrationTypes: `${BASE}/qa/calibration/types`,
    calibration: `${BASE}/qa/calibration`,
    reporteria: `${BASE}/reporting`
}

export default Global;
