import React from 'react'
import { Redirect } from 'react-router-dom';
import '../App.css'
import '../components/Users/UserTable/UserTable.css'
// import CircularProgress from '@material-ui/core/CircularProgress';

export const HELPER_FUNCTIONS = {
    logout: () => {
        localStorage.setItem("userData", '')
        localStorage.setItem("token", '')
        localStorage.clear()
        window.location.href = document.location.origin;
        return (<Redirect to='/' />)
    },
    checkPermissionGroup: (grupo) => {
        const userInfo = JSON.parse(localStorage.getItem("userData"))
        if (userInfo !== null) {
            const permissions = userInfo.role[0].permissionAssign
            for (let index = 0; index < permissions.length; index++) {
                const element = permissions[index];
                if (grupo === element.group) {
                    return true
                }
            }
        }
        return false
    },
    checkPermission: (route) => {
        const userInfo = JSON.parse(localStorage.getItem("userData"))
        if (userInfo !== null) {
            const permissions = userInfo.role[0].permissionAssign
            for (let index = 0; index < permissions.length; index++) {
                const element = permissions[index];
                if (route === element.route) {
                    return true
                }
            }
        }
        return false
    },
    namePermission: (name) => {
        let temp = name.split(" ")
        let nameReturn = ""
        temp.map(value => {
            switch (value) {
                case 'new':
                    nameReturn += 'agregar '
                    break;
                case 'update':
                    nameReturn += 'actualizar '
                    break;
                case 'delete':
                    nameReturn += 'borrar '
                    break;
                case 'get':
                    nameReturn += 'consultar '
                    break;
                case 'diabled':
                    nameReturn += 'desactivar '
                    break;
                case 'passchange':
                    nameReturn += 'cambiar la contraseña '
                    break;
                case 'importNomina':
                    nameReturn += 'importar una nueva nomina '
                    break;
                case 'create':
                    nameReturn += 'crear '
                    break;
                case 'unassignUser':
                    nameReturn += 'desasignar usuarios '
                    break;
                case 'customfields':
                    nameReturn += 'campos personalizados '
                    break;
                case 'users':
                    nameReturn += 'usuarios '
                    break;
                case 'groups':
                    nameReturn += 'grupos '
                    break;
                case 'modify':
                    nameReturn += 'modificar '
                    break;
                case 'downloadFile':
                    nameReturn += 'descargar '
                    break;
                case 'file':
                    nameReturn += 'archivo '
                    break;
                case 'getColumns':
                    nameReturn += 'obtener columnas '
                    break;
                case 'unassignGroup':
                    nameReturn += 'desasignar grupo '
                    break;
                case 'assignProgram':
                    nameReturn += 'asignar programa '
                    break;
                case 'exports':
                    nameReturn += 'exportar '
                    break;
                case 'deleteFile':
                    nameReturn += 'eliminar '
                    break;
                case 'newFile':
                    nameReturn += 'agregar '
                    break;
                case 'download':
                    nameReturn += 'descargar '
                    break;
                case 'newGroup':
                    nameReturn += 'nuevo grupo de perfilamiento '
                    break;
                case 'getGroups':
                    nameReturn += 'obtener grupos de perfilamiento '
                    break;
                case 'changePartitureStatus':
                    nameReturn += 'cambiar estado de partitura '
                    break;
                case 'uploadFile':
                    nameReturn += 'subir archivo '
                    break;
                case 'getPublicFile':
                    nameReturn += 'obtener archivo publico '
                    break;

                default:
                    nameReturn += value + ' '
                    break;
            }
            return true
        })
        return nameReturn

    },
    backgroundLoading: () => {
        return (
            <div className="background-loading">
                <div className="lds-ripple"><div></div><div></div></div>
            </div>
        )
    },
    generateCustomId: (securityLevel = 10) => {
        let id = '';

        for (let i = 0; i < securityLevel; i++) {
            id += (Date.now() * Math.random()).toString();
        }

        return id;
    },
    set_page_title: (name = 'QA') => {
        document.title = `${name} | Telecom Argentina`;
    }
} 