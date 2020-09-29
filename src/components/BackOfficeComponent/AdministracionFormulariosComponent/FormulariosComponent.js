import React, { Component } from 'react';
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader';
import Global from '../../../Global';
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import swal from 'sweetalert';
import './Modal.css';
import moment from 'moment';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import ModalNuevoForm from './ModalNuevoForm';
import ModalEditarModelo from './ModalEditarForm';
import { Redirect } from 'react-router-dom';

export default class Formularios extends Component {

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
        models: null
    }

    agregar = (event) => {
        event.preventDefault();
        let { cantSecciones } = this.state;

        if (cantSecciones.length === 0) {
            cantSecciones.push({
                id: HELPER_FUNCTIONS.generateCustomId(10),
                name: `Modelo de formulario ${1}`,
                customFields: [{ question: "", customField: "", id: HELPER_FUNCTIONS.generateCustomId(10) }]
            })
        } else {
            cantSecciones.push({
                id: HELPER_FUNCTIONS.generateCustomId(10),
                name: `Modelo de formulario ${cantSecciones.length + 1}`,
                customFields: [{ question: "", customField: "", id: HELPER_FUNCTIONS.generateCustomId(10) }]
            })
        }

        this.setState({ cantSecciones });
    }

    eliminar = (seccion) => {
        let { cantSecciones } = this.state;
        let idDelete = seccion.cant;

        cantSecciones = cantSecciones.filter(seccion => seccion.cant !== idDelete);
        this.setState({ cantSecciones });
    }

    agregarField = (seccion) => {
        let { cantSecciones } = this.state;
        let idSeccion = seccion.id;

        // MODIFICO EL QUE QUIERO EDITAR
        let edited = cantSecciones.filter(seccion => seccion.id === idSeccion);

        // LO BUSCO Y LO PISO EN EL ARRAY
        let temp = []
        cantSecciones.map(seccion => {
            if (seccion.id === edited[0].id) {
                edited[0].customFields.push({
                    question: "", customField: "", id: HELPER_FUNCTIONS.generateCustomId(10)
                })
                temp.push(edited[0]);
            } else {
                temp.push(seccion);
            }
            return true;
        })

        this.setState({ cantSecciones: temp });

    }

    deleteQuestion = (q, section) => {
        let { cantSecciones } = this.state;
        let temp = [];

        for (let i = 0; i < cantSecciones.length; i++) {
            for (let j = 0; j < cantSecciones[i].customFields.length; j++) {
                if (cantSecciones[i].customFields[j].id !== q.id) {
                    temp.push(cantSecciones[i].customFields[j]);
                }

            }

            cantSecciones[i].customFields = temp;

        }


        this.setState({ cantSecciones });
    }

    sendForm = (event) => {
        event.preventDefault();
        let { dataToSend, cantSecciones } = this.state;

        dataToSend.parts = cantSecciones;

        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.post(Global.getForms, dataToSend, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                if (response.data.Success) {
                    swal("Felicidades!", "Se ha creado el modelo correctamente", "success");
                }

            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No se ha agregado el grupo", "info");
                }
                console.log("Error: ", e)
            })
    }

    handleChange = (e) => {
        let { id, value } = e.target;
        let { dataToSend } = this.state;

        if (value !== '') {
            dataToSend[id] = value;
        }

        this.setState({ dataToSend });
    }

    abrirModalModeloFormularios = () => {
        this.setState({ modalModeloFormulario: true });
    }

    ver = (e) => {
        const { id } = e.target.dataset;

        let redirect = `/administracion-formularios/formularios/${id}`;

        this.setState({ redirect })

    }

    eliminar = (e) => {
        const { id } = e.target.dataset;

        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar un formulario, no podrás recuperarlo",
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
                    axios.delete(Global.getForms + "/" + id, config)
                        .then(response => {
                            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                            if (response.data.Success) {
                                swal("Felicidades!", "Formulario eliminado correctamente", "success").then(() => {
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

    handleChangeQuestion = (e) => {
        let { value, name, parentNode } = e.target;
        let { cantSecciones } = this.state
        const idField = parentNode.id;
        const idFather = parentNode.dataset.parent;
        let sectionSearched = -1;
        if (idField && name === 'nameQuestion') {
            sectionSearched = cantSecciones.findIndex(element => element.id === idField);
        } else if (name !== 'nameQuestion') {
            sectionSearched = cantSecciones.findIndex(element => element.id === idFather);

        }

        if (idFather && sectionSearched !== -1) {
            // Estamos modificando los parametros de una pregunta
            let findField = cantSecciones[sectionSearched]?.customFields?.findIndex(element => element.id === idField);
            if (findField !== -1) {
                cantSecciones[sectionSearched].customFields[findField][name] = value;
            }

            // cantSecciones[sectionSearched][name] = value;
        } else if (sectionSearched !== -1 && name === 'nameQuestion') {
            cantSecciones[sectionSearched].name = value;
            // Estamos modificando los parametros de una seccion
        }

        this.setState({ cantSecciones })

    }

    abrirModalEditarModeloFormularios = (id) => {
        this.setState({ ModalEditarModeloFormularios: true, idToEdit: id });
    }

    buscarFormulario = (e) => {
        let { modelsFiltrado, models } = this.state;
        let buscado = e.target.value.toLowerCase();

        if (buscado) {
            modelsFiltrado = modelsFiltrado.filter(model => model.name.toLowerCase().includes(buscado));
            this.setState({ modelsFiltrado });
        } else {
            this.setState({ modelsFiltrado: models });
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        })

        let tokenUser = JSON.parse(sessionStorage.getItem("token"));
        let token = tokenUser;
        let bearer = `Bearer ${token}`;

        axios.get(Global.getAllForms, { headers: { Authorization: bearer } }).then(response => {

            token = response.data.loggedUser.token;
            bearer = `Bearer ${token}`;

            // ACÁ VAN A QUEDAR LAS DE M
            let allForms = response.data.Data.filter(form => form.section === 'M');

            axios.get(Global.getForms, { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                this.setState({ allForms ,models: response.data.Data, modelsFiltrado: response.data.Data, loading: false })
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
        let { loading, modelsFiltrado, modalModeloFormulario, ModalEditarModeloFormularios, idToEdit, redirect } = this.state;

        if (redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <>
                {modalModeloFormulario &&
                    <ModalNuevoForm />
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

                    <h4>Formularios</h4>
                    <hr />
                    <br />
                    <div className="flex-input-add">
                        <input
                            type="text"
                            placeholder="Buscar"
                            onChange={this.buscarFormulario}
                            className="form-control"
                        />

                        <button
                            className="addItem morph"
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    this.abrirModalModeloFormularios()
                                }
                            }
                        >
                            <AddIcon className="svgAddButton" style={{ fontSize: 33 }} />
                        </button>
                    </div>


                    {modelsFiltrado &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Creado</th>
                                    <th>Descripción</th>
                                    <th>Partes</th>
                                    <th>Programa</th>
                                    <th className="tableIconsFormularios">Acciones</th>
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
                                                <td>{model.program[0].name}</td>
                                                <td className="tableIconstableIconsFormularios">
                                                    <button type="button" data-id={model.id} onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            this.abrirModalEditarModeloFormularios(model.id)
                                                        }
                                                    }>
                                                        {/* <EditIcon style={{ fontSize: 15 }} /> */}
                                                        Editar
                                                    </button>
                                                    <button type="button" data-id={model.id} onClick={this.ver}>
                                                        {/* <VisibilityRoundedIcon style={{ fontSize: 15 }} /> */}
                                                        Ver
                                                        </button>

                                                    <button type="button" data-id={model.id} onClick={this.eliminar}>
                                                        {/* <DeleteIcon style={{ fontSize: 15 }} /> */}
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
            </>
        )
    }
}
