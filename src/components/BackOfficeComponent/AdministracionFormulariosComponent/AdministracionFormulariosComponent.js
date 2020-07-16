import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader'
import axios from 'axios';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import Global from '../../../Global'
import moment from 'moment';
import Modal from './Modal'

export default class AdministracionFormulariosComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allForms: null,
            loading: false,
            openModal: false,
            id: null
        }
    }

    abrirModal = (id = false) => {
        this.setState({
            openModal: true,
            id
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
        axios.get(Global.getAllForms, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                allForms: response.data.Data,
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
        let { allForms, openModal, id } = this.state;

        console.log("ALLFORMS: ", allForms);

        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>
                {openModal &&
                    <Modal idEditar={id} />
                }
                <div className="section-content">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            this.abrirModal();
                        }}
                    >
                        Agregar nuevo
                    </button>
                    {allForms &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Valores</th>
                                    <th>Requerido</th>
                                    <th>Sección</th>
                                    <th>Fecha de creación</th>
                                    <th>Editar</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allForms.map((form, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{form.name}</td>
                                            <td>{form.type}</td>
                                            <td>
                                                {form.values.map(value => {
                                                    return (
                                                        <div>
                                                            {value}
                                                        </div>
                                                    )
                                                })
                                                }
                                            </td>
                                            <td>{form.required ? 'Requerido' : 'No requerido'}</td>
                                            <td>{form.section.toUpperCase() === 'P' ? 'Perfilamiento' : 'Monitoreo'}</td>
                                            <td>{moment(form.createdAt).format("DD/MM/YYYY")}</td>
                                            <td> 
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.abrirModal(form.id);
                                                    }}
                                                >
                                                    Editar
                                                </button> 
                                            </td>
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
