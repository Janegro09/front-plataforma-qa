import React, { Component } from 'react';
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

export default class SelectEditarGrupos extends Component {

    state = {
        defaultValue: [],
        loading: false,
        allUsers: null,
        usuariosReturn: [],
        usuariosSeleccionados: []
    }

    quitarUsuario = (usuario) => {
        let { defaultValue } = this.state
        let { idGroup } = this.props
        let newArray = []

        defaultValue.map(user => {
            if (user.id !== usuario.id) {
                newArray.push(user)
            }
            return true;
        })

        if (idGroup) {
            let token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            axios.delete(
                Global.getAllProgramsGroups + '/' + idGroup + '/' + usuario.id,
                config
            ).then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                swal("Genial!", "Usuario desasignado", "success");

            }).catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    // swal("Error!", "Hubo un problema", "error");
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });
        }

        this.setState({
            defaultValue: newArray
        })
    }

    buscar = () => {
        let data = document.getElementById('input-value').value.toUpperCase();

        this.setState({
            usuariosReturn: this.state.allUsers.filter(element => element.group.includes(data))
        })
    }

    seleccionado = (element) => {
        this.setState({
            defaultValue: [...this.state.defaultValue, element]
        })
    }


    componentDidMount() {
        this.setState({
            loading: true
        })

        setTimeout(() => {
            const tokenUser = JSON.parse(localStorage.getItem("token"))
            const token = tokenUser
            const bearer = `Bearer ${token}`

            axios.get(Global.getGroups, { headers: { Authorization: bearer } }).then(response => {
                localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

                let { defaultValue } = this.props;
                this.setState({
                    allUsers: response.data.Data,
                    loading: false,
                    defaultValue
                })

                // this.searchDefault();

            })
                .catch((e) => {
                    // Si hay algún error en el request lo deslogueamos

                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        this.setState({
                            error: true,
                            redirect: true,
                            loading: false
                        })
                        // swal("Error!", "Hubo un problema", "error");
                        swal("Error!", `${e.response.data.Message}`, "error");
                    }
                    console.log("Error: ", e)
                });
        }, 2000);

    }

    render() {
        let { defaultValue, usuariosReturn } = this.state;
        let arrayAEnviar = [];

        defaultValue.map(usuario => {
            arrayAEnviar.push(usuario.id)
            return true;
        });

        this.props.getValue(arrayAEnviar);

        return (
            <>
                {this.state.loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div>
                    {defaultValue &&
                        defaultValue.map((usuario) => {
                            return (
                                <div className="etiquetas" key={usuario.id}>
                                    <div className="etiqueta">
                                        <p>{`${usuario.id} - ${usuario.group}`}</p>
                                        <button onClick={
                                            (e) => {
                                                e.preventDefault()
                                                this.quitarUsuario(usuario)
                                            }
                                        }>x</button>
                                    </div>
                                </div>
                            )
                        })

                    }

                </div>

                <input
                    id='input-value'
                    type="text"
                    onChange={this.buscar}
                    className="form-control"
                />

                {usuariosReturn.length > 0 &&
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                usuariosReturn.map((usuario, key) => {
                                    return (
                                        <tr
                                            style={{ cursor: 'pointer' }}
                                            key={key}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                this.seleccionado(usuario)

                                            }}
                                        >
                                            <td>{usuario.id}</td>
                                            <td>{usuario.group}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                }

            </>
        )
    }
}
