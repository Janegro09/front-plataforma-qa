import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'
import { Redirect } from 'react-router-dom'
import './Home.css';
import Logo from '../Home/logo_background.png';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import Global from '../../Global'
import axios from 'axios'

export default class UsersComponent extends Component {
    constructor(props) {
        super(props)
        this.changePass = this.changePass.bind(this)
    }

    changePass() {
        const userData = JSON.parse(sessionStorage.getItem("userData"))
        const id = userData.id
        swal(`Cambiando contraseña de ${userData.name}, ingresá: `, {
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

                axios.post(Global.passChange + id, bodyParameters, config)
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
                            swal("Atención", "No has cambiado nada", "info");
                        }
                        console.log("Error: ", e)
                    })
            });
    }
    render() {
        // Protección de rutas
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }
        return (
            <div>
                <div>
                    <SidebarLeft />
                </div>

                <div className="logoBackground">
                    <img src={Logo} alt="Logo" title="Logo" className="Logo2" />
                </div>

                <div className="container">
                    {HELPER_FUNCTIONS.checkPermission("POST|users/passchange/:id") &&
                        <button onClick={this.changePass} className="button-change-pass">Cambiar contraseña</button>
                    }
                </div>
            </div>

        )
    }
}