import React, { Component } from 'react'
import SideBarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios';
import Global from '../../Global';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import { Redirect } from 'react-router-dom';

export default class PerfilamientoCuartilesComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombreColumnas: null,
            result: [],
            dataFiltered: null,
            redirect: false
        }
    }

    buscar = () => {
        const { nombreColumnas } = this.state
        let searched = this.searched.value.toLowerCase()
        const result = nombreColumnas.filter(word => word.columnName.toLowerCase().includes(searched));

        this.setState({
            dataFiltered: result
        })
    }

    seleccionarFila = (fila, orden, obj = {}) => {
        let { result } = this.state;

        let temp = {
            "QName": fila.columnName,
            "Qorder": orden,
            "Q1": {
                "VMin": fila.VMin
            },
            "Q4": {
                "VMax": fila.VMax
            }
        }

        if (obj.VMax && obj.VMin) {
            if (obj.VMax < fila.VMax && obj.VMax > obj.VMin) {
                temp.Q3 = {
                    VMax: obj.VMax
                };
            }

            if (obj.VMin > fila.VMin && obj.VMin < obj.VMax && temp.Q3) {
                temp.Q1.VMax = obj.VMin;
            }
        }

        let indice = -1
        for (let i = 0; i < result.length; i++) {
            if (result[i].QName === fila.columnName) {
                indice = i;
                break;
            }
        }

        if (indice === -1) {
            this.setState({
                result: [...result, temp]
            })
        } else {
            result.splice(indice, 1);
            this.setState({
                result
            })
        }

    }

    setOrden = () => {
        console.log("Orden: ", this.orden.value);

    }

    handleInputChange = (event) => {
        const target = event.target;
        console.log("target: ", target)
        this.setState({
            [target]: target
        });
    }

    componentDidMount() {
        const { cuartilSeleccionado } = this.props.location;
        console.log(cuartilSeleccionado);
        if (cuartilSeleccionado === undefined) {
            this.setState({
                redirect: true
            })
            return;
        }
        let id = cuartilSeleccionado.id;

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        axios.get(Global.reasignProgram + '/' + id + '/columns', { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            const { Data } = response.data;
            this.setState({ nombreColumnas: Data, dataFiltered: Data });
        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }


    render() {

        const { nombreColumnas, dataFiltered, redirect, result } = this.state;

        console.log("res: ", result)

        if (redirect) {
            return <Redirect to="/perfilamiento" />
        }


        return (
            <div>
                <SideBarLeft />

                <div className="section-content">
                    <button>Dale</button>
                    <input type="text" placeholder="Buscar" ref={(c) => this.searched = c} onChange={this.buscar} />
                    {nombreColumnas &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Rango [MIN-MAX]</th>
                                    <th>Orden</th>
                                    <th>Objetivo VMin</th>
                                    <th>Objetivo VMax</th>
                                    <th>Seleccionar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataFiltered.map((columna, key) => {
                                    let orden = 'DESC';
                                    let obj = {

                                    }

                                    if (columna.VMax !== 0) {
                                        return (
                                            <tr key={key}>
                                                <td>{columna.columnName}</td>
                                                <td>{`[${columna.VMin} - ${columna.VMax}]`}</td>
                                                <td>
                                                    <select id={key} onChange={
                                                        (e) => {
                                                            e.preventDefault();
                                                            let element = document.getElementById(key);
                                                            orden = element.value;
                                                        }
                                                    }
                                                    >
                                                        <option value="DESC">DESC</option>
                                                        <option value="ASC">ASC</option>
                                                    </select>
                                                </td>
                                                <td> <input id={"VMin" + key} type="text" placeholder="VMin" onChange={() => {
                                                    let element = document.getElementById("VMin" + key);
                                                    obj.VMin = parseFloat(element.value)
                                                }} /> </td>
                                                <td><input id={"VMax" + key} type="text" placeholder="VMax" onChange={() => {
                                                    let element = document.getElementById("VMax" + key);
                                                    obj.VMax = parseFloat(element.value)
                                                }} /></td>
                                                <td>
                                                    <input type="checkbox" onClick={() => {
                                                        if (document.getElementById(key).disabled) {
                                                            document.getElementById("VMin" + key).disabled = false;
                                                            document.getElementById("VMax" + key).disabled = false;
                                                            document.getElementById(key).disabled = false;
                                                        } else {
                                                            document.getElementById("VMin" + key).disabled = true;
                                                            document.getElementById("VMax" + key).disabled = true;
                                                            document.getElementById(key).disabled = true;
                                                        }
                                                        this.seleccionarFila(columna, orden, obj);
                                                    }} />
                                                </td>
                                            </tr>
                                        )
                                    } else {
                                        return true;
                                    }
                                })}
                            </tbody>
                        </table>
                    }
                </div>

            </div>
        )
    }
}
