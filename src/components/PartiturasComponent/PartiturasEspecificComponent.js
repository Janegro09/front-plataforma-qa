import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import axios from 'axios';
import Global from '../../Global';
import moment from 'moment';

export default class PartiturasEspecificComponent extends Component {

    state = {
        id: null,
        loading: false,
        data: null
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
                data: response.data.Data
            })

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
        let { loading, data } = this.state;
        data = data ? data[0] : null;

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

                {data &&
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
                                    <td>{moment(data.dates.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                    <td>{data.name}</td>
                                    <td>{data.partitureStatus}</td>
                                    <td>{data.fileId.length}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2>Usuarios</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>DNI</th>
                                    <th>Improvment</th>
                                    <th>Estado</th>
                                    <th>Nombre</th>
                                    <th>Canal</th>
                                    <th>Última actualización</th>
                                    <th>Cluster</th>
                                    <th>Responsable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.users &&
                                    data.users.map(user => {
                                        return (
                                            <tr key={user.idDB}>
                                                <td><button>Ver</button></td>
                                                <td>{user.dni}</td>
                                                <td>{user.improvment}</td>
                                                <td>{user.partitureStatus}</td>
                                                <td>{user.name} {user.lastName}</td>
                                                <td>{user.canal}</td>
                                                <td>REVISAR ESTA CACA</td>
                                                <td>{user.cluster}</td>
                                                <td>{user.responsable}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </>
        )
    }
}
