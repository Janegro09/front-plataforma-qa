import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import ReporteriaForm from './ReporteriaForm'

export default class Reporteria extends Component {
    render() {
        return (
            <>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                <div className="section-content">
                    <ReporteriaForm />
                </div>
            </>
        )
    }
}
