import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import moment from 'moment'
import Modal from './Modal/Modal'

export default class Perfilamiento extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataFiltered: []
        }
    }

    dynamicSort = (property) => {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return (a, b) => {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    ascDesc = () => {
        let { data } = this.state
        let dataOrdenadaPorFecha = data.sort(this.dynamicSort("date"));
        this.setState({
            data: dataOrdenadaPorFecha
        })
    }

    buscar = () => {
        const { data } = this.state
        let searched = this.searched.value.toLowerCase()
        const result = data.filter(word => word.name.toLowerCase().includes(searched));

        this.setState({
            dataFiltered: result
        })
    }

    asignarPrograma = (id) => {
        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = {
            group: this.group
        }

        axios.put(Global.reasignProgram + "/" + id, bodyParameters, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                console.log(response.data)
                swal("Felicidades!", "Has reasignado el programa", "success");
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención!", "No has cambiado nada", "info");
                }
                console.log("Error: ", e)
            })
    }

    componentDidMount() {
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllFiles, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let respuesta = response.data.Data

            this.setState({
                data: respuesta,
                dataFiltered: respuesta
            })
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
        let { data, dataFiltered } = this.state;
        return (
            <div>
                <Modal />
                <input type="text" placeholder="Buscar" ref={(c) => this.searched = c} onChange={this.buscar} />
                {data &&
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th onClick={(e) => {
                                    e.preventDefault()
                                    this.ascDesc()
                                }}>Fecha</th>
                                <th>Archivo</th>
                                <th>Programa</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataFiltered.map((row, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{row.id}</td>
                                        <td>{moment(row.date).format("DD-MM-YYYY")}</td>
                                        <td>{row.name}</td>
                                        <td>{row.program ? row.program.name : 'Programa no asignado'}</td>
                                        <td>
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                // /analytics/file/:fileId/cuartiles
                                            }}>Cuartiles</button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                // /analytics/file/:fileId/perfilamiento
                                            }}>Perfilamientos</button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                this.asignarPrograma(row.id)
                                            }}>Asignar programa</button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                            }}>Borrar</button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                            }}>Descargar</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}
