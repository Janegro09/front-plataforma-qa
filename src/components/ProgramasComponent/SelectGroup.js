import React, { Component } from "react";
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

class SelectGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            groups: null,
            groupSelect: [],
            groupsToSend: "",
            loading: false,
            actualPage: 1,
            usuariosReturn: [],
            allUsers: null,
            usuariosSeleccionados: []
        };

    }

    handleInputChange = (value) => {
        let contacatenada = ""

        if (value !== null) {
            value.map(v => {
                if (contacatenada === "") {
                    contacatenada += v.value
                } else {
                    contacatenada += `|${v.value}`
                }
                return true;
            })
        }

        this.setState({
            groupsToSend: contacatenada
        })
    };

    searchDefault() {
        let { allUsers } = this.state
        let { defaultValue } = this.props

        let defaultUsuarios = []

        if (defaultValue) {
            allUsers.map(user => {
                for (let i = 0; i < defaultValue.length; i++) {
                    if (user.idDB === defaultValue[i].idDB) {
                        defaultUsuarios.push(user);
                    }
                }

                return true;
            })

            this.setState({
                usuariosSeleccionados: defaultUsuarios
            })
        }

    }

    seleccionado = (usuario) => {
        let { usuariosSeleccionados } = this.state
        usuariosSeleccionados.push(usuario)
        this.setState({
            usuariosSeleccionados
        })
    }

    quitarUsuario = (usuario) => {
        let { usuariosSeleccionados } = this.state
        let { idGroup } = this.props
        let newArray = []
        usuariosSeleccionados.map(user => {
            if (user.id !== usuario.id) {
                newArray.push(user)
            }
            return true;
        })

        if (idGroup) {
            let token = JSON.parse(sessionStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            axios.delete(
                Global.getAllProgramsGroups + '/' + idGroup + '/' + usuario.idDB,
                config
            ).then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                // this.setState({
                //     redirect: true
                // })
                swal("Genial!", "Usuario desasignado", "success");
            }).catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
        }

        this.setState({
            usuariosSeleccionados: newArray
        })
    }

    buscar = () => {
        let searched
        if (this.searched && this.searched !== undefined) {
            searched = this.searched.value.toLocaleLowerCase();
            const { allUsers } = this.state;

            let returnData = allUsers.filter(user => user.group.toLowerCase().includes(searched));

            this.setState({
                usuariosReturn: returnData
            });
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        axios.get(Global.getGroups, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                allUsers: response.data.Data,
                loading: false
            })

            this.searchDefault();

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos

                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        error: true,
                        redirect: true,
                        loading: false
                    })
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });

    }

    render() {
        let { usuariosReturn, usuariosSeleccionados } = this.state;
        let arrayAEnviar = [];

        usuariosSeleccionados.map(usuario => {
            arrayAEnviar.push(usuario.id)
            return true;
        })

        this.props.getValue(arrayAEnviar);


        return (
            <div>
                {this.state.loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }



                <div>
                    {usuariosSeleccionados &&
                        usuariosSeleccionados.map((usuario, key) => {
                            return (
                                <div className="etiquetas">
                                    <div className="etiqueta" key={key}>
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
                    className="form-control"
                    type="text"
                    placeholder="Buscar"
                    ref={(c) => {
                        this.searched = c
                    }}
                    onChange={this.buscar}
                />
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuariosReturn &&
                            usuariosReturn.map((usuario, key) => {
                                console.log('usuario: ', usuario);
                                return (
                                    <tr key={key} onClick={(e) => {
                                        e.preventDefault()
                                        this.seleccionado(usuario)
                                    }}>
                                        <td>{usuario.id}</td>
                                        <td>{usuario.group}</td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>
        );
    }
}
export default SelectGroup;
