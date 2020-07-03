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
        let groupData = []
        if (this.state.groupSelect.length > 0 && this.props.defaultValue && this.state.groupsToSend === '') {
            this.props.defaultValue.map(v => {
                this.state.groupSelect.map(value => {
                    if (value.value === v.idDB) {
                        groupData.push(value)
                    }
                    return true;
                })
                return true;
            })
            return groupData
        } else if (this.state.groupsToSend) {
            let temp
            temp = this.state.groupsToSend.split("|")
            temp.map(v => {
                this.state.groupSelect.map(value => {
                    if (value.value === v) {
                        groupData.push(value)
                    }
                    return true;
                })
                return true;
            })

            return groupData
        } else {
            return {
                label: "Seleccionar usuarios...",
                value: ""
            }
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
        let newArray = []
        usuariosSeleccionados.map(user => {
            if (user.id !== usuario.id) {
                newArray.push(user)
            }
            return true;
        })
        this.setState({
            usuariosSeleccionados: newArray
        })
    }

    buscar = () => {
        let searched
        if (this.searched && this.searched !== undefined) {
            searched = this.searched.value.toLocaleLowerCase()

            let returnData = []
            this.state.allUsers.map(user => {
                let nameLastName = `${user.name} ${user.lastName}`
                if (searched !== undefined) {
                    if (user.id.indexOf(searched) >= 0) {
                        returnData.push(user)
                    } else if (nameLastName.indexOf(searched) >= 0) {
                        returnData.push(user)
                    } else {
                        // Generamos parametros de busqueda 
                        let nameDividido = nameLastName.split(' ');
                        let busquedaDividida = searched.split(' ');
                        let coincide = 0;
                        for (let x = 0; x < nameDividido.length; x++) {
                            for (let y = 0; y < busquedaDividida.length; y++) {
                                if (nameDividido[x].indexOf(busquedaDividida[y]) >= 0) {
                                    coincide++;
                                }
                            }
                        }
                        if (coincide === busquedaDividida.length) {
                            returnData.push(user);
                        }
                    }
                } else {
                    returnData.push(user)
                }
                return true
            })

            let returnDataFiltered = []
            for (let i = 0; (i < 5) && (i < returnData.length); i++) {
                returnDataFiltered.push(returnData[i]);

            }
            this.setState({
                usuariosReturn: returnDataFiltered
            })
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        setTimeout(() => {
            const tokenUser = JSON.parse(sessionStorage.getItem("token"))
            const token = tokenUser
            const bearer = `Bearer ${token}`

            axios.get(Global.getUsers + '?specificdata=true', { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                let usuarios = []
                let data = response.data.Data
                for (let i = 0; i < data.length; i++) {
                    usuarios.push(data[i])
                }

                this.setState({
                    allUsers: usuarios,
                    loading: false
                })


                // console.log(usuarios)
                // response.data.Data.map(user => {
                //     let temp = {
                //         value: user.idDB,
                //         label: `${user.id} - ${user.name} ${user.lastName}`
                //     }
                //     usuarios.push(temp)
                //     return true;
                // })

                // this.setState({
                //     groupSelect: usuarios,
                //     loading: false
                // })

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
        }, 1000);

    }

    render() {
        let { usuariosReturn, usuariosSeleccionados } = this.state
        let arrayAEnviar = []
        usuariosSeleccionados.map(usuario => {
            arrayAEnviar.push(usuario.idDB)
            return true;
        })

        this.props.getValue(arrayAEnviar)


        return (
            <div>
                {this.state.loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }



                <div>
                    {usuariosSeleccionados &&
                        usuariosSeleccionados.map((usuario, key) => {
                            return (
                                <div key={key}>
                                    <p>{`${usuario.id} - ${usuario.name} ${usuario.lastName}`}</p>
                                    <button onClick={
                                        (e) => {
                                            e.preventDefault()
                                            this.quitarUsuario(usuario)
                                        }
                                    }>x</button>
                                </div>
                            )
                        })

                    }

                </div>

                <input type="text" placeholder="Buscar" ref={(c) => {
                    this.searched = c
                }} onChange={this.buscar} />
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuariosReturn &&
                            usuariosReturn.map((usuario, key) => {
                                return (
                                    <tr key={key} onClick={(e) => {
                                        e.preventDefault()
                                        this.seleccionado(usuario)
                                    }}>
                                        <td>{usuario.id}</td>
                                        <td>{usuario.name}</td>
                                        <td>{usuario.lastName}</td>
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
