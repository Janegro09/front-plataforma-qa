import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import axios from 'axios';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import moment from 'moment';

export default class PartiturasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allPartitures: null
        }
    }

    verPartitura = (id) => {
        // Hacer rekest
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures + '/' + id, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            console.log("La response: ", response.data.Data)
            // this.setState({
            //     allPartitures: response.data.Data,
            //     loading: false
            // })

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

    crearPartitura = () => {
        console.log("Crear partitura");
    }

    eliminarPartitura = () => {
        console.log("Eliminar partitura");
    }

    componentDidMount() {
        // Hacer rekest
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                allPartitures: response.data.Data,
                loading: false
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
        let { allPartitures, loading } = this.state;
        return (
            <div>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                <button
                    onClick={
                        (e) => {
                            e.preventDefault();
                            this.crearPartitura();
                        }
                    }
                >
                    Crear partitura
                </button>
                <div className="section-content">
                    {allPartitures !== null &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Fechas</th>
                                    <th>Nombre</th>
                                    <th>Estado de partitura</th>
                                    <th>Archivos incluídos</th>
                                    <th>Ver</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPartitures.map((partiture, key) => {
                                    console.log(partiture)
                                    return (
                                        <tr key={key}>
                                            <td>{moment(partiture.dates.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                            <td>{partiture.name}</td>
                                            <td>{partiture.partitureStatus}</td>
                                            <td>{partiture.fileId.length.toString()}</td>
                                            <td>
                                                <button
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            this.verPartitura(partiture.id);
                                                        }
                                                    }
                                                >
                                                    Ver
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            this.eliminarPartitura();
                                                        }
                                                    }
                                                >
                                                    Eliminar
                                                </button>
                                            </td>

                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        )
    }
}
