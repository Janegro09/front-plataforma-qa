import React, { Component } from 'react';
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft';
import UserInfoContainer from '../UserInfoContainer/UserInfoContainer';
import { Redirect } from 'react-router-dom';
import Logo from '../../Home/logo_background.png';
import UserAdminHeader from '../userAdminHeader/userAdminHeader';


export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }

    logout = () => {
        localStorage.setItem("userData", '')
        localStorage.clear()
        this.setState({ redirect: true })
    }

    render() {
        const userInfo = JSON.parse(localStorage.getItem("userData"));

        if (this.state.redirect || userInfo === null) {
            return <Redirect to={'/'} />
        }

        return (
            <div>

                <div className="logoBackground">
                    <img src={Logo} alt="" title="Logo" className="logoFixed" />
                </div>
                <UserAdminHeader />
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft name={userInfo.name} />
                </div>
                {/* PAGINACION  */}
                {/* <h1>USUARIOS</h1> */}
                <div className="section-content">
                    <UserInfoContainer userInfo={userInfo} />
                </div>
            </div>

        )
    }
}

