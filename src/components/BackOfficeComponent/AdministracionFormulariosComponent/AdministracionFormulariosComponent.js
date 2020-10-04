import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader'
import axios from 'axios';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import Global from '../../../Global'
import moment from 'moment';
import Modal from './Modal'
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
        this.setState({ goToFormularios: true });
    }

    modeloFormularios = () => {
        this.setState({ goToModeloFormularios: true });
    }

    buscarForm = (e) => {
        let { allFormsFiltrado, allForms } = this.state;
        let buscado = e.target.value.toLowerCase();

        if (buscado) {
            allFormsFiltrado = allFormsFiltrado.filter(form => form.name.toLowerCase().includes(buscado))

            this.setState({ allFormsFiltrado });
        } else {

            this.setState({ allFormsFiltrado: allForms })

        }

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
                allFormsFiltrado: response.data.Data,
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
        let { allFormsFiltrado, openModal, id, loading, goToFormularios, goToModeloFormularios } = this.state;

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
                    <div className="flex-input-add input-add-spacebetween">
                        <h4 className="mr-2">ADMINISTRADOR DE FORMULARIOS</h4>
                        <div className="containerDefaultBotons">
                            <button className="btnDefault"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.abrirModal();
                                }}
                            >
                                CAMPO PERSONALIZADO
                        </button>

                            <button
                                className="btnDefault"
                                onClick={this.formularios}
                            >
                                FORMULARIOS
                        </button>

                            <button
                                className="btnDefault"
                                onClick={this.modeloFormularios}

                            >
                                MODELOS DE FORMULARIO
                        </button>
                        </div>
                    </div>
                    <hr />
                    <br />

                    <input
                        type="text"
                        placeholder="Buscar"
                        onChange={this.buscarForm}
                        className="form-control margin-bottom-20"
                    />

                    {allFormsFiltrado &&
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
                                {allFormsFiltrado.map((form, key) => {
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
