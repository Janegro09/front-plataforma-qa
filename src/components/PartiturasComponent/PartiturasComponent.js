import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import axios from 'axios';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';

export default class PartiturasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            allPartitures: null
        }
    }

    verPartitura = () => {
        console.log("Ver partitura");
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
        let { allPartitures } = this.state;

        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>
                <div className="section-content">
                    {allPartitures !== null &&
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
                                {allPartitures.map((partiture, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{partiture.name}</td>
                                            <td>{partiture.partitureStatus}</td>
                                            <td>{partiture.perfilamientos}</td>
                                            <td>{partiture.dates.createdAt}</td>
                                            <td>{partiture.users}</td>
                                            <td>{partiture.instances}</td>
                                            <td>
                                                <button
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            this.verPartitura();
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
