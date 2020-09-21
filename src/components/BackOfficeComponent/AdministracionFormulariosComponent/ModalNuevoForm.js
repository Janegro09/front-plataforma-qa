import React, { Component } from 'react'
import './ModalModeloFormularios.css'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../../../Global';
import DeleteIcon from '@material-ui/icons/Delete';


export default class ModalNuevoForm extends Component {

    state = {
        allForms: null,
        loading: false,
        cantSecciones: [],
        dataToSend: {
            name: "",
            description: "",
            parts: [],
            programId: ""
        },
        models: null,
        modalModeloFormulario: false,
        allPrograms: null,
        selectedProgram: null,
        allModels: null
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
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
                    swal("Felicidades!", "Se ha creado el modelo correctamente", "success").then(() => {
                        window.location.reload(window.location.href);
                    })
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

        dataToSend[id] = value;

        this.setState({ dataToSend });
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

    handleChangeQuestion = (e) => {
        let { value, name, parentNode } = e.target;
        // console.log('e', value, name, parentNode );

        let { cantSecciones } = this.state;

        const idField = parentNode.id;
        const idFather = parentNode.dataset.parent;
        let sectionSearched = -1;
        if (idField && name === 'nameQuestion') {
            sectionSearched = cantSecciones.findIndex(element => element.id === idField);
        } else if (name !== 'nameQuestion') {
            sectionSearched = cantSecciones.findIndex(element => element.id === idFather);

        }

        console.log(sectionSearched, name)

        if (idFather && sectionSearched !== -1) {
            // Estamos modificando los parametros de una pregunta
            let findField = cantSecciones[sectionSearched]?.customFields?.findIndex(element => element.id === idField);
            if (findField !== -1) {
                cantSecciones[sectionSearched].customFields[findField][name] = value;
            }

        } else if (sectionSearched !== -1 && name === 'nameQuestion') {
            console.log('nombre dek poadre', value)
            cantSecciones[sectionSearched].name = value;
        }

        console.log(cantSecciones)
        this.setState({ cantSecciones })

    }

    eliminar = (seccion) => {
        let { cantSecciones } = this.state;
        let idDelete = seccion.id;

        cantSecciones = cantSecciones.filter(seccion => seccion.id !== idDelete);
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


    deleteQuestion = (field, section) => {
        let { cantSecciones } = this.state;
        let temp = [];

        for (let s of cantSecciones) {
            let td = {
                ...s
            }

            if (s.id === section) {
                td.customFields = [];
                for (let cf of s.customFields) {
                    if (cf.id === field) continue;

                    td.customFields.push(cf);
                }
            }

            temp.push(td);
        }

        cantSecciones = temp;

        this.setState({ cantSecciones });
    }

    cerrarModal = () => {
        document.getElementById("modal-casero2").style.display = "none";
        window.location.reload(window.location.href);
    }

    changeModel = (e) => {
        e.preventDefault();
        console.log('data: ', e.target.value);
        let { dataToSend } = this.state;

        let id = e.target.value;

        if (id) {
            let tokenUser = JSON.parse(sessionStorage.getItem("token"));
            let token = tokenUser;
            let bearer = `Bearer ${token}`;

            axios.get(Global.newFormModel + '/' + id, { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                if (response.data.Data.length > 0 && response.data.Data[0].parts) {
                    dataToSend.parts = response.data.Data[0].parts;
                    this.setState({
                        dataToSend
                    })

                    this.partsTocantSecciones();
                }

            })
        }
    }

    partsTocantSecciones = () => {
        let { cantSecciones, dataToSend } = this.state;
        const { parts } = dataToSend;

        cantSecciones = [];

        for (let p of parts) {
            let customFields = []

            for (let cf of p.customFields) {

                let td = {
                    id: cf.questionId,
                    question: cf.question,
                    customField: cf.id
                }

                customFields.push(td)

            }

            p.customFields = customFields;

            cantSecciones.push(p);
        }

        this.setState({ cantSecciones });
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

            this.setState({
                allForms,
                loading: false
            })

            axios.get(Global.newFormModel, { headers: { Authorization: bearer } }).then(response => {
                this.setState({ models: response.data.Data });
                token = response.data.loggedUser.token;
                bearer = `Bearer ${token}`;

                this.setState({
                    allForms
                })

                // newFormModel
                axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
                    let allProgramsM = response.data.Data.filter(program => program.section === 'M');

                    this.setState({
                        allPrograms: allProgramsM
                    });

                    token = response.data.loggedUser.token;
                    bearer = `Bearer ${token}`;

                    axios.get(Global.newFormModel, { headers: { Authorization: bearer } }).then(response => {
                        sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                        this.setState({
                            allModels: response.data.Data,
                            loading: false
                        })

                    })

                })


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

        let { cantSecciones, allForms, dataToSend, allPrograms, allModels } = this.state;

        return (
            <div className="modal modal-formularios" id="modal-casero2" >
                <div className="hijo">
                    <div className="btnCloseModalDos">
                        <button onClick={
                            (e) => {
                                e.preventDefault()
                                this.cerrarModal()
                            }
                        }>x</button>
                    </div>

                    {/* LO NUEVO VA AQUI */}
                    <h4>Crear nuevo formulario</h4>

                    <form onSubmit={this.sendForm}>
                        {allModels &&
                            <>
                                <div className="form-group">
                                    <label htmlFor="name">Modelos de formularios</label>
                                    <select onChange={this.changeModel} >
                                        <option value="">Selecciona...</option>
                                        {allModels.map(model => {
                                            return (
                                                <option key={model.id} value={model.id}>{model.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </>
                        }
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                autoComplete="off"
                                onChange={this.handleChange}
                                value={dataToSend.name}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                autoComplete="off"
                                onChange={this.handleChange}
                                value={dataToSend.description}
                            />
                        </div>

                        {allPrograms &&
                            <>
                                <div className="form-group">
                                    <label htmlFor="name">Programa</label>
                                    <select onChange={this.handleChange} value={dataToSend.programId} id='programId' >
                                        <option value="">Selecciona...</option>
                                        {allPrograms.map(program => {
                                            return (
                                                <option key={program.id} value={program.id}>{program.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </>
                        }

                        <button
                            className="btnDefaultBorder ver-mas"
                            onClick={this.agregar}
                        >
                            + AGREGAR SECCIÓN
                        </button>

                        {cantSecciones.length > 0 &&
                            cantSecciones.map((seccion, i) => {
                                return (
                                    <div key={i} className="modelo-field">
                                        <div >
                                            <div className="flexAlign" id={seccion.id}>
                                                <input
                                                    className="form-control margin-top-10 marginBotton15"
                                                    name="nameQuestion"
                                                    type="text"
                                                    value={seccion.name}
                                                    onChange={this.handleChangeQuestion}
                                                />
                                                <button
                                                    className="btnDefault"
                                                    onClick={(e) => { e.preventDefault(); this.eliminar(seccion); }}
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </div>
                                            <button
                                                className="pregButton btnDefaultBorderLight marginBotton15"
                                                onClick={(e) => { e.preventDefault(); this.agregarField(seccion); }}
                                            >
                                                + AGREGAR PREGUNTA
                                            </button>

                                        </div>


                                        {seccion.customFields.length > 0 &&
                                            seccion.customFields.map(field => {
                                                return (
                                                    <div key={field.id} >
                                                        <div className="flexAlign " id={field.id} data-parent={seccion.id}>
                                                            <input
                                                                className="form-control marginBotton15"
                                                                name="question"
                                                                type="text"
                                                                placeholder="pregunta"
                                                                onChange={this.handleChangeQuestion}
                                                                value={field.question}
                                                            />
                                                            <select
                                                                name="customField"
                                                                onChange={this.handleChangeQuestion}
                                                                value={field.customField}
                                                            >
                                                                <option>Preguntas...</option>
                                                                {allForms?.length > 0 &&
                                                                    allForms.map(form => {
                                                                        return (
                                                                            <option value={form.id} key={form.id}>{form.name}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>

                                                            <button className="btnDefaultLight"

                                                                onClick={(e) => { e.preventDefault(); this.deleteQuestion(field.id, seccion.id) }}
                                                            >
                                                                QUITAR
                                                            </button>
                                                        </div>
                                                    </div>

                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }

                        <button type="submit" className="btn btn-primary btnEnviarCond morph margin-top-10">Enviar</button>
                    </form>
                </div>
            </div>
        )
    }
}
