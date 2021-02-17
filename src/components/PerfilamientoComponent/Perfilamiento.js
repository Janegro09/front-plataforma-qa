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
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
            nameCuartilSelected: '',
            perfilamientos: false,
            loading: false,
            totalDisplayed: 15
        }
    }

    verMas = () => {
        document.getElementById('ver-mas').focus();
        let { totalDisplayed } = this.state;
        totalDisplayed += 15;

        this.setState({ totalDisplayed });
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
        const result = data?.filter(word => word.name.toLowerCase().includes(searched));

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
        this.setState({
            loading: true
        })
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllFiles + '/' + id + '/download', { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            })
            let respuesta = response.data.Data
            let win = window.open(Global.download + '/' + respuesta.idTemp, '_blank');
            win.focus();

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
                    // swal("Error!", "Hubo un problema", "error");
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });
    }

    borrar = (id) => {
        swal({
            title: "Estás seguro?",
            text: "El archivo que se elimina no podrás recuperarlo...",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let token = JSON.parse(localStorage.getItem('token'))
                    this.setState({
                        loading: true
                    })
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    axios.delete(Global.getAllFiles + '/' + id, config)
                        .then(response => {
                            localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                            this.setState({
                                loading: false
                            })
                            if (response.data.Success) {
                                swal("El archivo ha sido eliminado", {
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
                                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                swal("Error!", "Hubo un problema al intentar borrar el rol", "error");
                                this.setState({
                                    loading: false,
                                    redirect: true
                                })
                            }
                            console.log("Error: ", e)
                        })

                } else {
                    swal("El archivo se encuentra a salvo");
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
        HELPER_FUNCTIONS.set_page_title('Perfilamientos');
        this.setState({
            loading: true
        })
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllFiles, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let respuesta = response.data.Data;

            this.setState({
                data: respuesta,
                dataFiltered: respuesta,
                loading: false
            })
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
                    // swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {
        let { data, dataFiltered, id, agregarPerfilamiento, cuartiles, cuartilSeleccionado, perfilamientos, loading, totalDisplayed } = this.state;

        if (cuartiles) {
            return <Redirect
                to={{
                    pathname: `/perfilamiento/cuartiles`,
                    cuartilSeleccionado: cuartilSeleccionado.id,
                    nameCuartilSelected: cuartilSeleccionado.name
                }}
            />
        }

        if (perfilamientos) {
            return <Redirect
                to={{
                    pathname: '/perfilamiento/perfilamientos',
                    cuartilSeleccionado: cuartilSeleccionado.id,
                    nameCuartilSelected: cuartilSeleccionado.name
                }}
            />
        }

        return (
            <div className="tabla_parent">
                <h4>PERFILAMIENTO</h4>
                <hr />
                <br />
                <div className="flex-input-add">
                    {/* spiner rekes */}
                    {loading &&
                        HELPER_FUNCTIONS.backgroundLoading()
                    }
                    <input className="form-control" type="text" placeholder="Buscar" ref={(c) => this.searched = c} onChange={this.buscar} />
                    {HELPER_FUNCTIONS.checkPermission('POST|analytics/file/:fileId/perfilamiento') &&
                        <button className="boton-agregar" onClick={(e) => {
                            e.preventDefault();
                            this.agregarPerfilamiento();
                        }}><PublishIcon /></button>
                    }

                </div>

                {data && id &&
                    <Modal idFile={id} />
                }

                {agregarPerfilamiento &&
                    <ModalAgregarPerfilamiento />
                }

                {data &&
                    <table>
                        <thead>
                            <tr>
                                <th onClick={(e) => {
                                    e.preventDefault()
                                    this.ascDesc()
                                }}>Fecha</th>
                                <th>Archivo</th>
                                <th>Programa</th>
                                <th className="tableIconsPerfilamiento">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dataFiltered.slice(0, totalDisplayed).map((row, key) => {
                                return (
                                    <tr key={key}>
                                        <td>{moment(row.date).format("DD-MM-YYYY")}</td>
                                        <td>{row.name}</td>
                                        <td>{row.program ? row.program.name : '-'}</td>
                                        <td className="tableIconstableIconsPerfilamiento">
                                            <button data-toggle="tooltip" data-placement="top" title="Cuartiles" onClick={(e) => {
                                                e.preventDefault()
                                                this.cargarCuartil(row);

                                                // /analytics/file/:fileId/cuartiles
                                            }}><AssessmentIcon style={{ fontSize: 15 }} /></button>

                                            <button data-toggle="tooltip" data-placement="top" title="Perfilamientos" onClick={(e) => {
                                                e.preventDefault()
                                                this.cargarPerfilamientos(row);
                                                // /analytics/file/:fileId/perfilamiento
                                            }}><RecentActorsIcon style={{ fontSize: 15 }} /></button>

                                            <button data-toggle="tooltip" data-placement="top" title="Asignar programa" onClick={(e) => {
                                                e.preventDefault()
                                                this.asignarPrograma(row.id)
                                            }}><AssignmentReturnIcon style={{ fontSize: 15 }} /></button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                this.borrar(row.id)
                                            }}><DeleteIcon style={{ fontSize: 15 }} /></button>

                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                this.descargar(row.id)
                                            }}><GetAppIcon style={{ fontSize: 15 }} /></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
               
                <div
                    id="ver-mas"
                    className="ver-mas"
                    onClick={
                        (e) => {
                            e.preventDefault();
                            this.verMas();
                        }
                    }
                >
                    <ExpandMoreIcon />
                </div>
               
            </div>
        )
    }
}
