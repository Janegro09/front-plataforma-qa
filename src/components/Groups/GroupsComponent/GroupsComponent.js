import React, { Component } from 'react'
import SiderBarLeft from '../../SidebarLeft/SiderbarLeft'
import GroupInfoContainer from '../GroupInfoContainer/GroupInfoContainer'
import Logo from '../../Home/logo_background.png';
// import UserAdminHeader from '../userAdminHeader/userAdminHeader'
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader'



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

        return (
            <div>

                <div className="logoBackground">
                    <img src={Logo} alt="" title="Logo" className="logoFixed" />
                </div>
                <UserAdminHeader />
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderBarLeft />
                </div>

                {/* PAGINACION  */}

                <div className="section-content">
                    <GroupInfoContainer userInfo={userInfo} />
                </div>

            </div>
        )
    }
}
