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
        modalModeloFormulario: false
    }

    abrirModalModeloFormularios = () => {
        this.setState({ modalModeloFormulario: true });
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
                models: response.data.Data
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

        console.log("Eliminamos", id)
    }

    editar = (e) => {
        const { id } = e.target.dataset;

        console.log("Editamos", id)
    }

    render() {
        let { loading, cantSecciones, allForms, models, modalModeloFormulario, redirect } = this.state;

        if(redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <>
                {modalModeloFormulario &&
                    <ModalModeloFormulariosComponent />
                }
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }


                <div className="header">
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>


                <div className="container">

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

                    {models &&
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
                                    models.map(model => {
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

                                                    <button type="button" data-id={model.id} onClick={this.editar}>Editar</button>
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
