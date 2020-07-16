import React, { Component } from 'react'
import './Modal.css'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../../../Global';

export default class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            value: '',
            valueArray: '',
            valueSelect: 'text',
            valueSelectMP: 'P',
            valueSelectPerfilamiento: 'RESP',
            esRequerido: true,
            formato: '',
            descripcion: '',
            loading: false
        };
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }

    handleChangeFormato = (event) => {
        this.setState({ formato: event.target.value });
    }

    handleChangeDescripcion = (event) => {
        this.setState({ descripcion: event.target.value });
    }

    handleChangeArray = (event) => {
        this.setState({ valueArray: event.target.value });
    }

    handleChangeSelect = (event) => {
        this.setState({ valueSelect: event.target.value });
    }

    handleChangeSelectMP = (event) => {
        this.setState({ valueSelectMP: event.target.value });
    }

    handleChangeSelectPerfilamiento = (event) => {
        this.setState({ valueSelectPerfilamiento: event.target.value });
    }

    handleChangeRequired = (event) => {
        let { esRequerido } = this.state;
        let condicional = esRequerido ? false : true
        this.setState({ esRequerido: condicional });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let error = false;
        let { id, esRequerido, value, valueArray, valueSelect, valueSelectMP, valueSelectPerfilamiento, formato, descripcion } = this.state;

        // Validaciones
        if (!value) {
            error = true;
        }

        if (valueSelect === 'radio' || valueSelect === 'checkbox' || valueSelect === 'select') {
            if (!valueArray) {
                error = true;
            }
        }

        if (error) {
            swal("Error", "Hubo un problema con los parámetros ingresados", "error");
            return false;
        }

        let bodyParameters = {
            "name": value,
            "type": valueSelect,
            "values": [],
            "required": esRequerido,
            "format": formato,
            "description": descripcion,
            "section": valueSelectMP,
            "subsection": valueSelectPerfilamiento
        }

        if (valueArray) {
            let temp = valueArray.split(',');

            for (let item of temp) {
                item = item.trim();
                bodyParameters.values.push(item)
            }
        }

        // Hacer rekes
        this.setState({
            loading: true
        })
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        if (!id) {
            axios.post(Global.getAllForms + "/new", bodyParameters, { headers: { Authorization: bearer } })
                .then(response => {
                    sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    if (response.data.Success) {
                        swal("Felicidades!", "Se ha creado un campo personalizado correctamente", "success").then(() => {
                            window.location.reload(window.location.href);
                        });
                    }

                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        swal("Atención", "No se ha agregado el grupo", "info");
                        this.setState({
                            redirect: true
                        })
                    }
                    console.log("Error: ", e)
                })
        } else {
            axios.put(Global.getAllForms + '/' + id, bodyParameters, { headers: { Authorization: bearer } })
                .then(response => {
                    sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    if (response.data.Success) {
                        swal("Felicidades!", "Se ha editado un campo personalizado correctamente", "success").then(() => {
                            window.location.reload(window.location.href);
                        });
                    }

                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        swal("Atención", "No se ha agregado el grupo", "info");
                        this.setState({
                            redirect: true
                        })
                    }
                    console.log("Error: ", e)
                })
        }
    }

    componentDidUpdate() {
        console.log("El estado: ", this.state)
    }

    componentDidMount() {
        let { idEditar } = this.props;

        if (idEditar) {
            // Hacer rekes a get specifi
            this.setState({
                loading: true
            })

            const tokenUser = JSON.parse(sessionStorage.getItem("token"))
            const token = tokenUser
            const bearer = `Bearer ${token}`
            axios.get(Global.getAllForms + '/' + idEditar, { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                let respuesta = response.data.Data[0];

                let valueArray = '';

                for (let i of respuesta.values) {
                    if (!valueArray) {
                        valueArray = i;
                    } else {
                        valueArray += `, ${i}`;
                    }
                }

                this.setState({
                    id: idEditar,
                    loading: false,
                    value: respuesta.name,
                    valueSelect: respuesta.type,
                    valueArray,
                    esRequerido: respuesta.required,
                    formato: respuesta.format,
                    descripcion: respuesta.description,
                    valueSelectMP: respuesta.section,
                    valueSelectPerfilamiento: respuesta.subsection
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
    }

    render() {
        let { valueSelect, valueSelectMP } = this.state;
        return (
            <div className="modal" id="modal-casero">
                <div className="hijo">
                    <div className="boton-cerrar">
                        <button onClick={
                            (e) => {
                                e.preventDefault()
                                this.cerrarModal()
                            }
                        }>x</button>
                    </div>

                    <form onSubmit={this.handleSubmit} className="formulario">

                        <label htmlFor="nombre" className="label">*nombre: </label>
                        <input type="text" id="nombre" value={this.state.value} onChange={this.handleChange} required />

                        <select value={this.state.valueSelect} onChange={this.handleChangeSelect}>
                            <option value="text">Texto</option>
                            <option value="area">Área de texto</option>
                            <option value="select">Lista desplegable</option>
                            <option value="radio">Selección única</option>
                            <option value="checkbox">Selección multiple</option>
                        </select>

                        {valueSelect && valueSelect !== 'text' && valueSelect !== 'area' &&
                            <>
                                <label htmlFor="input1" className="label">*Opciones separadas por coma</label>
                                <input type="text" id="input1" value={this.state.valueArray} onChange={this.handleChangeArray} required />
                            </>
                        }

                        {valueSelect === 'text' &&
                            <>
                                <label htmlFor="input2" className="label">Formato</label>
                                <input type="text" id="input2" value={this.state.formato} onChange={this.handleChangeFormato} />
                            </>
                        }

                        <label htmlFor="checkbox" className="label">*Es requerido</label>
                        <input type="checkbox" name="esRequerido" checked={this.state.esRequerido} onChange={this.handleChangeRequired} id="checkbox" />

                        <input type="text" placeholder="Descricpión" value={this.state.descripcion} onChange={this.handleChangeDescripcion} />

                        <select value={this.state.valueSelectMP} onChange={this.handleChangeSelectMP}>
                            <option value="P">Perfilamiento</option>
                            <option value="M">Monitoreo</option>
                        </select>

                        {valueSelectMP === 'P' &&
                            <select value={this.state.valueSelectPerfilamiento} onChange={this.handleChangeSelectPerfilamiento}>
                                <option value="RESP">Responsable</option>
                                <option value="GTE">Gerente</option>
                                <option value="COO">Coordinador on site</option>
                                <option value="ADM">Administrador</option>
                                <option value="COACH">Coach</option>
                            </select>
                        }

                        <input type="submit" value="Guardar" />
                    </form>
                </div>
            </div>
        )
    }
}
