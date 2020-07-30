import React, { Component } from 'react'
import './Modal.css'
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

export default class Modal extends Component {

    state = {
        loading: false,
        data: null,
        archivosSeleccionados: []
    }
    cerrarModal = () => {
        let { archivosSeleccionados } = this.state;
        this.props.getData(archivosSeleccionados);
    }

    seleccionarArchivo = (archivo) => {

        this.setState(prevState => ({
            archivosSeleccionados: [...prevState.archivosSeleccionados, archivo]
        }))
    }

    eliminarArchivo = (idSeleccionado) => {
        let { archivosSeleccionados } = this.state;
        const index = archivosSeleccionados.findIndex(element => element.id === idSeleccionado);
        if (index > -1 && archivosSeleccionados.length > 1) {
            archivosSeleccionados.splice(index, 1);
        } else if (archivosSeleccionados.length === 1) {
            archivosSeleccionados = []
        }

        this.setState({
            archivosSeleccionados
        })
    }

    componentDidMount() {
        let { archivosSeleccionados } = this.props;

        if (archivosSeleccionados === null) {
            archivosSeleccionados = [];
        }

        // Hacer rekest
        this.setState({
            loading: true,
            archivosSeleccionados
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.files + '?section=filesLibraryPartitures', { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                data: response.data.Data,
                loading: false
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

    render() {

        let { loading, data, archivosSeleccionados } = this.state;

        return (
            <div className="modal" id="modal-casero">
                <div className="hijo2">
                    <div className="boton-cerrar">
                        <button className="buttonGral" onClick={
                            (e) => {
                                e.preventDefault()
                                this.cerrarModal()
                            }
                        }>x</button>
                    </div>

                    {loading &&
                        HELPER_FUNCTIONS.backgroundLoading()
                    }

                    {data &&
                        <div className="section-content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map(resp => {
                                            return (
                                                <tr key={resp.id}>
                                                    <td>{resp.name}</td>
                                                    <td>{resp.type}</td>
                                                    <td>
                                                        {archivosSeleccionados !== null &&
                                                            archivosSeleccionados.find(element => element.id === resp.id) &&
                                                            <button
                                                                onClick={
                                                                    (e) => {
                                                                        e.preventDefault();
                                                                        this.eliminarArchivo(resp.id)
                                                                    }
                                                                }
                                                            >
                                                                Eliminar
                                                            </button>
                                                        }
                                                        {archivosSeleccionados !== null &&
                                                            !archivosSeleccionados.find(element => element.id === resp.id) &&
                                                            <button
                                                                onClick={
                                                                    (e) => {
                                                                        e.preventDefault();
                                                                        this.seleccionarArchivo(resp)
                                                                    }
                                                                }
                                                            >
                                                                Agregar
                                                        </button>
                                                        }

                                                        {archivosSeleccionados === null &&

                                                            <button
                                                                onClick={
                                                                    (e) => {
                                                                        e.preventDefault();
                                                                        this.seleccionarArchivo(resp)
                                                                    }
                                                                }
                                                            >
                                                                Agregar
                                                        </button>
                                                        }

                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    }

             
                </div>
            </div>
        )
    }
}
