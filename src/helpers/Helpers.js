import React from 'react'
import { Redirect } from 'react-router-dom';

export const HELPER_FUNCTIONS = {
    logout: () => {
        localStorage.setItem("userData", '')
        localStorage.setItem("token", '')
        localStorage.clear()
        return (<Redirect to='/' />)
    },
    checkPermission: (route) => {
        const userInfo = JSON.parse( localStorage.getItem("userData") )
        const permissions = userInfo.role[0].permissionAssign
        for (let index = 0; index < permissions.length; index++) {
            const element = permissions[index];
            if (route === element.route) {
                return true
            }
        }
        return false
    }
} 