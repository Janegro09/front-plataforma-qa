import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import SelectGroup from './SelectGroup'

export default class createRoleComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null
        }
        this.modifyUser = this.modifyUser.bind(this)
        this.handleChangeStatus = this.handleChangeStatus.bind(this)
        this.handleChangeTurno = this.handleChangeTurno.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.sexo = event.target.value
    }

    handleChangeStatus(event) {
        this.userActive = event.target.value
    }

    handleChangeTurno(event) {
        this.turno = event.target.value
    }

    modifyUser(e) {
        e.preventDefault()
        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const bodyParameters = {
            role: this.role.value,
            permissions: this.permissions
        }

        axios.post(Global.getRoles + "/new", bodyParameters, config)
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                if (response.data.Success) {
                    swal("Felicidades!", "Se ha creado el role correcamente", "success");
                }

            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar los roles", "error");
                }
                console.log("Error: ", e)
            })

    }

    render() {
        return (
            <div>
                <form onSubmit={this.modifyUser}>
                    {HELPER_FUNCTIONS.checkPermission("POST|groups/:id") &&
                        <input type="text" placeholder="role" name="group" ref={(c) => this.role = c} required />
                    }
                    {HELPER_FUNCTIONS.checkPermission("POST|groups/:id") &&
                        <input type="submit" value="Agregar" />
                    }
                </form>
                <SelectGroup getValue={(c) => this.permissions = c} />

            </div>
        )
    }
}
