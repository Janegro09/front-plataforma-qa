import React, { Component } from 'react'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import axios from 'axios'
import Global from '../../Global'
import PublishIcon from '@material-ui/icons/Publish';
import './SubirNominaComponent.css'

export default class SubirNominaComponent extends Component {
    state = {
        selectedFile: null,
        loading: false
    };

    fileChange = (event) => {
        let mail = JSON.parse(sessionStorage.getItem("userData")).email
        console.log(event.target.files[0])
        this.setState({
            selectedFile: event.target.files[0]
        });
        if (event.target.files[0].type !== "text/csv") {
            swal("ATENCIÓN", "El archivo tiene que ser CSV", "info");

        } else {
            this.setState({
                loading: true
            })
            swal({
                title: "Estás por actualizar la nómina de usuarios",
                text: `Nombre del archivo: ${event.target.files[0].name}, tené en cuenta que los cambios son irreversibles.`,
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

                        axios.post(Global.sendNomina, formData, { headers: { Authorization: bearer } }).then(response => {
                            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                            swal(`Nómina en proceso de actualización, cuando finalice recibirás un mail en ${mail}`, {
                                icon: "success",
                            });
                            this.setState({
                                loading: false
                            })
                        })
                            .catch((e) => {
                                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                    HELPER_FUNCTIONS.logout()
                                } else {
                                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                    swal("Error!", "Hubo un problema al agregar la nómina", "error");
                                    this.setState({
                                        loading: false
                                    })
                                }
                                console.log("Error: ", e)
                            });

                    } else {
                        swal("Nómina NO actualizada!");
                        this.setState({
                            loading: false
                        })
                    }
                });
        }
    }
    render() {
        return (
            <>
                {this.state.loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                {HELPER_FUNCTIONS.checkPermission('POST|backoffice/nomina') &&
                    <div className="uploadNomina">
                        <div>
                            <PublishIcon />
                            <input type="file" name="file" onChange={this.fileChange} id="file" />
                        </div>
                    </div>
                }
            </>
        )
    }
}
