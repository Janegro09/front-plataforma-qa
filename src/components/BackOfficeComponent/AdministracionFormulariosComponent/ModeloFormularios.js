import React, { Component } from 'react';
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader';
import Global from '../../../Global';
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import swal from 'sweetalert';
import './Modal.css';

export default class ModeloFormularios extends Component {

    state = {
        allForms: null,
        loading: false,
        cantSecciones: []
    }

    agregar = (event) => {
        event.preventDefault();
        let { cantSecciones } = this.state;

        if (cantSecciones.length === 0) {
            cantSecciones.push({
                cant: 1,
                name: `Modelo de formulario ${1}`,
                customFields: [{ question: `Nombre de la pregunta ${1}`, customField: "id78412874dadnkasj", cantQuestions: 0 }]
            })
        } else {
            cantSecciones.push({
                cant: cantSecciones.length + 1,
                name: `Modelo de formulario ${cantSecciones.length + 1}`,
                customFields: [{ question: `Ingrese pregunta`, customField: "id78412874dadnkasj", cantQuestions: 0 }]
            })
        }

        console.log(cantSecciones)

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
        let idSeccion = seccion.cant;

        // MODIFICO EL QUE QUIERO EDITAR
        let edited = cantSecciones.filter(seccion => seccion.cant === idSeccion);
        // edited[0].customFields[0].cantQuestions = edited[0].customFields[0].cantQuestions + 1;

        // LO BUSCO Y LO PISO EN EL ARRAY
        let temp = []
        cantSecciones.map(seccion => {
            if (seccion.cant === edited[0].cant) {
                console.log('agrega: ', edited[0].customFields)
                edited[0].customFields.push({
                    question: "nombre de la pregunta", customField: Date.now()
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
        section.customFields.map(p => {
            if (p.customField === q.customField) {
                console.log(q);
            }
            return true;
        })

    }

    sendForm = (event) => {
        event.preventDefault();
        console.log('enviamos');
    }

    componentDidMount() {
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
        let { loading, cantSecciones, allForms } = this.state;

        return (
            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="header">
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                <div className="container">
                    <h4>Modelo de formularios</h4>

                    <form onSubmit={this.sendForm}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción</label>
                            <input
                                type="text"
                                className="form-control"
                                id="descripcion"
                                autoComplete="off"
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={this.agregar}
                        >
                            +
                        </button>

                        {cantSecciones.length > 0 &&
                            cantSecciones.map(seccion => {
                                return (
                                    <div key={seccion.cant} className="modelo-field">
                                        <div>
                                            <input type="text" defaultValue={seccion.name} />

                                            <button
                                                className="btn btn-primary"
                                                onClick={(e) => { e.preventDefault(); this.agregarField(seccion); }}
                                            >
                                                agregar
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={(e) => { e.preventDefault(); this.eliminar(seccion); }}
                                            >
                                                eliminar
                                            </button>
                                        </div>


                                        {seccion.customFields.length > 0 &&
                                            seccion.customFields.map(field => {
                                                return (
                                                    <div key={field.customField}>
                                                        <input type="text" placeholder="pregunta" />
                                                        <select>
                                                            <option>Preguntas...</option>
                                                            {allForms.length > 0 &&
                                                                allForms.map(form => {
                                                                    return (
                                                                        <option key={form.id}>{form.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>

                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={(e) => {e.preventDefault(); this.deleteQuestion(field, seccion)}}
                                                        >
                                                            Eliminar pregunta
                                                        </button>
                                                    </div>

                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }

                        <button type="submit" className="btn btn-primary">Enviar</button>
                    </form>
                </div>
            </>
        )
    }
}
