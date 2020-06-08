import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'
import { Redirect } from 'react-router-dom'

export default class UsersComponent extends Component {
    render() {
        // Protección de rutas
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }
        return (
            <div>
                <div>
                    <SidebarLeft />
                </div>
                <h1>HOME</h1>
            </div>

        )
    }
}