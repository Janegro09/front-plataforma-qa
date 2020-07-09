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
            permissions: this.assign,
            description: this.description.value
        }

        let id = this.props.location.state.userSelected.id

        axios.put(Global.getRoles + "/" + id, bodyParameters, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                swal("Felicidades!", "Has cambiado el nombre del grupo", "success");
                this.setState({
                    redirect: true
                })
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

    componentDidMount() {
        let token = JSON.parse(sessionStorage.getItem('token'))
        // Protección de rutas
        if (token === null) {
            return <Redirect to={'/'} />
        }

        if (this.props.location.state) {
            let id = this.props.location.state.userSelected.id
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
    
            axios.get(Global.getRoles + '/' + id, config)
                .then(response => {
                    this.setState({
                        userInfo: response.data.Data[0],
                        // redirect: true
                    })
                    sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    // swal("Genial!", "El rol ha sido modificado correctamente", "success");
                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        swal("Error!", "Hubo un problema", "error");
                        this.setState({
                            redirect: true
                        })
                    }
                    console.log("Error: ", e)
                })
        } else {
            this.setState({
                redirect: true
            })
            return HELPER_FUNCTIONS.logout()
        }
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to="/roles" />
        }
        const group = this.state.userInfo
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
                {group !== null &&
                    <form className="inputsEditUser addUserPadding" onSubmit={this.modifyUser}>
                        <input className="form-control" type="text" placeholder="id" name="id" ref={(c) => this.id = c} defaultValue={group.id ? group.id : ''} disabled />
                        <span className="Label">Grupo</span>
                        <input className="form-control" type="text" placeholder="" name="group" ref={(c) => this.role = c} defaultValue={group.role ? group.role : ''} />
                        <span className="Label">Descripción</span>
                        <input className="form-control" type="text" placeholder="" name="description" ref={(c) => this.description = c} defaultValue={group.description ? group.description : ''} />
                        <SelectGroup getValue={(c) => this.assign = c} defaultValue={group.permissionAssign ? group.permissionAssign : ''} />
                        {HELPER_FUNCTIONS.checkPermission("PUT|roles/:id") &&
                        <button  className="btn btn-block btn-info ripple-effect confirmar" type="submit" name="Submit" alt="sign in">Guardar cambios</button>
                    
                        }
                    </form>
                }

            </div>
        )
    }
}

