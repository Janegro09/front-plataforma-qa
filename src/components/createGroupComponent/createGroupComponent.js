import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import { Redirect } from 'react-router-dom'

export default class createGroupComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
            redirect: false
        }
        
        this.modifyUser = this.modifyUser.bind(this)
        this.handleChangeStatus = this.handleChangeStatus.bind(this)
        this.handleChangeTurno = this.handleChangeTurno.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        // Protección de rutas
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }
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
            group: this.group.value
        }

        axios.post(Global.getGroups + "/new", bodyParameters, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                if (response.data.Success) {
                    swal("Felicidades!", "Se ha creado el grupo correctamente", "success");
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
                    swal("Error!", "Hubo un problema al agregar el usuario", "error");
                    this.setState({
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })

    }

    render() {

        if (this.state.redirect){
            return <Redirect to ="/groups"/> 

        }

        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
                <form onSubmit={this.modifyUser}>
                    {HELPER_FUNCTIONS.checkPermission("POST|groups/:id") &&
                        <input type="text" placeholder="group" name="group" ref={(c) => this.group = c} />
                    }
                    {HELPER_FUNCTIONS.checkPermission("POST|groups/:id") &&
                        <input type="submit" value="Agregar" />
                    }
                </form>

            </div>
        )
    }
}
