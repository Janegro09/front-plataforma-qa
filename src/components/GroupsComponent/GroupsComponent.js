import React, { Component } from 'react'
import SiderBarLeft from '../SidebarLeft/SiderbarLeft'

export default class GroupsComponent extends Component {
    render() {
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderBarLeft />
                </div>
                GroupsComponent
            </div>
        )
    }
}
