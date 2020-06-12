import React, { Component } from 'react'
import SiderBarLeft from '../SidebarLeft/SiderbarLeft'
import RolesInfoContainer from '../RolesInfoContainer/RolesInfoContainer'
import Logo from '../Home/logo_background.png';

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
                <div className="logoBackground">
                    <img src={Logo} alt="Logo" title="Logo" className="Logo2" />
                </div>

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
