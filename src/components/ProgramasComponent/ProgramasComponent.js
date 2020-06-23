import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../userAdminHeader/userAdminHeader'
import swal from 'sweetalert'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import Global from '../../Global'

export default class ProgramasComponent extends Component {
    render() {
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>
                {/* {this.state.loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                } */}
                ProgramasComponent
            </div>
        )
    }
}
