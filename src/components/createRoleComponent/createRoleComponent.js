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
        let token = JSON.parse(localStorage.getItem('token'))
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
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token));
                console.log(response.data)
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
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    // swal("Error!", "Hubo un problema al agregar los roles", "error");
                    swal("Error!", `${e.response.data.Message}`, "error");
                    this.setState({
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })

    }

    render() {
        // Protecci??n de rutas
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }

        if (this.state.redirect) {
            return <Redirect to={'/roles'} />
        }
        return (
            <>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>

                <section className="section-content">
                    
                    
                    <form className="inputsEditUser addUserPadding" onSubmit={this.modifyUser}>
                    <h4>CREAR ROL</h4>
                    <hr />
                    <br />
                        <span className="Label">Rol</span>
                        {HELPER_FUNCTIONS.checkPermission("POST|roles/:id") &&

                            <input className="form-control" type="text" placeholder="" name="group" ref={(c) => this.role = c} required />
                        }
                        <span className="Label">Descripci??n</span>
                        {HELPER_FUNCTIONS.checkPermission("POST|roles/:id") &&
                            <input className="form-control" type="text" placeholder="" name="description" ref={(c) => this.description = c} required />
                        }

                        <SelectGroup getValue={(c) => this.permissions = c} />

                        {HELPER_FUNCTIONS.checkPermission("POST|roles/:id") &&

                            <button className="btn btn-block btn-info ripple-effect confirmar" type="submit" name="Submit" alt="sign in">Guardar cambios</button>

                        }
                    </form>
                </section>

            </>
        )
    }
}
