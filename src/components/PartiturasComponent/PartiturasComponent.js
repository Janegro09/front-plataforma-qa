import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import Modal from './Modal'
import axios from 'axios';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import moment from 'moment';
import { Redirect } from 'react-router-dom';


export default class PartiturasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allPartitures: null,
            specific: false,
            idSpecific: '',
            modalAgregar: false
        }
    }

    verPartitura = (id) => {
        // Hacer rekest
        this.setState({
            specific: true,
            idSpecific: id
        });
    }

    crearPartitura = () => {
        this.setState({ modalAgregar: true });
    }

    eliminarPartitura = (id) => {
        let token = JSON.parse(sessionStorage.getItem('token'))
        this.setState({
            loading: true
        })
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.delete(Global.getAllPartitures + '/' + id, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token));
                this.setState({
                    loading: false
                })
                if (response.data.Success) {
                    swal("Partitura eliminada correctamente", {
                        icon: "success",
                    }).then(() => {
                        window.location.reload(window.location.href);
                    })
                }
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al intentar borrar el rol", "error");
                    this.setState({
                        loading: false,
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })
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
        let { allPartitures, loading, specific, idSpecific, modalAgregar } = this.state;

        if (specific) {
            return <Redirect to={`/partituras/${idSpecific}`} />
        }

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

                {modalAgregar &&
                    <Modal />
                }

                <div className="section-content">

                    {HELPER_FUNCTIONS.checkPermission('POST|analytics/partitures/new') &&
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
                    }

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
                                                {HELPER_FUNCTIONS.checkPermission('DELETE|analytics/partitures/:id') &&
                                                    <button
                                                        onClick={
                                                            (e) => {
                                                                e.preventDefault();
                                                                this.eliminarPartitura(partiture.id);
                                                            }
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>
                                                }
                                                {!HELPER_FUNCTIONS.checkPermission('DELETE|analytics/partitures/:id') &&
                                                    <button
                                                    disabled
                                                    >
                                                        Eliminar
                                                    </button>
                                                }
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
