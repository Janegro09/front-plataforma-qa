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
        let condicional = !esCalibrable;
        this.setState({ esCalibrable: condicional });
    }

    separateIds = (valueArray) => {
        let temp = [];
        valueArray.map(value => {
            if (value.value.includes("#")) {
                value.value = value.value.slice(1, value.value.length);
            }

            let objTemp = {
                value: value.value,
            }

            if (value.parametrizableValue !== undefined) {
                objTemp.parametrizableValue = value.parametrizableValue;
            }

            if (value.customFieldsSync !== undefined) {
                objTemp = { ...objTemp, customFieldsSync: value.customFieldsSync }
            }

            temp.push(objTemp);
            return true;
        })
        return temp;
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

        let bodyParameters = {
            "name": value,
            "type": valueSelect,
            "values": this.separateIds(valueArray),
            "required": esRequerido,
            "format": formato,
            "description": descripcion,
            "section": valueSelectMP,
            "subsection": valueSelectPerfilamiento,
            "calibrable": esCalibrable
        }

        // Hacer rekes
        this.setState({ loading: true });
        const tokenUser = JSON.parse(localStorage.getItem("token"));
        const token = tokenUser;
        const bearer = `Bearer ${token}`;
        if (!id) {
            axios.post(Global.getAllForms + "/new", bodyParameters, { headers: { Authorization: bearer } })
                .then(response => {
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
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
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
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
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
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
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
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

        this.setState({ loading: true });

        const tokenUser = JSON.parse(localStorage.getItem("token"));
        const token = tokenUser;
        const bearer = `Bearer ${token}`;
        axios.get(Global.getAllForms, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            if (idEditar) {
                this.setState({ loading: true })

                const tokenUser = JSON.parse(localStorage.getItem("token"));
                const token = tokenUser;
                const bearer = `Bearer ${token}`;
                axios.get(Global.getAllForms + '/' + idEditar, { headers: { Authorization: bearer } }).then(response => {
                    localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                    let respuesta = response.data.Data[0];
                    let valueArray = respuesta.values;
                    valueArray = valueArray.map(v => v.customFieldsSync && v.customFieldsSync !== null ? v : { ...v, customFieldsSync: undefined });
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
                    });
                })
                    .catch((e) => {
                        // Si hay algún error en el request lo deslogueamos
                        if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                            HELPER_FUNCTIONS.logout()
                        } else {
                            localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
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
            });
        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    quitarParentesis = (string) => {
        let stringSinParentesis = '';
        for (let i = 0; i < string.length; i++) {
            if (string[i] !== '(' && string[i] !== '1' && string[i] !== '0' && string[i] !== ')') {
                stringSinParentesis += string[i];
            }
        }
        return stringSinParentesis;
    }

    validarParametrizacion = (numero) => {
        if (numero !== "1" && numero !== "0") {
            swal('Error', 'Mal parametrizado, tiene que ser 1 o 0.', 'error');
            return;
        }
    }

    viewValues = (e) => {
        const { value } = e.target;
        let { valueArray } = this.state;

        console.log(value, valueArray)
        if (value) {
            valueArray = [];
            let values = value.split(',');
            for (let v of values) {
                if (v) {
                    let td = {
                        value: v
                    }
                    if (v.indexOf('#') !== -1) {
                        v = v.replace("#", '');
                        td = {
                            value: v,
                            customFieldsSync: null
                        }
                    }
                    if (v.indexOf('(') !== -1 && v.indexOf(')') !== -1 && v.indexOf('(') < v.indexOf(')')) {
                        let numero = v.match(/\d+/)[0];
                        this.validarParametrizacion(numero);
                        td = {
                            value: this.quitarParentesis(v),
                            parametrizableValue: parseInt(numero)
                        }

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
            a.value = a.value?.trim();
            if (a.customFieldsSync) {
                v = `#`;
            }
            v += a.value

            if (a.parametrizableValue !== false) {
                v += ` (${a.parametrizableValue})`;
            }

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
                        <h4>Agregar campo personalizado</h4>
                        <br />
                        <hr />
                        <br />
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
                        <br />
                        <label htmlFor="descr" className="label">Descripcion: </label>
                        <input className="form-control" type="text" id="descr" placeholder="Descricpión" value={this.state.descripcion || ''} onChange={this.handleChangeDescripcion} />
                        <br />
                        <select value={this.state.valueSelectMP} onChange={this.handleChangeSelectMP}>
                            <option value="P">Perfilamiento</option>
                            <option value="M">Monitoreo</option>
                        </select>

                        {(valueArray && valueSelect !== 'text' && valueSelect !== 'area') && this.state.valueSelectMP === 'M' &&
                            <>
                                <div className="flexContent">
                                    <input type="checkbox" name="esCalibrable" id="escalibrable" checked={this.state.esCalibrable} onChange={this.handleChangeCalibrable} />
                                    <label htmlFor="escalibrable" className="label" >* ¿Es calibrable? </label>
                                </div>
                                {valueArray.map((v, i) => {
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

                                    return true;
                                })
                                }
                            </>
                        }

                        {valueSelectMP === 'P' &&
                            <select value={this.state.valueSelectPerfilamiento} onChange={this.handleChangeSelectPerfilamiento}>
                                <option value="RESP">Responsable</option>
                                <option value="GTE">Gerente</option>
                                <option value="COO">On site</option>
                                <option value="ADM">Administrador</option>
                                <option value="COACH">Coach</option>
                            </select>
                        }

                        <input className="btnSecundario" type="submit" value="Guardar" />
                    </form>

                </div>
            </div>
        )
    }
}
