import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import axios from 'axios';
import Global from '../../Global';

export default class PartiturasEspecificComponent extends Component {

    state = {
        id: null,
        loading: false,
        users: null
    }

    componentDidMount() {
        let id = this.props.match.params.id;

        this.setState({
            loading: true
        });

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures + '/' + id, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false,
                users: response.data.Data[0].users
            })
            console.log("La response: ", response.data.Data)

        })
            .catch((e) => {
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
            });
    }
    render() {
        let { loading, users } = this.state;
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
                    <h1>Archivo actual</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Fechas</th>
                                <th>Nombre</th>
                                <th>Estado de partitura</th>
                                <th>Archivos incluídos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>Usuarios</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Fechas</th>
                                <th>Nombre</th>
                                <th>Estado de partitura</th>
                                <th>Archivos incluídos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                                <td>a</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}
