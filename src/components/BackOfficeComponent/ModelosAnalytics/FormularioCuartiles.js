import React, { Component } from 'react'
import './Formulario.css'
import swal from 'sweetalert';
import axios from 'axios';
import Global from '../../../Global';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

export default class Formulario extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id: null,
            name: 'Nombre de la plantilla',
            instances: []
        }
    }

    enviarPlantilla = () => {
        // Preparamos el objeto para enviar!
        const { name, instances, id } = this.state;

        if (!name || name === 'Nombre de la plantilla' || instances.length === 0) {
            swal("Error!", "Debe ingresar valores para enviarlos", "error");
            return false;
        }

        let sendData = {
            name,
            values: []
        }

        sendData.values = JSON.stringify(instances);
        

        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = sendData
        if (id) {
            // entonces editamos
            console.log(bodyParameters)
            axios.put(Global.newModel + "/" + id, bodyParameters, config)
                .then(response => {
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    if (response.data.Success) {
                        swal("Felicidades!", "Se ha modificado la plantilla de partitura correctamente", "success");
                        window.location.reload(window.location.href);
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
            axios.post(Global.newModel, bodyParameters, config)
                .then(response => {
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    if (response.data.Success) {
                        swal("Felicidades!", "Se ha creado la plantilla de partitura correctamente", "success");
                        window.location.reload(window.location.href);
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

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    nuevaInstancia = () => {
        let { instances } = this.state;
        let temp = {
            QName: "Nuevo " + instances.length,
            QOrder: "DESC",
            Q1: {
                VMin: 0,
                VMax: 0 
            },
            Q2: {
                Vmax: 0
            },
            Q3: {
                Vmax: 0
            },
            Q4: {
                Vmax: 0
            }
        }
        instances.push(temp);
        this.setState({instances});
    }

    eliminarInstancia = (name) => {        
        let { instances } = this.state;
        instances = instances.filter(elem => elem.QName !== name);
        this.setState({instances});
    }

    changeValues = e => {
        const  { dataset, value, name } = e.target;
        const { id } = dataset;
        let { instances } = this.state;

        let index = instances.findIndex(elem => elem.QName === id);
        if(value !== undefined && index !== -1) {
            switch(name) {
                case "VMin": 
                    instances[index].Q1.VMax = value
                break;
                case "VMax": 
                    instances[index].Q3.VMax = value;
                break;
                default:
                    instances[index][name] = value
            }
            this.setState({ instances });
        } else return false;

    }

    componentDidMount = () => {
        const { idModificate } = this.props
        if (idModificate) {

            let token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            axios.get(Global.newModel + "/" + idModificate, config)
                .then(response => {
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    const respuesta = response.data.Data[0];
                    if (respuesta) {
                        this.setState({
                            id: idModificate,
                            name: respuesta.name,
                            instances: JSON.parse(respuesta.values)
                        })
                    }
                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token));
                        this.setState({
                            redirect: true
                        })
                    }
                    console.log("Error: ", e)
                })
        }
    }

    render() {
        let { instances } = this.state;

        return (
            <div className="modal" id="modal-casero">
                <div className="hijo">
                    <div className="btnCloseModalTres">
                        <button
                            onClick={
                                (e) => {
                                    e.preventDefault()
                                    this.cerrarModal()
                                }
                            }>x</button>
                    </div>
                    <div className="partituresModels">
                        <div className="mainButtons">
                            <input className="form-control" type="text" value={this.state.name} onChange={(e) => {
                                this.setState({ name: e.target.value })
                            }} />

                            <button className="morph" onClick={(e) => {
                                e.preventDefault();
                                this.nuevaInstancia()
                            }}><AddIcon className="svgAddButton" style={{ fontSize: 33 }} /></button>




                            <button className="addItem morph" onClick={(e) => {
                                e.preventDefault()
                                this.enviarPlantilla();
                            }}><SaveIcon className="svgAddButton" style={{ fontSize: 33 }} /></button>

                        </div>

                        {instances &&
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Orden</th>
                                        <th>Objetivo VMin</th>
                                        <th>Objetivo VMax</th>
                                        <th className="tableIcons">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instances.map(columna => {
                                            return (
                                                <tr key={columna.QName}>
                                                    <td>
                                                        <input className="form-control"
                                                            data-id={columna.QName}
                                                            name="QName"
                                                            type="text"
                                                            placeholder="QName"
                                                            onChange={this.changeValues}
                                                            value={columna.QName}
                                                        />
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="selectOrden"
                                                            data-id={columna.QName}
                                                            onChange={this.changeValues}
                                                            name="Qorder"
                                                            value={columna.Qorder}
                                                            >
                                                            <option value="DESC">DESC</option>
                                                            <option value="ASC">ASC</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input className="form-control"
                                                            data-id={columna.QName}
                                                            name="VMin"
                                                            type="text"
                                                            placeholder="VMin"
                                                            onChange={this.changeValues}
                                                            value={columna.Q1.VMax}
                                                        />
                                                    </td>

                                                    <td>
                                                        <input className="form-control"
                                                            data-id={columna.QName}
                                                            name="VMax"
                                                            type="text"
                                                            placeholder="VMax"
                                                            onChange={this.changeValues}
                                                            value={columna.Q3.VMax}
                                                        />
                                                    </td>
                                                    <td className="tableIcons"> <button onClick={(e) => {
                                                        e.preventDefault();
                                                        this.eliminarInstancia(columna.QName);
                                                    }} className="celdaBtnHover"> <DeleteIcon style={{ fontSize: 15 }} /> </button> </td>
                                                </tr>
                                            )
                                    })}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
