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
        })

        this.setState({ cantSecciones: temp });

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
        let { loading, cantSecciones } = this.state;

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

                    <form>
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
                                console.log('seccion: ', seccion.customFields[0].cantQuestions);
                                return (
                                    <div key={seccion.cant} className="modelo-field">
                                        <input type="text" defaultValue={seccion.name} />


                                        {seccion.customFields.length > 0 &&
                                            seccion.customFields.map(field => {
                                                return <input type="text" placeholder="pregunta" key={field.customField} />;
                                            })
                                        }

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
