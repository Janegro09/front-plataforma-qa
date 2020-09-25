import React, { Component } from 'react';
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader';
import Global from '../../../Global';
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import swal from 'sweetalert';
import './Modal.css';
import moment from 'moment';
import ModalModeloFormulariosComponent from './ModalModeloFormularios';
import ModalEditarModelo from './ModalEditarModelo';
import { Redirect } from 'react-router-dom';

export default class ModeloFormularios extends Component {

    state = {
        allForms: null,
        loading: false,
        cantSecciones: [],
        dataToSend: {
            name: "",
            section: "M",
            subsection: "",
            description: "",
            parts: []
        },
        redirect: false,
        models: null,
        modalModeloFormulario: false,
        ModalEditarModeloFormularios: false,
        idToEdit: null
    }

    abrirModalModeloFormularios = () => {
        this.setState({ modalModeloFormulario: true });
    }

    abrirModalEditarModeloFormularios = (id) => {
        this.setState({ ModalEditarModeloFormularios: true, idToEdit: id });
    }

    componentDidMount = () => {
        this.setState({
            loading: true
        })

        let tokenUser = JSON.parse(sessionStorage.getItem("token"));
        let token = tokenUser;
        let bearer = `Bearer ${token}`;


        axios.get(Global.newFormModel, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            // ACÁ VAN A QUEDAR LAS DE M

            this.setState({
                loading: false,
                models: response.data.Data,
                modelsFiltrado: response.data.Data
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

    ver = (e) => {
        const { id } = e.target.dataset;

        let redirect = `/administracion-formularios/modelo-formularios/${id}`;

        this.setState({ redirect })

    }

    eliminar = (e) => {
        const { id } = e.target.dataset;

        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar un modelo de formulario, no podrás recuperarlo",
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
                    axios.delete(Global.newFormModel + "/" + id, config)
                        .then(response => {
                            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                            if (response.data.Success) {
                                swal("Felicidades!", "Modelo de formulario eliminado correctamente", "success").then(() => {
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

    editar = (e) => {
        const { id } = e.target.dataset;

        console.log("Editamos", id)
    }

    buscarModeloFormularios = (e) => {
        let { models, modelsFiltrado } = this.state;
        let buscado = e.target.value.toLowerCase();

        if (buscado) {
            modelsFiltrado = modelsFiltrado.filter(model => model.name.toLowerCase().includes(buscado));
            this.setState({ modelsFiltrado });
        } else {
            this.setState({ modelsFiltrado: models });
        }
    }

    render() {
        let { loading, modelsFiltrado, modalModeloFormulario, ModalEditarModeloFormularios, idToEdit, redirect } = this.state;

        if (redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <>
                {modalModeloFormulario &&
                    <ModalModeloFormulariosComponent />
                }

                {ModalEditarModeloFormularios &&
                    <ModalEditarModelo id={idToEdit} />
                }
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }


                <div className="header">
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>


                <div className="section-content">

                    <h4 className="margin-top-70">Modelo de formularios</h4>

                    <button
                        className="btn btn-primary"
                        onClick={
                            (e) => {
                                e.preventDefault();
                                this.abrirModalModeloFormularios()
                            }
                        }
                    >
                        +
                    </button>



                    <input
                        type="text"
                        placeholder="Buscar"
                        onChange={this.buscarModeloFormularios}
                        className="form-control"
                    />

                    {modelsFiltrado &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Creado</th>
                                    <th>Descripción</th>
                                    <th>Partes</th>
                                    <th>Sección</th>
                                    <th>Subsección</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    modelsFiltrado.map(model => {
                                        return (
                                            <tr key={model.id}>
                                                <td>{model.name}</td>
                                                <td>{moment(model.createdAt).format("DD/MM/YYYY")}</td>
                                                <td>{model.description}</td>
                                                <td>{model.parts}</td>
                                                <td>{model.section}</td>
                                                <td>{model.subsection}</td>
                                                <td>
                                                    <button type="button" data-id={model.id} onClick={this.ver}>Ver</button>

                                                    <button type="button" data-id={model.id} onClick={this.eliminar}>Eliminar</button>

                                                    <button type="button" data-id={model.id} onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            this.abrirModalEditarModeloFormularios(model.id)
                                                        }
                                                    }>Editar</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>
                    }
                </div>
            </>
        )
    }
}
