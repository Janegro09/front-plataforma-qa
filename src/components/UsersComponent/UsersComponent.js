import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserInfoContainer from '../UserInfoContainer/UserInfoContainer'
import { Redirect } from 'react-router-dom'
import './Home.css'


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

