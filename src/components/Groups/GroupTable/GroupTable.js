import React, { Component } from 'react'
import './GroupTable.css'
import { Redirect } from 'react-router-dom'
import Global from '../../../Global'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



export default class GroupsTable extends Component {
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
            totalDisplayed : 15
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
        document.getElementById('ver-mas-grupos').focus();
    }

    getUsersPage = (page, allGroups) => {
        let total = []
        let cantOfPages = 0
        if (allGroups !== null) {
            const cantPerPage = 200
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

    componentDidMount() {
        HELPER_FUNCTIONS.set_page_title('Groups');
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getGroups, { headers: { Authorization: bearer } }).then(response => {
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
                pathname: '/editGroup',
                state: { userSelected: this.state.userSelected }
            }}
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
                pathname: '/deleteGroup',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        if (this.state.createGroup) {
            return <Redirect to={{
                pathname: '/createGroup',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        return (
            <div>
                {!this.state.allGroups &&
                    <React.Fragment>
                        {HELPER_FUNCTIONS.backgroundLoading()}
                    </React.Fragment>
                }

                <div className="tabla_parent">
                    <h4 className="headerSection">GRUPOS</h4>
                    <hr />
                    <br />
                    <div className="flex-input-add">
                        {/* Buscador */}
                        {HELPER_FUNCTIONS.checkPermission("GET|groups/:id") &&
                            <input
                                className="form-control"
                                type="text"
                                ref={(c) => {
                                    this.title = c
                                }}
                                placeholder="Buscar grupo"
                                onChange={this.buscar}
                            />
                        }

                        {/* {HELPER_FUNCTIONS.checkPermission("POST|groups/new") && */}
                        <button className="addItem morph" onClick={e => this.createGroup(e)}><GroupAddIcon className="svgAddButton" style={{ fontSize: 33 }} /></button>
                        {/* } */}



                        {this.state.error &&
                            <h1>Hubo un error en la búsqueda, inténtalo más tarde</h1>
                        }
                    </div>

                    <table cellSpacing="0">

                        {this.state.allUsers === null &&
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

                        <thead className="encabezadoTabla">
                            <tr>

                                <th>Nombre</th>
                                <th className="tableIcons">Editar</th>
                                <th className="tableIcons">Eliminar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {totalUsuarios &&

                                totalUsuarios.slice(0, totalDisplayed).map((group, index) => {

                                    return (
                                        <tr key={index}>

                                            <td>{group.group}</td>
                                            {HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") &&
                                                <td className="celdaBtnHover" onClick={e => this.editUser(e, group)}><EditIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") &&
                                                <td disabled><EditIcon></EditIcon></td>
                                            }
                                            {HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") &&
                                                <td className="celdaBtnHover" onClick={e => this.deleteUser(e, group)}><DeleteIcon style={{ fontSize: 15 }} /></td>
                                            }
                                            {!HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") &&
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
                            onClick={() => this.showMore()}
                        >
                           <ExpandMoreIcon />
                        </div>

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
