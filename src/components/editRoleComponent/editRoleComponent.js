import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import SelectGroup from '../createRoleComponent/SelectGroup'
import { Redirect } from 'react-router-dom'

export default class editRoleComponent extends Component {
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

    componentDidMount() {
        let token = JSON.parse(sessionStorage.getItem('token'))
        // Protección de rutas
        if (token === null) {
            return <Redirect to={'/'} />
        }
        let id = this.props.location.state.userSelected.id
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.get(Global.getRoles + '/' + id, config)
            .then(response => {
                this.setState({
                    userInfo: response.data.Data[0]
                })
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            })
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
        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = {
            role: this.role.value,
            permissions: this.assign,
            description: this.description.value
        }

        let id = this.props.location.state.userSelected.id

        axios.put(Global.getRoles + "/" + id, bodyParameters, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                swal("Felicidades!", "Has cambiado el nombre del grupo", "success");
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar los roles", "error");
                }
                console.log("Error: ", e)
            })

    }

    render() {
        const group = this.state.userInfo
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
                {group !== null &&
                    <form onSubmit={this.modifyUser}>
                        <input type="text" placeholder="id" name="id" ref={(c) => this.id = c} defaultValue={group.id ? group.id : ''} disabled />
                        <input type="text" placeholder="group" name="group" ref={(c) => this.role = c} defaultValue={group.role ? group.role : ''} />
                        <input type="text" placeholder="description" name="description" ref={(c) => this.description = c} defaultValue={group.description ? group.description : ''} />
                        <SelectGroup getValue={(c) => this.assign = c} defaultValue={group.permissionAssign ? group.permissionAssign : ''} />
                        {HELPER_FUNCTIONS.checkPermission("PUT|roles/:id") &&
                            <input type="submit" value="modificar usuario" />
                        }
                    </form>
                }

            </div>
        )
    }
}

