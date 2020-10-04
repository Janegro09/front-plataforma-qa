import React, { Component } from 'react';

import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import Global from '../../Global';
import swal from 'sweetalert';

export default class ModalNuevoTipoCalibracion extends Component {
    state = {
        loading: false,
        name: "",
        description: ""
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    handleSubmit = () => {
        let { name, description } = this.state;

        let token = JSON.parse(sessionStorage.getItem('token'));
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        let dataToSend = {
            name,
            description
        }

        axios.post(Global.calibrationTypes, dataToSend, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token));
                console.log(response.data)
                if (response.data.Success) {
                    swal("Felicidades!", `${response.data?.Message}`, "success").then(() => {
                        window.location.reload(window.location.href);
                    })
                }

            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No se ha agregado el grupo", "info");
                }
                console.log("Error: ", e)
            })
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    render() {
        let { loading } = this.state;

        return (
            <div className="modal" id="modal-casero">
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="hijo">
                    <div className="boton-cerrar">
                        <button onClick={
                            (e) => {
                                e.preventDefault();
                                this.cerrarModal();
                            }
                        }>x</button>
                    </div>
                    <div className="contenedorModal">
                        <h4>Agregar calibracion</h4>
                        <br />
                        <hr />
                        <br />
                        <form>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Nombre"
                                name="name"
                                onChange={this.myChangeHandler}
                            />
                            <br />
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Descripción"
                                name="description"
                                onChange={this.myChangeHandler}
                            />
                        </form>
                        <br />
                        <button
                        className="defaultBtnModal"
                            onClick={(e) => {
                                e.preventDefault();
                                this.handleSubmit();
                            }}
                        >
                            Enviar
                    </button>
                    </div>
                </div>
            </div>
        )
    }
}
