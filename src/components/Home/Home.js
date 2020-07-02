import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import { Redirect } from 'react-router-dom'
import './Home.css';
import Logo from '../Home/logo_background.png';

export default class UsersComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: 'user',
            redirect: false
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }
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
                    <img src={Logo} alt="" title="" className="Logo2" />
                </div>

                {/* {HELPER_FUNCTIONS.checkPermission("POST|users/passchange/:id") && userData && */}
                    <UserAdminHeader />
                {/* } */}
                
            </div>

        )
    }
}