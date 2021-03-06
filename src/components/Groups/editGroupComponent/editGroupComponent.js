import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../../Global'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import { Redirect } from 'react-router-dom'

export default class editGroupComponent extends Component {
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
        // e.preventDefault()
        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = {
            group: this.group
        }

        let id = this.props.location.state.userSelected.id

        axios.put(Global.getGroups + "/" + id, bodyParameters, config)
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                swal("Felicidades!", "Has cambiado el nombre del grupo", "success");
                this.setState({
                    redirect: true
                })
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención!", "No has cambiado nada", "info");
                    this.setState({
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })

    }

    componentDidMount() {
        let token = JSON.parse(localStorage.getItem('token'))
        // Protección de rutas
        if (token === null) {
            return <Redirect to={'/'} />
        }

        if (this.props.location.state) {
            let id = this.props.location.state.userSelected.id
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            axios.get(Global.getGroups + '/' + id, config)
                .then(response => {
                    this.setState({
                        userInfo: response.data.Data[0]
                    })
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        // swal("Error!", "Hubo un problema", "error");
                        swal("Error!", `${e.response.data.Message}`, "error");

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
            return <Redirect to="/groups" />
        }

        const group = this.state.userInfo

        if (group !== null) {
            const name = group.group
            swal("Ingrese nombre del grupo:", {
                content: {
                    element: 'input',
                    attributes: {
                        defaultValue: name,
                    }
                }
            })
                .then((value) => {
                    this.group = value
                    this.modifyUser()
                })
        }
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
                {/* {group !== null &&
                    <form onSubmit={this.modifyUser} className="input-file">
                        <input type="text" placeholder="group" name="group" ref={(c) => this.group = c} defaultValue={group.group ? group.group : ''} />
                        {HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") &&
                            <input type="submit" value="Modificar grupo" />
                        }
                    </form>
                } */}

            </div>
        )
    }
}
