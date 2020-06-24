import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../userAdminHeader/userAdminHeader'
import swal from 'sweetalert'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import Global from '../../Global'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import './ProgramsComponent.css';

export default class ProgramasComponent extends Component {
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
                group.group = group.group.toUpperCase()
                if (group.group.indexOf(searched) >= 0) {
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
            const cantPerPage = 25
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
    render() {
        const allGroups = this.state.searchedUsers
        let pagina = this.getUsersPage(this.state.actualPage, allGroups)
        let totalUsuarios = pagina.total
        let botones = []
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>
                {/* {this.state.loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                } */}

                <div className="section-content">
                    <div className="table-users">

                        <div className="flex-input-add">
                            {/* Buscador */}
                            {/* {HELPER_FUNCTIONS.checkPermission("GET|groups/:id") && */}
                            <input
                                className="form-control"
                                type="text"
                                ref={(c) => {
                                    this.title = c
                                }}
                                placeholder="Buscar programa"
                                onChange={this.buscar}
                            />
                            {/* } */}

                            {/* {HELPER_FUNCTIONS.checkPermission("POST|groups/new") && */}
                            <button onClick={e => this.createGroup(e)}><GroupAddIcon style={{ fontSize: 33 }} /></button>
                            {/* } */}



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

                                    <th>Nombre</th>
                                    <th className="tableIcons">Editar</th>
                                    <th className="tableIcons">Eliminar</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* {totalUsuarios &&

                                totalUsuarios.map((group, index) => {

                                    return (
                                        <tr key={index}>

                                            <td>{group.group}</td>
                                            {HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") &&
                                                <td onClick={e => this.editUser(e, group)}><EditIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") &&
                                                <td disabled><EditIcon></EditIcon></td>
                                            }
                                            {HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") &&
                                                <td onClick={e => this.deleteUser(e, group)}><DeleteIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") &&
                                                <td disabled><DeleteIcon></DeleteIcon></td>
                                            }

                                        </tr>
                                    )
                                })
                            } */}

                                <tr key="{1}">

                                    <td>dsadssad</td>
                                    {/* {HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") && */}
                                    <td><EditIcon style={{ fontSize: 15 }} /></td>
                                    {/* }   */}
                                    {/* {!HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") && */}
                                    <td disabled><DeleteIcon></DeleteIcon></td>
                                    {/* } */}

                                </tr>
                                <tr key="{1}">

                                    <td>dsadssad</td>
                                    {/* {HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") && */}
                                    <td><EditIcon style={{ fontSize: 15 }} /></td>
                                    {/* }   */}
                                    {/* {!HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") && */}
                                    <td disabled><DeleteIcon></DeleteIcon></td>
                                    {/* } */}

                                </tr>
                                <tr key="{1}">

                                    <td>dsadssad</td>
                                    {/* {HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") && */}
                                    <td><EditIcon style={{ fontSize: 15 }} /></td>
                                    {/* }   */}
                                    {/* {!HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") && */}
                                    <td disabled><DeleteIcon></DeleteIcon></td>
                                    {/* } */}

                                </tr>
                                <tr key="{1}">

                                    <td>dsadssad</td>
                                    {/* {HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") && */}
                                    <td><EditIcon style={{ fontSize: 15 }} /></td>
                                    {/* }   */}
                                    {/* {!HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") && */}
                                    <td disabled><DeleteIcon></DeleteIcon></td>
                                    {/* } */}

                                </tr>
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
                {/* section */}
            </div>
        )
    }
}
