import React, { Component } from 'react'
import swal from 'sweetalert';
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'


export default class ChangePassword extends Component {
    render() {
        return (
            <div>
                {HELPER_FUNCTIONS.checkPermission("POST|users/passchange/:id") &&
                    <button
                        onClick={() => {
                            swal(`Cambiando contraseña de ${this.props.user.email}, ingresá: `, {
                                content: {
                                    element: "input",
                                    attributes: {
                                        placeholder: "Ingrese contraseña",
                                        type: "password",
                                    },
                                },
                            })
                                .then((value) => {
                                    let token = JSON.parse(sessionStorage.getItem('token'))
                                    const config = {
                                        headers: { Authorization: `Bearer ${token}` }
                                    };

                                    // PARAMETROS REQUERIDOS, SOLO PASSWORD
                                    const bodyParameters = {
                                        password: value
                                    };

                                    axios.post(Global.passChange + this.props.user.id, bodyParameters, config)
                                        .then(response => {
                                            console.log(response)
                                            if (response.data.Success) {
                                                swal("Felicidades!", "Contraseña cambiada!", "success");
                                            } else {
                                                swal("Error!", "Hubo un error al cambiar la contraseña!", "error");
                                            }
                                            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                                        })
                                        .catch(e => {
                                            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                                HELPER_FUNCTIONS.logout()
                                            } else {
                                                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                                swal("Error!", "Hubo un problema al agregar el usuario", "error");
                                            }
                                            console.log("Error: ", e)
                                        })
                                });
                        }}
                    >Cambiar contraseña</button>
                }
            </div>
        )
    }
}
