import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import UserInfoContainer from '../UserInfoContainer/UserInfoContainer'
import { Redirect } from 'react-router-dom'
// import './Home.css'
import Logo from '../../Home/logo_background.png';
import UserAdminHeader from '../userAdminHeader/userAdminHeader'
import PublishIcon from '@material-ui/icons/Publish';


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

        if (this.state.redirect || userInfo === null) {
            return <Redirect to={'/'} />
        }
        return (
            <div>
                
                <div className="logoBackground">
                    <img src={Logo} alt="Logo" title="Logo" className="logoFixed" />
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
                <div className="uploadNomina"><div>Nómina actual 30/06/2020</div> <button>Actualizar<PublishIcon /></button></div>
            </div>
        )
    }
}

