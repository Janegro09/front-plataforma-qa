import React, { Component } from 'react'
import './Modal.css'
import axios from 'axios'
import Global from '../../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import LoadingBar from '../Modal/LoadingBar'

export default class Modal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedFile: null,
            loaded: false
        }
    }

    fileChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });

        swal({
            title: "Estás por subir una base consolidada",
            text: `Nombre del archivo: ${event.target.files[0].name}`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    const tokenUser = JSON.parse(sessionStorage.getItem("token"))
                    const token = tokenUser
                    const bearer = `Bearer ${token}`
                    // Crear form data y añadir fichero
                    const formData = new FormData();

                    formData.append(
                        'file',
                        this.state.selectedFile
                    );

                    axios.post(Global.reasignProgram, formData, { headers: { Authorization: bearer } }).then(response => {
                        sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                        this.setState({ loaded: true })
                        setTimeout(() => {
                            this.setState({ loaded: false })
                            window.location.reload(window.location.href);
                        }, 90000);
                    })
                        .catch((e) => {
                            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                HELPER_FUNCTIONS.logout()
                            } else {
                                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                swal("Error!", `${e.response.data.Message}`, "error");
                            }
                            console.log("Error: ", e)
                        });

                } else {
                    swal("NO actualizada!");
                }
            });

    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }


    render() {
        const { loaded, selectedFile } = this.state;
        return (
            <div className="modal uploadPerfilamiento" id="modal-casero">
                <div className="hijo modalPerfilamiento">
                    <div className="boton-cerrar">
                        <button onClick={
                            (e) => {
                                e.preventDefault()
                                this.cerrarModal()
                            }
                        }>x</button>
                    </div>

                    {loaded && selectedFile !== null &&

                        <LoadingBar />
                    }


                    <div className="input-file">
                        <label className="labelFileInput" htmlFor="file">Subir base consolidada</label>
                        <input type="file" name="file" onChange={this.fileChange} />
                    </div>
                </div>
            </div>
        )
    }
}
