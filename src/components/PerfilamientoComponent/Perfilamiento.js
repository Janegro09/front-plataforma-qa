import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import moment from 'moment'
import Modal from './Modal/Modal'
import ModalAgregarPerfilamiento from './Modal/ModalAgregarPerfilamiento'
import './Perfilamiento.css'
import { Redirect } from 'react-router-dom'

export default class Perfilamiento extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            dataFiltered: null,
            id: null,
            agregarPerfilamiento: false,
            cuartiles: false,
            cuartilSeleccionado: null,
            perfilamientos: false
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
        this.setState({
            id
        })
    }

    agregarPerfilamiento = () => {
        this.setState({
            agregarPerfilamiento: true
        })
    }

    descargar = (id) => {
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllFiles + '/' + id + '/download', { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let respuesta = response.data.Data
            let win = window.open(Global.download + '/' + respuesta.idTemp, '_blank');
            win.focus();

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

    borrar = (id) => {
        swal({
            title: "Estás seguro? 🤔",
            text: "El archivo que se elimina no podrás recuperarlo...",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let token = JSON.parse(sessionStorage.getItem('token'))
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    axios.delete(Global.getAllFiles + '/' + id, config)
                        .then(response => {
                            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))

                            if (response.data.Success) {
                                swal("Ok! El archivo ha sido eliminado 😎", {
                                    icon: "success",
                                }).then(() => {
                                    window.location.reload(window.location.href);
                                })
                            }
                        })
                        .catch(e => {
                            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                HELPER_FUNCTIONS.logout()
                            } else {
                                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                swal("Error!", "Hubo un problema al intentar borrar el rol", "error");
                                this.setState({
                                    redirect: true
                                })
                            }
                            console.log("Error: ", e)
                        })

                } else {
                    swal("El archivo se encuentra a salvo 😎");
                }
            });
    }

    cargarCuartil = (cuartilSeleccionado) => {
        this.setState({ cuartiles: true, cuartilSeleccionado });
    }

    cargarPerfilamientos = (cuartilSeleccionado) => {
        this.setState({ perfilamientos: true, cuartilSeleccionado });
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
        let { data, dataFiltered, id, agregarPerfilamiento, cuartiles, cuartilSeleccionado, perfilamientos } = this.state;

        if (cuartiles) {
            return <Redirect 
                        to={{
                            pathname: '/perfilamiento/cuartiles',
                            cuartilSeleccionado
                        }}
                     />
        }

        if (perfilamientos) {
            return <Redirect 
                        to={{
                            pathname: '/perfilamiento/perfilamientos',
                            cuartilSeleccionado
                        }}
                     />
        }

        return (
            <div>
                
                <button className="boton-agregar" onClick={(e) => {
                    e.preventDefault();
                    this.agregarPerfilamiento();
                }}>Subir</button>
                {data && id &&
                    <Modal idFile={id} />
                }
                {agregarPerfilamiento &&
                    <ModalAgregarPerfilamiento />
                }
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
                                                this.cargarCuartil(row);
                                                
                                                // /analytics/file/:fileId/cuartiles
                                            }}>Cuartiles</button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                this.cargarPerfilamientos(row);
                                                // /analytics/file/:fileId/perfilamiento
                                            }}>Perfilamientos</button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                this.asignarPrograma(row.id)
                                            }}>Asignar programa</button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                this.borrar(row.id)
                                            }}>Borrar</button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                this.descargar(row.id)
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
