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
            valueArray: [],
            valueSelect: 'text',
            valueSelectMP: 'P',
            valueSelectPerfilamiento: 'RESP',
            esRequerido: true,
            esCalibrable: false,
            formato: '',
            descripcion: '',
            loading: false,
            allForms: null
        };
    }

    handleChangecustomFieldsSync = (e) => {
        let { value, id } = e.target;
        let { valueArray } = this.state;
        for (let v of valueArray) {
            if (v.value === id && v.customFieldsSync !== undefined && value) {
                v.customFieldsSync = value;
            }
        }
        this.setState({ valueArray })
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

    // handleChangeArray = (event) => {
    //     this.setState({ valueArray: event.target.value });
    // }

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

    handleChangeCalibrable = (event) => {
        let { esCalibrable } = this.state;
        let condicional = esCalibrable ? false : true
        this.setState({ esCalibrable: condicional });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let error = false;
        let { id, esRequerido, value, valueArray, esCalibrable, valueSelect, valueSelectMP, valueSelectPerfilamiento, formato, descripcion } = this.state;

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

        console.log('valueArray: ', valueArray);

        let bodyParameters = {
            "name": value,
            "type": valueSelect,
            "values": valueArray,
            "required": esRequerido,
            "format": formato,
            "description": descripcion,
            "section": valueSelectMP,
            "subsection": valueSelectPerfilamiento,
            "calibrable": esCalibrable
        }


        // Hacer rekes
        this.setState({
            loading: true
        })
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        console.log(bodyParameters);
        debugger;

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

    componentDidMount() {
        let { idEditar } = this.props;


        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllForms, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            if (idEditar) {
                this.setState({
                    loading: true
                })

                const tokenUser = JSON.parse(sessionStorage.getItem("token"))
                const token = tokenUser
                const bearer = `Bearer ${token}`
                axios.get(Global.getAllForms + '/' + idEditar, { headers: { Authorization: bearer } }).then(response => {
                    sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

                    console.log('reques: ', response.data);

                    let respuesta = response.data.Data[0];
                    let valueArray = respuesta.values;

                    this.setState({
                        id: idEditar,
                        loading: false,
                        value: respuesta.name,
                        valueSelect: respuesta.type,
                        valueArray,
                        esRequerido: respuesta.required,
                        esCalibrable: respuesta.calibrable,
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


            this.setState({
                allForms: response.data.Data,
                loading: false
            })

        })
            .catch((e) => {
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

    viewValues = (e) => {
        const { value } = e.target;
        let { valueArray } = this.state;


        if (value) {
            valueArray = [];
            let values = value.split(',');
            for (let v of values) {
                if (v) {
                    let td = {}
                    if (v.indexOf('#') === 0) {
                        // Quiere decir que es una condicion
                        v = v.slice(1, v.length);
                        td = {
                            value: v,
                            customFieldsSync: null
                        }
                    } else {
                        td.value = v;
                    }
                    valueArray.push(td);
                }
            }

        }

        this.setState({ valueArray })

    }

    convertArrayValues = (ArrayValues) => {
        let Str = "";

        for (let a of ArrayValues) {
            let v = ""
            a.value = a.value.trim();
            if (a.customFieldsSync) {
                v = `#`;
            }
            v += a.value

            Str = Str ? Str + `, ${v}` : v;
        }

        return Str;
    }

    render() {
        let { valueSelect, valueSelectMP, allForms, valueArray } = this.state;


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

                        <label htmlFor="nombre" className="label">Nombre: *</label>
                        <input className="form-control" type="text" id="nombre" value={this.state.value} onChange={this.handleChange} required />

                        <label htmlFor="tipo" className="label">Tipo: *</label>
                        <select value={this.state.valueSelect} onChange={this.handleChangeSelect} id="tipo">
                            <option value="text">Texto</option>
                            <option value="area">Área de texto</option>
                            <option value="select">Lista desplegable</option>
                            <option value="radio">Selección única</option>
                            <option value="checkbox">Selección multiple</option>
                        </select>

                        {valueSelect && valueSelect !== 'text' && valueSelect !== 'area' &&
                            <>
                                <label htmlFor="input1" className="label">Valores (opciones separadas con coma): *</label>
                                <input className="form-control" type="text" defaultValue={this.convertArrayValues(valueArray)} id="input1" onBlur={this.viewValues} required />
                            </>
                        }

                        {valueSelect === 'text' &&
                            <>
                                <label htmlFor="input2" className="label">Formato</label>
                                <input className="form-control" type="text" id="input2" value={this.state.formato || ''} onChange={this.handleChangeFormato} />
                            </>
                        }
                        <div className="flexContent">
                            <input type="checkbox" name="esRequerido" checked={this.state.esRequerido} onChange={this.handleChangeRequired} id="checkbox" />
                            <label htmlFor="checkbox" className="label">* ¿Es requerido? </label>
                        </div>
                        <label htmlFor="descr" className="label">Descripcion: </label>
                        <input className="form-control" type="text" id="descr" placeholder="Descricpión" value={this.state.descripcion || ''} onChange={this.handleChangeDescripcion} />

                        <select value={this.state.valueSelectMP} onChange={this.handleChangeSelectMP}>
                            <option value="P">Perfilamiento</option>
                            <option value="M">Monitoreo</option>
                        </select>

                        {(valueArray && valueSelect !== 'text' && valueSelect !== 'area') && this.state.valueSelectMP === 'M' &&
                            <>

                                <div className="flexContent">
                                    <input type="checkbox" name="esCalibrable" checked={this.state.esCalibrable} onChange={this.handleChangeCalibrable} id="checkbox" />
                                    <label htmlFor="checkbox" className="label">* ¿Es calibrable? </label>
                                </div>
                                {valueArray.map((v, i) => {
                                    console.log('v: ', v)
                                    if (v.customFieldsSync !== undefined) {
                                        let defValue = '';
                                        if (v.customFieldsSync?.length > 0) {
                                            defValue = v.customFieldsSync[0].id
                                        }
                                        return (
                                            <div key={i}>
                                                <small>Condicional para {v.value}</small>
                                                <select id={v.value} value={defValue} onChange={this.handleChangecustomFieldsSync}>
                                                    <option value="">Selecciona...</option>
                                                    {allForms &&
                                                        allForms.map(form => {
                                                            if (form.section === 'M') {
                                                                return <option key={form.id} value={form.id}>{form.name}</option>
                                                            } else {
                                                                return true;
                                                            }
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        )
                                    }
                                })
                                }
                            </>
                        }

                        {valueSelectMP === 'P' &&
                            <select value={this.state.valueSelectPerfilamiento} onChange={this.handleChangeSelectPerfilamiento}>
                                <option value="RESP">Responsable</option>
                                <option value="GTE">Gerente</option>
                                <option value="COO">Coordinador on site</option>
                                <option value="ADM">Administrador</option>
                                <option value="COACH">Coach</option>
                            </select>
                        }

                        <input className="inputGuardar" type="submit" value="Guardar" />
                    </form>
                </div>
            </div>
        )
    }
}
