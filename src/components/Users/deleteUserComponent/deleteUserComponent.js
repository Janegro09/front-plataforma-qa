import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../../Global'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import { Redirect } from 'react-router-dom'

export default class deleteUserComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }
    componentDidMount() {
        // DELETE USER
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

            swal({
                title: "¿Estás seguro?",
                text: "Una vez borrado el usuario, no podrás recuperarlo",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        axios.delete(Global.getUsers + '/' + id, config)
                            .then(response => {
                                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                                swal("El usuario ha sido borrado", {
                                    icon: "success",
                                });

                                // Seteo de estado para el redirect
                                this.setState({
                                    redirect: true
                                })
                            })
                            .catch(e => {
                                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                    HELPER_FUNCTIONS.logout()
                                } else {
                                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                    swal("Error!", "Hubo un problema", "error");

                                    // Seteo de estado para el redirect
                                    this.setState({
                                        redirect: true
                                    })
                                }
                                console.log("Error: ", e)
                            })

                    } else {
                        swal("Casi! El usuario NO ha sido borrado", {
                            icon: "info",
                        });

                        // Seteo de estado para el redirect
                        this.setState({
                            redirect: true
                        })

                    }
                });
        } else {
            this.setState({
                redirect: true
            })
            return HELPER_FUNCTIONS.logout()
        }
    }

    render() {
        // Si se cumple algún request, redirijo a /users
        if (this.state.redirect) {
            return <Redirect to="/users" />
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
