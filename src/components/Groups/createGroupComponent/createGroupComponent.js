import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../../Global'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import { Redirect } from 'react-router-dom'

export default class createGroupComponent extends Component {
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

        axios.post(Global.getGroups + "/new", bodyParameters, config)
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
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
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No se ha agregado el grupo", "info");
                    this.setState({
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })

    }

    componentDidMount() {
        // Protección de rutas
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to="/groups" />

        }

        swal("Ingrese nombre del grupo:", {
            content: "input",
        })
            .then((value) => {
                this.group = value
                this.modifyUser()
            })

        return (
            <div className="header">
                {/* BOTON DE SALIDA */}
                {/* BARRA LATERAL IZQUIERDA */}
                <SiderbarLeft />
            </div>
        )
    }
}
