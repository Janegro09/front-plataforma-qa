import React, { Component } from 'react'
import './UserTable.css'
import { Redirect } from 'react-router-dom'
import Global from '../../../Global'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';




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
                    } else if (user.legajo.indexOf(searched) >= 0) {
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
                }
            } else {
                returnData.push(user)
            }
            return true
        })

        this.setState({
            searchedUsers: returnData,
            actualPage: 1
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

    getUsersPage(page, allUsers) {
        let total = []
        let cantOfPages = 0
        if (allUsers !== null) {
            const cantPerPage = 12
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
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getUsers, { headers: { Authorization: bearer } }).then(response => {
            this.setState({
                allUsers: response.data.Data
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
        const allUsers = this.state.searchedUsers
        let pagina = this.getUsersPage(this.state.actualPage, allUsers)
        let totalUsuarios = pagina.total
        let botones = []

        for (let index = this.state.actualPage - 1; index < pagina.cantOfPages; index++) {
            if (botones.length < 4) {
                botones.push(
                    <button className={this.state.actualPage === index + 1 ? 'active' : ''} key={index} onClick={() => {
                        this.setState({
                            actualPage: index + 1
                        })
                    }}>
                        {index + 1}
                    </button>
                )
            }
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
                    <h4 className="marginBotton15">USUARIOS</h4>
                    <div className="flex-input-add">
                        {/* Buscador */}
                        {HELPER_FUNCTIONS.checkPermission("GET|users/:id") &&
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

                        {HELPER_FUNCTIONS.checkPermission("POST|users/new") &&
                            <button className="addItem" onClick={e => this.addUser(e)}><PersonAddIcon style={{ fontSize: 33 }} /></button>
                        }



                        {this.state.error &&
                            <h1>Hubo un error en la búsqueda, inténtalo más tarde</h1>
                        }
                    </div>

                    {this.state.allUsers === null &&
                        <React.Fragment>
                            {HELPER_FUNCTIONS.backgroundLoading()}
                        </React.Fragment>
                    }
                    <table cellSpacing="0">



                        <thead className="encabezadoTabla">
                            <tr>
                                <th>ID</th>
                                <th>Nombre y apellido</th>
                                <th>Mail</th>
                                <th>Legajo</th>
                                <th>Sector</th>
                                <th className="tableIcons">Estado</th>
                                <th className="tableIcons">Editar</th>
                                <th className="tableIcons">Eliminar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {totalUsuarios &&

                                totalUsuarios.map(user => {
                                    return (
                                        <tr key={user.idDB}>
                                            <td >{user.id}</td>
                                            <td className="capitalize-complete-name">{user.name} {user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.legajo}</td>
                                            <td>{user.equipoEspecifico}</td>
                                            <td className="tablaVariables"><div className={` ${!user.userActive ? "estadoInactivo " : 'estadoActivo'}`}></div></td>
                                            {HELPER_FUNCTIONS.checkPermission("POST|users/:id") &&
                                                <td onClick={e => this.editUser(e, user)}><EditIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("POST|users/:id") &&
                                                <td disabled><EditIcon></EditIcon></td>
                                            }
                                            {HELPER_FUNCTIONS.checkPermission("DELETE|users/:id") &&
                                                <td onClick={e => this.deleteUser(e, user)}><DeleteIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("DELETE|users/:id") &&
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

                    {this.state.allUsers &&
                        <div className="cantUsuarios">Cantidad de usuarios: {this.state.allUsers.length}</div>
                    }
                </div>
            </div>
        )
    }
}
