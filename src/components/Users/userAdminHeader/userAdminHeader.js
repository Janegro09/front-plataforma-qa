import React, { Component } from 'react'
import './userAdminHeader.css'
import { Redirect } from 'react-router-dom'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import Global from '../../../Global'
import axios from 'axios'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';

export default class UserAdminHeader extends Component {
    constructor(props) {
        super(props)
        this.changePass = this.changePass.bind(this)

        this.state = {
            value: 'user',
            redirect: false
        }

        this.changePass = this.changePass.bind(this)
        this.salir = this.salir.bind(this);
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

    salir() {
        this.setState({
            redirect: true
        })
        return HELPER_FUNCTIONS.logout()
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }
        // Protección de rutas
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const userData = JSON.parse(sessionStorage.getItem("userData"))
        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }
        return (
            <div className="containerIn">
                <p className="iconsUser">Bienvenido {userData.name}</p>
                <button onClick={this.changePass}><SettingsIcon className="IconoMenu iconsUser" style={{ fontSize: 23 }} /></button>
                <button onClick={this.salir}><ExitToAppIcon className="IconoMenu iconsUser" style={{ fontSize: 23 }} /></button>
            </div>
        )
    }
}
