import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import {HELPER_FUNCTIONS} from '../../helpers/Helpers'
import swal from 'sweetalert'

export default class Searched extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: null
        }
    }

    agregarUsuario = (data) => {
        console.log("agregar", data);
        this.props.results(data)
    }

    componentDidMount() {
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getUsers, { headers: { Authorization: bearer } }).then(response => {
            // console.log("usuarios: ", response.data.Data)
            const usuarios = response.data.Data;
            const resultado = usuarios.filter(usuario => {
                return usuario.id === this.props.searchString || usuario.name === this.props.searchString.toLowerCase() || usuario.lastName === this.props.searchString.toLowerCase()
            })
            console.log(resultado)
            this.setState({
                result: resultado
            })
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
        })
            .catch((e) => {
                // console.log(e)
                // // Si hay algún error en el request lo deslogueamos
                // this.setState({
                //     error: true,
                //     redirect: true
                // })
                // if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                //     HELPER_FUNCTIONS.logout()
                // } else {
                //     sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                //     swal("Error!", "Hubo un problema", "error");
                // }
                console.log("Error: ", e)
            });
    }
    render() { 
        return (
            <div>
                {this.state.result &&
                    this.state.result.map((usuario, key) => {
                        return (
                            <div key={key} style={{textAlignVertical: "center",textAlign: "center",}}>
                                <div>
                                    {usuario.id} - {usuario.name} {usuario.lastName}
                                </div>
                                <div onClick={this.agregarUsuario(usuario)}>Agregar</div>
                                <hr />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
