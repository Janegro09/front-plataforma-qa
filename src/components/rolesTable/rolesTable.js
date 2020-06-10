import React, { Component } from 'react'
import './rolesTable.css'
import { Redirect } from 'react-router-dom'
import Global from '../../Global'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';


export default class RolesTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            term: '',
            encontrado: null,
            editUser: false,
            addUser: false,
            deleteUser: false,
            userSelected: null,
            allGroups: null,
            searched: false,
            error: false,
            redirect: false,
            changePassword: false,
            actualPage: 1,
            searchedUsers: [],
            createGroup: false
        }

        this.buscar = this.buscar.bind(this)
        this.editUser = this.editUser.bind(this)
        this.addUser = this.addUser.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.logout = this.logout.bind(this)
        this.getUsersPage = this.getUsersPage.bind(this)
        this.createGroup = this.createGroup.bind(this)
    }

    buscar() {
        let searched
        if (this.title && this.title !== undefined) {
            searched = this.title.value.toUpperCase()
        }
        let returnData = []
        this.state.allGroups.map(group => {
            if (searched !== undefined) {
                group.role = group.role.toUpperCase()
                if (group.role.indexOf(searched) >= 0) {
                    returnData.push(group)
                }
            } else {
                returnData.push(group)
            }
            return true
        })

        this.setState({
            searchedUsers: returnData
        })
    }
    editUser(event, userInfo) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        this.setState({
            editUser: true,
            userSelected: userInfo
        })

    }

    deleteUser(event, userInfo) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        this.setState({
            deleteUser: true,
            userSelected: userInfo
        })

    }

    addUser(event) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        this.setState({
            addUser: true
        })
    }

    changePassword(event) {
        event.preventDefault()
        this.setState({
            changePassword: true
        })
    }

    logout() {
        sessionStorage.setItem("userData", '')
        sessionStorage.setItem("token", '')
        sessionStorage.clear()
        this.setState({ redirect: true })
    }

    getUsersPage(page, allGroups) {
        let total = []
        let cantOfPages = 0
        if (allGroups !== null) {
            const cantPerPage = 12
            cantOfPages = Math.ceil(allGroups.length / cantPerPage)

            let index = (page - 1) * cantPerPage
            let acum = index + cantPerPage
            if (acum > allGroups.length) {
                acum = allGroups.length
            }
            while (index < acum) {
                total.push(allGroups[index])
                index++
            }
        }
        return {
            total: total,
            cantOfPages: cantOfPages
        }
    }

    createGroup() {
        console.log("Crear grupo")
        this.setState({
            createGroup: true
        })
    }

    componentDidMount() {
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getRoles, { headers: { Authorization: bearer } }).then(response => {
            this.setState({
                allGroups: response.data.Data
            })
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.buscar()
        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                this.setState({
                    error: true,
                    redirect: true
                })
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {

        const allGroups = this.state.searchedUsers
        let pagina = this.getUsersPage(this.state.actualPage, allGroups)
        let totalUsuarios = pagina.total
        let botones = []
        for (let index = 0; index < pagina.cantOfPages; index++) {
            if (botones.length < 4) {
                botones.push(
                    <button key={index} onClick={() => {
                        this.setState({
                            actualPage: index + 1
                        })
                    }}>
                        {index + 1}
                    </button>
                )
            } else {
                botones.push(
                    <button key={index - 1} disabled> ... </button>
                )
                break
            }
        }
        if (botones.length < pagina.cantOfPages) {
            botones.push(
                <button key={botones.length} onClick={() => {
                    this.setState({
                        actualPage: pagina.cantOfPages
                    })
                }}>
                    {pagina.cantOfPages}
                </button>
            )
        }

        if (this.state.redirect) {
            return <Redirect to={'/home'} />
        }
        // Si se selecciono editar usuario lo envío a la página editUser con los datos del usuario
        if (this.state.editUser) {
            return <Redirect to={{
                pathname: '/editRole',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (this.state.addUser) {
            return <Redirect to="/addRole"
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (this.state.changePassword) {
            return <Redirect to="/changePassword"
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (this.state.deleteUser) {
            return <Redirect to={{
                pathname: '/deleteRole',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        return (
            <div>

                <div className="table-users">

                    <div className="flex-input-add">
                        {/* Buscador */}
                        {HELPER_FUNCTIONS.checkPermission("GET|roles/:id") &&
                            <input
                                className="form-control"
                                type="text"
                                ref={(c) => {
                                    this.title = c
                                }}
                                placeholder="Buscar"
                                onChange={this.buscar}
                            />
                        }

                        {
                        // HELPER_FUNCTIONS.checkPermission("POST|roles/new") &&
                            <button onClick={e => this.addRole(e)}><PersonAddIcon style={{ fontSize: 33 }} /></button>
                        }


                        {this.state.error &&
                            <h1>Hubo un error en la búsqueda, inténtalo más tarde</h1>
                        }
                    </div>

                    <table cellSpacing="0">

                        {/* {this.state.allUsers === null &&
                            <div className="sk-fading-circle">
                                <div className="sk-circle1 sk-circle"></div>
                                <div className="sk-circle2 sk-circle"></div>
                                <div className="sk-circle3 sk-circle"></div>
                                <div className="sk-circle4 sk-circle"></div>
                                <div className="sk-circle5 sk-circle"></div>
                                <div className="sk-circle6 sk-circle"></div>
                                <div className="sk-circle7 sk-circle"></div>
                                <div className="sk-circle8 sk-circle"></div>
                                <div className="sk-circle9 sk-circle"></div>
                                <div className="sk-circle10 sk-circle"></div>
                                <div className="sk-circle11 sk-while (true) {
                    <h1>Hola</h1>
                }circle"></div>
                                <div className="sk-circle12 sk-circle"></div>
                            </div>
                        } */}

                        <thead className="encabezadoTabla">
                            <tr>
                                <th>Rol</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {console.log('andaa2', totalUsuarios)}
                            {
                            // totalUsuarios &&
                                totalUsuarios.map((role, index) => {
                                    console.log('andaa', role)
                                    return (
                                        <tr key={index}>
                                            <td>{role.role}</td>
                                            {HELPER_FUNCTIONS.checkPermission("PUT|roles/:id") &&
                                                <td onClick={e => this.editUser(e, role)}><EditIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("PUT|roles/:id") &&
                                                <td disabled><EditIcon></EditIcon></td>
                                            }
                                            {HELPER_FUNCTIONS.checkPermission("DELETE|roles/:id") &&
                                                <td onClick={e => this.deleteUser(e, role)}><DeleteIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("DELETE|roles/:id") &&
                                                <td disabled><DeleteIcon></DeleteIcon></td>
                                            }

                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    <div className="botones">
                        {this.state.actualPage > 1 &&
                            <button onClick={() => {
                                this.setState({
                                    actualPage: this.state.actualPage - 1
                                })
                            }}>◄</button>
                        }

                        {botones}

                        {this.state.actualPage !== pagina.cantOfPages &&
                            <button onClick={() => {
                                this.setState({
                                    actualPage: this.state.actualPage + 1
                                })
                            }}>►</button>
                        }

                    </div>
                </div>
            </div>
        )
    }
}
