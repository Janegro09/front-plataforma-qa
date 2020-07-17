import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'

export default class PartiturasComponent extends Component {
    render() {
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Estado de partitura</th>
                                <th>Perfilamientos</th>
                                <th>Fechas</th>
                                <th>Usuarios</th>
                                <th>Instancias</th>
                                <th>Ver</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>January</td>
                                <td>$100</td>
                                <td>January</td>
                                <td>$100</td>
                                <td>January</td>
                                <td>$100</td>
                                <td>ver</td>
                                <td>eliminar</td>
                            </tr>
                            <tr>
                                <td>January</td>
                                <td>$100</td>
                                <td>January</td>
                                <td>$100</td>
                                <td>January</td>
                                <td>$100</td>
                                <td>ver</td>
                                <td>eliminar</td>
                            </tr>
                            <tr>
                                <td>January</td>
                                <td>$100</td>
                                <td>January</td>
                                <td>$100</td>
                                <td>January</td>
                                <td>$100</td>
                                <td>ver</td>
                                <td>eliminar</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
