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
        models: null,
        modalModeloFormulario: false
    }

    abrirModalModeloFormularios = () => {
        this.setState({ modalModeloFormulario: true });
    }


    render() {
        let { loading, cantSecciones, allForms, models, modalModeloFormulario } = this.state;

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
