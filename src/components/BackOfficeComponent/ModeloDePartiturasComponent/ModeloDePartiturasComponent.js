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

    crearNuevo = () => {
        this.setState({ crearNuevo: true })
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
        console.log("la data: ", data);
        return (
            <div>
                {crearNuevo &&
                    <Formulario />
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
                                            <td> <button>Editar</button> </td>
                                            <td> <button>Eliminar</button> </td>
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
