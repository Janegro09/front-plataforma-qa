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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChangePassword from '../../changePassword/ChangePassword'



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
            allUsers: [],
            searched: false,
            error: false,
            redirect: false,
            changePassword: false,
            actualPage: 1,
            searchedUsers: [],
            totalDisplayed: 15,
            loading: false,
            search_params: { limit: 10, offset: 0, q: "" }
        }
    }

    init_search_params = (q) => {
        const aux = { limit: 10, offset: 0, q };
        this.setState({search_params: aux, allUsers: []})
        return aux
    }

    dynamicSort = (property) => {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return (a, b) => {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    ascDesc = (field) => {
        let { allUsers } = this.state
        let dataOrdenada = allUsers.sort(this.dynamicSort(field));
        this.setState({
            searchedUsers: dataOrdenada
        })
    }

    buscar = () => {
        let searched
        if (this.title && this.title !== undefined) {
            searched = this.title.value.toLowerCase();

            this.get_users(this.init_search_params(searched));

        }
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
        this.get_users();
    }


    get_users = (search_params = false) => {
        this.setState({ loading: true })
        HELPER_FUNCTIONS.set_page_title('Usuarios');
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        let url_with_params = Global.getUsers;

        // Ponemos un codicional, por si el usuario buscó entonces renovamos el array
        let renovar_array = false;
        if(search_params.q) {
            renovar_array = true;
        }

        if(!search_params) {
            search_params = this.state.search_params
        }

        for(let p in search_params) {
            if(!search_params[p]) continue;
            url_with_params += url_with_params.includes('?') ? "&" : "?";
            url_with_params += `${p}=${search_params[p]}`
        }
        axios.get(url_with_params, { headers: { Authorization: bearer } }).then(response => {

            const allUsers = renovar_array ? response.data.Data : [...this.state.allUsers,...response.data.Data];
            search_params.offset = allUsers.length;
            this.setState({
                allUsers,
                search_params,
                loading: false
            })
        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                this.setState({ loading: false });
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
<<<<<<< HEAD
                    swal("Error", "No hay mas usuarios para mostrar", "error");
=======
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", `${e.response.data.Message}`, "error");
                    // swal("Error!", "Hubo un problema", "error");
>>>>>>> origin/master
                }
                console.log("Error: ", e)
            });
    }

    componentDidMount() {
        this.get_users();
    }

    render() {
        let { allUsers, redirect, editUser, userSelected, addUser, changePassword, deleteUser, loading } = this.state

        if (redirect) {
            return <Redirect to='/home' />
        }

        if (editUser) {
            return <Redirect to={{
                pathname: '/editUser',
                state: { userSelected }
            }}
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (addUser) {
            return <Redirect to="/addUser"
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (changePassword) {
            return <Redirect to="/changePassword"
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (deleteUser) {
            return <Redirect to={{
                pathname: '/deleteUser',
                state: { userSelected }
            }}
            />
        }

        return (
            <div>

                <div className="tabla_parent">
<div>
                    <h4 className="headerSection">USUARIOS</h4>
                    <hr />
                    <br />
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
                                onBlur={this.buscar}
                            />
                        }

                        {HELPER_FUNCTIONS.checkPermission("POST|users/new") &&

                            <button className="addItem morph" onClick={e => this.addUser(e)}><PersonAddIcon className="svgAddButton" style={{ fontSize: 33 }} /></button>
                        }



                        {this.state.error &&
                            <h1>Hubo un error en la búsqueda, inténtalo más tarde</h1>
                        }
                    </div>
                </div>
                    {loading &&
                        <React.Fragment>
                            {HELPER_FUNCTIONS.backgroundLoading()}
                        </React.Fragment>
                    }
                    <table cellSpacing="0">



                        <thead className="encabezadoTabla">
                            <tr>
                                <th onClick={(e) => {
                                    e.preventDefault()
                                    this.ascDesc("id")
                                }}>ID</th>
                                <th onClick={(e) => {
                                    e.preventDefault()
                                    this.ascDesc("name")
                                }}>Nombre y apellido</th>
                                <th onClick={(e) => {
                                    e.preventDefault()
                                    this.ascDesc("canal")
                                }}>Canal</th>
                                <th>Mail</th>
                                <th>Legajo</th>
                                <th onClick={(e) => {
                                    e.preventDefault()
                                    this.ascDesc("razonSocial")
                                }}>Empresa</th>
                                <th>Sector</th>
                                <th className="tableIcons">Estado</th>
                                <th className="tableIcons">Cambiar contraseña</th>
                                <th className="tableIcons">Editar</th>
                                <th className="tableIcons">Eliminar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allUsers &&

                                allUsers.map(user => {
                                    return (
                                        <tr id="parent" key={user.idDB}>
                                            <td >{user.id}</td>
                                            <td className="capitalize-complete-name">{user.name} {user.lastName}</td>
                                            <td>{user.canal}</td>
                                            <td>{user.email}</td>
                                            <td>{user.legajo}</td>
                                            <td>{user.razonSocial}</td>
                                            <td>{user.equipoEspecifico}</td>
                                            <td className="tablaVariables"><div className={` ${!user.userActive ? "estadoInactivo " : 'estadoActivo'}`}></div></td>
                                            {HELPER_FUNCTIONS.checkPermission('POST|users/passchange/:id') &&
                                                <td>
                                                    <ChangePassword user={user} />
                                                </td>
                                            }
                                            {HELPER_FUNCTIONS.checkPermission("POST|users/:id") &&
                                                <td id="child" className="celdaBtnHover" onClick={e => this.editUser(e, user)}><EditIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("POST|users/:id") &&
                                                <td disabled><EditIcon></EditIcon></td>
                                            }
                                            {HELPER_FUNCTIONS.checkPermission("DELETE|users/:id") &&
                                                <td id="child2" className="celdaBtnHover" onClick={e => this.deleteUser(e, user)}><DeleteIcon style={{ fontSize: 15 }} /></td>
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
                    <div
                        id="ver-mas-grupos"
                        className="ver-mas"
                        onClick={this.showMore}
                    >
                        <ExpandMoreIcon />
                    </div>
                </div>
            </div>
        )
    }
}
