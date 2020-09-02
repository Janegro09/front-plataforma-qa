import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader'
import axios from 'axios';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import Global from '../../../Global'
import moment from 'moment';
import Modal from './Modal'
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Redirect } from 'react-router-dom';

export default class AdministracionFormulariosComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allForms: null,
            loading: false,
            openModal: false,
            id: null,
            goToFormularios: false,
            goToModeloFormularios: false
        }
    }

    abrirModal = (id = false) => {
        this.setState({
            openModal: true,
            id
        })
    }

    eliminar = (id) => {
        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar un campo personalizado, no podrás recuperarlo",
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
                    axios.delete(Global.getAllForms + "/" + id, config)
                        .then(response => {
                            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                            if (response.data.Success) {
                                swal("Felicidades!", "Campo personalizado eliminado correctamente", "success").then(() => {
                                    window.location.reload(window.location.href);
                                });
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

    formularios = () => {
        console.log('a')
        this.setState({ goToFormularios: true });
    }

    modeloFormularios = () => {
        console.log('b');
        this.setState({ goToModeloFormularios: true });
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

            console.log(response.data.Data);

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
        let { allForms, openModal, id, loading, goToFormularios, goToModeloFormularios } = this.state;

        if (goToFormularios) {
            return <Redirect
                to="/administracion-formularios/formularios"
            />;
        }

        if (goToModeloFormularios) {
            return <Redirect
                to="/administracion-formularios/modelo-formularios"
            />;
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
                {openModal &&
                    <Modal idEditar={id} />
                }

                <div className="section-content">
                    <div className="flex-input-add">
                        <h4 className="mr-2">ADMINISTRADOR DE FORMULARIOS</h4>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                this.abrirModal();
                            }}
                        >
                            <AddIcon className="morph" />
                        </button>

                        <button
                            className="btn btn-outline-primary m-1"
                            onClick={this.formularios}
                        >
                            Formularios
                        </button>

                        <button
                            className="btn btn-outline-primary m-1"
                            onClick={this.modeloFormularios}

                        >
                            Modelo de formularios
                        </button>

                    </div>
                    <hr />
                    <br />
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
                                    <th>Formato</th>
                                    <th className="tableIcons">Editar</th>
                                    <th className="tableIcons">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allForms.map((form, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{form.name}</td>
                                            <td>{form.type}</td>
                                            <td>
                                                {form.values.length === 0 &&
                                                    <div>
                                                        -
                                                    </div>
                                                }
                                                {form.values.length > 0 &&
                                                    form.values.map((value, key) => {
                                                        console.log(value);
                                                        return (
                                                            <div key={key}>
                                                                {value.value}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </td>
                                            <td>{form.required ? 'Requerido' : 'No requerido'}</td>
                                            <td>{form.section.toUpperCase() === 'P' ? 'Perfilamiento' : 'Monitoreo'}</td>
                                            <td>{moment(form.createdAt).format("DD/MM/YYYY")}</td>
                                            <td>{form.format ? form.format : '-'}</td>
                                            <td className="tableIcons">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.abrirModal(form.id);
                                                    }}
                                                >
                                                    <EditIcon style={{ fontSize: 15 }} />
                                                </button>
                                            </td>
                                            <td className="tableIcons">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.eliminar(form.id);
                                                    }}
                                                >
                                                    <DeleteIcon style={{ fontSize: 15 }} />
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
