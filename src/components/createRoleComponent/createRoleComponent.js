import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import SelectGroup from './SelectGroup'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import { Redirect } from 'react-router-dom'

export default class createRoleComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
            redirect: false
        }
    }

    handleChange = (event) => {
        this.sexo = event.target.value
    }

    handleChangeStatus = (event) => {
        this.userActive = event.target.value
    }

    handleChangeTurno = (event) => {
        this.turno = event.target.value
    }

    modifyUser = (e) => {
        e.preventDefault()
        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const bodyParameters = {
            role: this.role.value,
            description: this.description.value,
            permissions: this.permissions
        }

        axios.post(Global.getRoles + "/new", bodyParameters, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                if (response.data.Success) {
                    swal("Felicidades!", "Se ha creado el role correcamente", "success");
                    this.setState({
                        redirect: true
                    })
                }

            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar los roles", "error");
                    this.setState({
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })

    }

    render() {
        // Protección de rutas
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }

        if (this.state.redirect) {
            return <Redirect to={'/roles'} />
        }
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
                <form className="inputsEditUser addUserPadding" onSubmit={this.modifyUser}>
                <span className="Label">Rol</span>
                    {HELPER_FUNCTIONS.checkPermission("POST|roles/:id") &&
                     
                     <input className="form-control" type="text" placeholder="" name="group" ref={(c) => this.role = c} required />
                    }
                    <span className="Label">Descripción</span>
                    {HELPER_FUNCTIONS.checkPermission("POST|roles/:id") &&
                        <input className="form-control" type="text" placeholder="" name="description" ref={(c) => this.description = c} required />
                    }

                <SelectGroup getValue={(c) => this.permissions = c} />

                {HELPER_FUNCTIONS.checkPermission("POST|roles/:id") &&
                
                    <button className="btn btn-block btn-info ripple-effect confirmar" type="submit" name="Submit" alt="sign in">Guardar cambios</button>

                }
                </form>

            </div>
        )
    }
}
