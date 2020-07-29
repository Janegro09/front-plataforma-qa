import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import { Redirect } from 'react-router-dom'
import './Home.css';
import Logo from '../Home/logo_background.png';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import axios from 'axios';
import swal from 'sweetalert';

export default class UsersComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: 'user',
            redirect: false
        }
    }

    componentDidMount() {
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.dashboard, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
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