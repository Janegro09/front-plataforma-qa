import React from 'react'
import { Redirect } from 'react-router-dom';

export const HELPER_FUNCTIONS = {
    logout: () => {
        localStorage.setItem("userData", '')
        localStorage.setItem("token", '')
        localStorage.clear()
        return (<Redirect to='/' />)
    },
    checkPermissionGroup: (grupo) => {
        const userInfo = JSON.parse(localStorage.getItem("userData"))
        const permissions = userInfo.role[0].permissionAssign
        for (let index = 0; index < permissions.length; index++) {
            const element = permissions[index];
            if (grupo === element.group) {
                return true
            }
        }
        return false
    },
    checkPermission: (route) => {
        const userInfo = JSON.parse(localStorage.getItem("userData"))
        const permissions = userInfo.role[0].permissionAssign
        for (let index = 0; index < permissions.length; index++) {
            const element = permissions[index];
            if (route === element.route) {
                return true
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
                    nameReturn += 'puede agregar '
                    break;
                case 'update':
                    nameReturn += 'puede actualizar '
                    break;
                case 'delete':
                    nameReturn += 'puede borrar '
                    break;
                case 'get':
                    nameReturn += 'puede consultar '
                    break;
                case 'diabled':
                    nameReturn += 'puede desactivar '
                    break;
                case 'passchange':
                    nameReturn += 'puede cambiar la contraseña '
                    break;
                case 'importNomina':
                    nameReturn += 'puede importar una nueva nomina '
                    break;

                default:
                    nameReturn += value
                    break;
            }
            return true
        })
        return nameReturn

    }
} 