import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'
import { Redirect } from 'react-router-dom'
import './Home.css';
import Logo from '../Home/logo_background.png';

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
 
                <div className="logoBackground">
                    <img src={Logo} alt="Logo" title="Logo" className="Logo2" />
                </div>
            </div>

        )
    }
}