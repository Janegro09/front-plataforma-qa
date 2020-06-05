import React, { Component } from 'react'
import './UserTable.css'
import { Redirect } from 'react-router-dom'
import Global from '../../Global'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

export default class UserTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            term: '',
            encontrado: null,
            editUser: false,
            addUser: false,
            deleteUser: false,
            userSelected: null,
            allUsers: null,
            searched: false,
            error: false,
            redirect: false,
            changePassword: false,
            actualPage: 1,
            searchedUsers: []
        }

        this.buscar = this.buscar.bind(this)
        this.editUser = this.editUser.bind(this)
        this.addUser = this.addUser.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.logout = this.logout.bind(this)
        this.getUsersPage = this.getUsersPage.bind(this)
    }

    buscar() {
        let searched
        if (this.title && this.title !== undefined) {
            searched = this.title.value
        }
        let returnData = []
        this.state.allUsers.map(user => {
            let nameLastName = `${user.name} ${user.lastName}`
            if (searched !== undefined) {
                if (searched.indexOf('@') >= 0) {
                    if (user.email.indexOf(searched) >= 0) {
                        returnData.push(user)
                    }
                } else {
                    if (user.id.indexOf(searched) >= 0) {
                        returnData.push(user)
                    } else if (nameLastName.indexOf(searched) >= 0) {
                        returnData.push(user)
                    }
                }
            } else {
                returnData.push(user)
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
        localStorage.setItem("userData", '')
        localStorage.setItem("token", '')
        localStorage.clear()
        this.setState({ redirect: true })
    }

    getUsersPage(page, allUsers) {
        let total = []
        let cantOfPages = 0
        if (allUsers !== null) {
            const cantPerPage = 25
            cantOfPages = Math.ceil(allUsers.length / cantPerPage)

            let index = (page - 1) * cantPerPage
            let acum = index + cantPerPage
            if (acum > allUsers.length) {
                acum = allUsers.length
            }
            while (index < acum) {
                total.push(allUsers[index])
                index++
            }
        }
        return {
            total: total,
            cantOfPages: cantOfPages
        }
    }

    componentDidMount() {
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getUsers, { headers: { Authorization: bearer } }).then(response => {

            this.setState({
                allUsers: response.data.Data
            })
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.buscar()
        })
            .catch((error) => {
                // Si hay algún error en el request lo deslogueamos
                this.setState({
                    error: true,
                    redirect: true
                })
                console.log('error ' + error);
                this.logout()
            });
    }

    render() {

        const allUsers = this.state.searchedUsers
        let pagina = this.getUsersPage(this.state.actualPage, allUsers)
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
                pathname: '/editUser',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (this.state.addUser) {
            return <Redirect to="/addUser"
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
                pathname: '/deleteUser',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        return (
            <div>
                 
                <div className="table-users">

                <div className="flex-input-add">   
                {/* Buscador */}
                {HELPER_FUNCTIONS.checkPermission("GET|users/:id") &&
                    <input
                    className="form-control"
                        type="text"
                        ref={(c) => {
                            this.title = c
                        }}
                        placeholder="Ingrese el número de id"
                        onChange={this.buscar}
                    />
                }

                {HELPER_FUNCTIONS.checkPermission("POST|users/new") &&
                    <button onClick={e => this.addUser(e)} className="btn  btn-info ripple-effect btnCrear">Crear Usuario</button>
                }

                {this.state.searched && this.state.encontrado === null && !this.state.error &&
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
                }

                {this.state.error &&
                    <h1>Hubo un error en la búsqueda, inténtalo más tarde</h1>
                }
                </div>

                    <table cellSpacing="0">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Nombre y apellido</th>
                                <th>Mail</th>
                                <th>Sector</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {totalUsuarios &&

                                totalUsuarios.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{user.id}</td>
                                            <td>{user.name} {user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.equipoEspecifico}</td>
                                            {HELPER_FUNCTIONS.checkPermission("POST|users/:id") &&
                                                <td onClick={e => this.editUser(e, user)}>icono-edit</td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("POST|users/:id") &&
                                                <td disabled>icono-edit</td>
                                            }
                                            {HELPER_FUNCTIONS.checkPermission("DELETE|users/:id") &&
                                                <td onClick={e => this.deleteUser(e, user)}>icono-delete</td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("DELETE|users/:id") &&
                                                <td disabled>icono-delete</td>
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
                            }}>Página anterior</button>
                        }

                        {botones}

                        {this.state.actualPage !== pagina.cantOfPages &&
                            <button onClick={() => {
                                this.setState({
                                    actualPage: this.state.actualPage + 1
                                })
                            }}>Página siguiente</button>
                        }

                    </div>
                </div>
            </div>
        )
    }
}
