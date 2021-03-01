import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import './BackOfficeComponent.css'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import SubirNominaComponent from './SubirNominaComponent'

export default class BackOfficeComponent extends Component {
    render() {
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                <div className="section-content">
                    <SubirNominaComponent />
                </div>

            </div>
        )
    }
}
