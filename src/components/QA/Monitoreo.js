import React, { Component } from 'react';
import SiderbarLeft from '../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader';

export default class Monitoreo extends Component {
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
                    <h4>Monitoreo</h4>
                </div>
            </>
        )
    }
}
