import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../../Global'
import swal from "sweetalert"
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import { Redirect } from 'react-router-dom'

export default class deleteUserComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }

    componentDidMount() {
        // Protección de rutas
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }
        swal({
            title: "¿Estás seguro que queres borrar el grupo?",
            text: "Una vez borrado, no podrás recuperarlo",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let token = JSON.parse(localStorage.getItem('token'))

                    if (this.props.location.state) {

                        let id = this.props.location.state.userSelected.id
                        const config = {
                            headers: { Authorization: `Bearer ${token}` }
                        };

                        axios.delete(Global.getGroups + '/' + id, config)
                            .then(response => {
                                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                                if (response.data.Success) {
                                    swal("Genial! el grupo se ha eliminado correctamente", {
                                        icon: "success",
                                    });

                                    // Cambio el redirect a true para volver a /groups
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
                                    swal("Error!", `${e.response.data.Message}`, "error");
                                    // swal("Error!", "Hubo un problema al agregar el usuario", "error");
                                    // Cambio el redirect a true para volver a /groups
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
                } else {
                    swal("OK", "El grupo NO se ha eliminado", "info");
                    // Cambio el redirect a true para volver a /groups
                    this.setState({
                        redirect: true
                    })
                }
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/groups" />
        }

        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
            </div>
        )
    }
}
