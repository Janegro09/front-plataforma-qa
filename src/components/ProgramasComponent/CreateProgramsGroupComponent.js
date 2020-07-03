import React, { Component } from 'react'
import SelectGroup from './SelectGroup'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import axios from 'axios'
import swal from 'sweetalert'

export default class CreateProgramsGroupComponent extends Component {
    addUser = (event) => {
        event.preventDefault()
        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = {
            name: this.name.value,
            description: this.description.value,
            usersAssign: this.usersAssign
        }

        axios.post(
            Global.getAllProgramsGroups + '/new',
            bodyParameters,
            config
        ).then(response => {
            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
            // this.setState({
            //     redirect: true
            // })
            swal("Grupo de programas creado!", "Ya se encuentra registrado", "success");
        }).catch(e => {
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                swal("Error!", "Hubo un problema", "error");
            }
            console.log("Error: ", e)
        });


    }
    render() {
        return (
            <div>
     
                <div className="table-users-edit">
                    <form onSubmit={this.addUser} className="inputsEditUser addUserPadding">
                        <span className="Label">Nombre</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.name = c} />
                        <span className="Label">Descripción</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.description = c} required />
                        <span className="Label">Usuarios asignados</span>
                        <SelectGroup getValue={(c) => this.usersAssign = c} />
                        <button className="btn btn-block btn-info ripple-effect confirmar" type="submit" name="Submit" alt="sign in">Crear Grupo de Programas</button>
                    </form>
                </div>
            </div>
        )
    }
}
