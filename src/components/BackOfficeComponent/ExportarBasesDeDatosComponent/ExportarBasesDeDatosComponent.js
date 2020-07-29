import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader'
import Global from '../../../Global'
import axios from 'axios'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'

export default class AdministracionFormulariosComponent extends Component {

    state = {
        loading: false,
        urlUser: ''
    }

    // /backoffice/exports?type=database&name=users
    exportsDatabase = async () => {
        this.setState({ loading: true });
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        try {
            let response = await axios.get(Global.exportsDatabase + '?type=database&name=users', { headers: { Authorization: bearer } })
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            let urlUser = Global.download + '/' + response.data.Data.tempId;

            this.setState({ loading: false, urlUser });


        } catch (e) {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                this.setState({
                    loading: false
                })
                swal("Error!", "Hubo un problema", "error");
            }
            console.log("Error: ", e)
        }

    }

    render() {
        let { loading, urlUser } = this.state;

        return (
            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>
                <div className="section-content">
                    <h1>Exportar</h1>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            this.exportsDatabase();
                        }}
                    >
                        Tabla de usuarios
                    </button>

                    {urlUser !== '' &&
                        <a href={urlUser}>Descargar</a>
                    }

                </div>
            </>
        )
    }
}