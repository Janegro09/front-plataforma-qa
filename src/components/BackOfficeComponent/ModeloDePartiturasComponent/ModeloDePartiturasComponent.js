import React, { Component } from 'react'
import SidebarLeft from '../../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader'
import axios from 'axios'
import Global from '../../../Global'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import moment from 'moment'
import Formulario from './Formulario'


export default class ModeloDePartiturasComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            loading: false,
            crearNuevo: false
        }
    }

    eliminarPlantilla = (id) => {
        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar una plantilla, no podrá recuperarla",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let token = JSON.parse(sessionStorage.getItem('token'))
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    axios.delete(Global.getPartitureModels + "/" + id, config)
                        .then(response => {
                            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                            if (response.data.Success) {
                                swal("Felicidades!", "Plantilla eliminada correctamente", "success");
                                window.location.reload(window.location.href);
                            }

                        })
                        .catch(e => {
                            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                HELPER_FUNCTIONS.logout()
                            } else {
                                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                swal("Error al eliminar!", {
                                    icon: "error",
                                });

                            }
                            console.log("Error: ", e)
                        })

                } else {
                    swal("No se elimino nada");
                }
            });

    }

    crearNuevo = (id = false) => {
        let crearNuevo = true;
        if (id !== false) {
            crearNuevo = id;
        }
        this.setState({ crearNuevo })
    }

    componentDidMount() {
        // Hacer rekest
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getPartitureModels, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            })
            let data = response.data.Data
            this.setState({ data })

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
        let { data, crearNuevo } = this.state
        return (
            <div>
                {crearNuevo &&
                    <Formulario idModificate={crearNuevo} />
                }
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SidebarLeft />
                    <UserAdminHeader />
                </div>

                <div className="section-content">
                    <button onClick={(e) => {
                        e.preventDefault();
                        this.crearNuevo();
                    }}>Crear nuevo</button>
                    {data &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Fecha de creación</th>
                                    <th>Editar</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((modelo, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{modelo.name}</td>
                                            <td> {moment(modelo.createdAt).format("DD/MM/YYYY")}</td>
                                            <td> <button onClick={(e) => {
                                                e.preventDefault();
                                                this.crearNuevo(modelo.id)
                                            }}>Editar</button> </td>
                                            <td> <button onClick={(e) => {
                                                e.preventDefault();
                                                this.eliminarPlantilla(modelo.id);
                                            }}>Eliminar</button> </td>
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
