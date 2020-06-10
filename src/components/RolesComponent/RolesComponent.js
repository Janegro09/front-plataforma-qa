import React, { Component } from 'react'
import SiderBarLeft from '../SidebarLeft/SiderbarLeft'
// import './UserTable.css'
import { Redirect } from 'react-router-dom'
import RolesInfoContainer from '../RolesInfoContainer/RolesInfoContainer'


import Global from '../../Global'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'


export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }

        this.logout = this.logout.bind(this)
    }

    logout() {
        sessionStorage.setItem("userData", '')
        sessionStorage.clear()
        this.setState({ redirect: true })
    }

    render() {

        const userInfo = JSON.parse(sessionStorage.getItem("userData"));

        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderBarLeft />
                </div>

                {/* PAGINACION  */}

                <div className="section-content">
                    <RolesInfoContainer userInfo={userInfo} />
                </div>
            </div>
        )
    }
}
