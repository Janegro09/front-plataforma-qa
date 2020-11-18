import React, { Component } from 'react'
import SidebarLeft from '../../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader'
import swal from 'sweetalert';
import Global from '../../../Global';
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';

export default class BibliotecaArchivosComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            seccionSeleccionada: "filesLibraryPartitures",
            loading: false,
            respuesta: null,
            selectedFile: null,
            errorMessage: ''
        }
    }

    fileChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });

        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        // Crear form data y añadir fichero
        const formData = new FormData();

        formData.append(
            'file',
            event.target.files[0]
        );

        formData.append(
            'section',
            this.state.seccionSeleccionada
        )

        axios.post(Global.files, formData, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.seleccionarOpcion();
            this.setState({
                loading: false
            })
        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                }
                console.log("Error: ", e)
            });
    }

    eliminar = (id) => {
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.delete(Global.files + '/' + id + '?section=' + this.state.seccionSeleccionada, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            })
            this.seleccionarOpcion();
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

    descargar = (id) => {
        let win = window.open(Global.download + '/' + id + '?urltemp=false', '_blank');
        win.focus();
    }

    seleccionarOpcion = (value = false) => {
        if (value) {
            this.setState({ seccionSeleccionada: value });

        }


        // Hacer rekest
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.files + '?section=' + this.state.seccionSeleccionada, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            })
            let respuesta = response.data.Data
            this.setState({ respuesta })

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false,
                        errorMessage: e.response.data.Message
                    })
                }
                console.log("Error: ", e)
            });
    }

    componentDidMount() {
        this.seleccionarOpcion();
    }

    render() {
        let { seccionSeleccionada, respuesta, loading, errorMessage } = this.state;
        return (
            <div>
                { loading &&
                    HELPER_FUNCTIONS.backgroundLoading() 
                }
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SidebarLeft />
                    <UserAdminHeader />
                </div>

                {HELPER_FUNCTIONS.checkPermission('POST|files') &&
                    <div className="uploadNomina">
                        <div>
                            <PublishIcon />
                            <input type="file" name="file" onChange={this.fileChange} id="file" />
                        </div>
                    </div>
                }

                <div className="section-content">
                    <h4>BIBLIOTECA DE ARCHIVOS</h4>
                    <hr />
                    <br />

                    {seccionSeleccionada &&
                        <select onChange={(e) => {
                            e.preventDefault();
                            let value = e.target.value
                            this.seleccionarOpcion(value)
                        }} defaultValue={seccionSeleccionada}>
                            <option value="filesLibraryPartitures">Librería de archivos partitura</option>
                        </select>
                    }
                    
                    {errorMessage &&
                        <div className="alert alert-warning">{errorMessage}</div>
                    }

                    {respuesta &&

                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th className="tableIcons">Descargar</th>
                                    <th className="tableIcons">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {respuesta.map((data, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{data.name}</td>
                                            <td>{data.type}</td>
                                            <td className="tableIcons"> <button onClick={(e) => {
                                                e.preventDefault();
                                                this.descargar(data.id)
                                            }}><GetAppIcon /></button> </td>
                                            {HELPER_FUNCTIONS.checkPermission('DELETE|files/:id') &&
                                                <td className="tableIcons"> <button onClick={(e) => {
                                                    e.preventDefault();
                                                    this.eliminar(data.id)
                                                }}><DeleteIcon /></button> </td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission('DELETE|files/:id') &&
                                                <td className="tableIcons"> <button disabled>Eliminar</button> </td>
                                            }
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        )
    }
}
