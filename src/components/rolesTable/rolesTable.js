import React, { Component } from 'react'
import './rolesTable.css'
import { Redirect } from 'react-router-dom'
import Global from '../../Global'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

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
            createGroup: false,
            totalDisplayed: 15
        }
    }

    buscar = () => {
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
            searchedUsers: returnData,
            actualPage: 1
        })
    }

    editUser = (event, userInfo) => {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()

        this.setState({
            editUser: true,
            userSelected: userInfo
        })

    }

    deleteUser = (event, userInfo) => {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        this.setState({
            deleteUser: true,
            userSelected: userInfo
        })

    }

    addUser = (event) => {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        this.setState({
            addUser: true
        })
    }

    changePassword = (event) => {
        event.preventDefault()
        this.setState({
            changePassword: true
        })
    }

    logout = () => {
        localStorage.setItem("userData", '')
        localStorage.setItem("token", '')
        localStorage.clear()
        this.setState({ redirect: true })
    }

    showMore = () => {
        let { totalDisplayed } = this.state;
        totalDisplayed += 10;
        this.setState({ totalDisplayed });
        document.getElementById('ver-mas-roles').focus();
    }

    getUsersPage = (page, allGroups) => {
        let total = []
        let cantOfPages = 0
        if (allGroups !== null) {
            const cantPerPage = 15
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

    createGroup = () => {
        this.setState({
            createGroup: true
        })
    }

    addRole = () => {
        this.setState({
            createRole: true
        })
    }

    componentDidMount() {
        HELPER_FUNCTIONS.set_page_title('Roles');
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getRoles, { headers: { Authorization: bearer } }).then(response => {
            this.setState({
                allGroups: response.data.Data
            })
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
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
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    // swal("Error!", "Hubo un problema", "error");
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {
        const allGroups = this.state.searchedUsers
        let pagina = this.getUsersPage(this.state.actualPage, allGroups)
        let {totalDisplayed} = this.state
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

        if (this.state.createRole) {
            return <Redirect to={'/createRole'} />
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
            return <Redirect to="/createRole"
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
                {this.state.allGroups === null &&
                    <React.Fragment>
                        {HELPER_FUNCTIONS.backgroundLoading()}
                    </React.Fragment>
                }

                <div className="tabla_parent">
                    <h4 className="headerSection">ROLES</h4>
                    <hr />
                    <br />
                    <div className="flex-input-add">
                        {/* Buscador */}
                        {HELPER_FUNCTIONS.checkPermission("GET|roles/:id") &&
                            <input
                                className="form-control"
                                type="text"
                                ref={(c) => {
                                    this.title = c
                                }}
                                placeholder="Buscar rol"
                                onChange={this.buscar}
                            />
                        }

                        {
                            // HELPER_FUNCTIONS.checkPermission("POST|roles/new") &&
                            <button className="addItem morph" onClick={e => this.addRole(e)}><AddIcon className="svgAddButton" style={{ fontSize: 33 }} /></button>
                        }


                        {this.state.error &&
                            <h1>Hubo un error en la búsqueda, inténtalo más tarde</h1>
                        }
                    </div>

                    <table cellSpacing="0">
                        <thead className="encabezadoTabla">
                            <tr>
                                <th>Rol</th>
                                <th className="tableIcons">Editar</th>
                                <th className="tableIcons">Eliminar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {totalUsuarios &&
                                totalUsuarios.slice(0, totalDisplayed).map((role, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{role.role}</td>
                                            {HELPER_FUNCTIONS.checkPermission("PUT|roles/:id") &&
                                                <td className="celdaBtnHover" onClick={e => this.editUser(e, role)}><EditIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("PUT|roles/:id") &&
                                                <td disabled><EditIcon></EditIcon></td>
                                            }
                                            {HELPER_FUNCTIONS.checkPermission("DELETE|roles/:id") &&
                                                <td className="celdaBtnHover" onClick={e => this.deleteUser(e, role)}><DeleteIcon style={{ fontSize: 15 }} /></td>
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

                    {/* <div
                            id="ver-mas-roles"
                            className="ver-mas"
                            onClick={() => this.showMore()}
                        >
                            <ExpandMoreIcon />
                        </div> */}

                    {/* <div className="botones">
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

                    </div> */}
                </div>
            </div>
        )
    }
}
