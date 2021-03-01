import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import { Redirect } from 'react-router-dom'

export default class deleteRoleComponent extends Component {
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
            title: "¿Estás seguro que queres borras el rol?",
            text: "Una vez borrado, no podrás recuperarlo :(",
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

                        axios.delete(Global.getRoles + '/' + id, config)
                            .then(response => {
                                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))

                                if (response.data.Success) {
                                    swal("Genial! se ha eliminado el rol correctamente", {
                                        icon: "success",
                                    });
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
                                    // swal("Error!", "Hubo un problema al intentar borrar el rol", "error");
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
                } else {
                    swal("OK! el rol NO se ha eliminado");
                    this.setState({
                        redirect: true
                    })
                }
            });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/roles'} />
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