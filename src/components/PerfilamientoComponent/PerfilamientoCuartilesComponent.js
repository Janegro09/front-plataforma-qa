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

    seleccionarFila = (fila, orden) => {
        console.log("La fila: ", fila, orden);
    }

    setOrden = () => {
        console.log("Orden: ", this.orden.value);

    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.name === 'ASC' ? target.checked : target.value;
        let name = target.name;
        if (name !== 'ASC') {
            name = 'DESC';
        }
        this.setState({
            [name]: value
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

        const { nombreColumnas, dataFiltered, redirect } = this.state;

        if (redirect) {
            return <Redirect to="/perfilamiento" />
        }


        return (
            <div>
                <SideBarLeft />

                <div className="section-content">
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
                                    <th>Quitar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataFiltered.map((columna, key) => {
                                    let orden = 'ASC';
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
                                                    }>
                                                        <option value="ASC">ASC</option>
                                                        <option value="DESC">DESC</option>
                                                    </select>
                                                </td>
                                                <td> <input type="text" placeholder="VMin" /> </td>
                                                <td><input type="text" placeholder="VMax" /></td>
                                                <td> <button onClick={(e) => {
                                                    e.preventDefault();
                                                    this.seleccionarFila(columna, orden);
                                                }}>Seleccionar</button> </td>
                                                <td> <button>Quitar</button> </td>
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
