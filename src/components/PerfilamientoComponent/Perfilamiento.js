import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import moment from 'moment'

export default class Perfilamiento extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
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

    componentDidMount() {
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllFiles, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let respuesta = response.data.Data
            console.log(respuesta)
            this.setState({
                data: respuesta
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
        let { data } = this.state;
        return (
            <div>
                <input type="text" placeholder="Buscar" />
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
                            {data.map((row, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{row.id}</td>
                                        <td>{moment(row.date).format("DD-MM-YYYY")}</td>
                                        <td>{row.name}</td>
                                        <td>programa</td>
                                        <td>Editar - Borrar</td>
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
