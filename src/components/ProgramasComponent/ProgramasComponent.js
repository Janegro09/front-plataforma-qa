import React, { Component } from 'react'
// import './GroupTable.css'
import { Redirect } from 'react-router-dom'
import Global from '../../Global'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SiderBarLeft from '../SidebarLeft/SiderbarLeft'



export default class GroupsTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            term: '',
            encontrado: null,
            editProgram: false,
            addUser: false,
            deleteProgram: false,
            userSelected: null,
            allPrograms: null,
            searched: false,
            error: false,
            redirect: false,
            changePassword: false,
            actualPage: 1,
            searchedUsers: [],
            createProgram: false
        }

        this.buscar = this.buscar.bind(this)
        this.editProgram = this.editProgram.bind(this)
        this.addUser = this.addUser.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.deleteProgram = this.deleteProgram.bind(this)
        this.logout = this.logout.bind(this)
        this.getUsersPage = this.getUsersPage.bind(this)
        this.createProgram = this.createProgram.bind(this)
    }

    buscar() {
        let searched
        if (this.title && this.title !== undefined) {
            searched = this.title.value.toUpperCase()
        }
        let returnData = []
        this.state.allPrograms.map(program => {
            // console.log(`Programa en map: ${group.group}`)
            if (searched !== undefined) {
                program.group = program.name.toUpperCase()
                if (program.group.indexOf(searched) >= 0) {
                    returnData.push(program)
                }
            } else {
                returnData.push(program)
            }
            return true
        })

        this.setState({
            searchedUsers: returnData,
            actualPage: 1
        })
    }

    editProgram(event, userInfo) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        // alert("Editar programa");
        this.setState({
            editProgram: true,
            userSelected: userInfo
        })

    }

    deleteProgram(event, userInfo) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        this.setState({
            deleteProgram: true,
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

    getUsersPage(page, allPrograms) {
        let total = []
        let cantOfPages = 0
        if (allPrograms !== null) {
            const cantPerPage = 25
            cantOfPages = Math.ceil(allPrograms.length / cantPerPage)

            let index = (page - 1) * cantPerPage
            let acum = index + cantPerPage
            if (acum > allPrograms.length) {
                acum = allPrograms.length
            }
            while (index < acum) {
                total.push(allPrograms[index])
                index++
            }
        }
        return {
            total: total,
            cantOfPages: cantOfPages
        }
    }

    createProgram() {
        console.log("Crear grupo")
        this.setState({
            createProgram: true
        })
    }

    componentDidMount() {
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
            this.setState({
                allPrograms: response.data.Data
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
                // if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                //     HELPER_FUNCTIONS.logout()
                // } else {
                //     sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                //     swal("Error!", "Hubo un problema", "error");
                // }
                console.log("Error: ", e)
            });
    }

    render() {
        const allPrograms = this.state.searchedUsers
        let pagina = this.getUsersPage(this.state.actualPage, allPrograms)
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
        // Si se selecciono editar usuario lo envío a la página editProgram con los datos del usuario
        if (this.state.editProgram) {
            return <Redirect to={{
                pathname: '/editarPrograma',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteProgram con los datos del usuario
        // if (this.state.addUser) {
        //     return <Redirect to="/addUser"
        //     />
        // }

        // Si se selecciono borrar usuario lo envío a la página deleteProgram con los datos del usuario
        if (this.state.changePassword) {
            return <Redirect to="/changePassword"
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteProgram con los datos del usuario
        if (this.state.deleteProgram) {
            return <Redirect to={{
                pathname: '/borrarPrograma',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        if (this.state.createProgram) {
            return <Redirect to={{
                pathname: '/crearPrograma',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        return (
            <div>
                <SiderBarLeft />
                {!this.state.allPrograms &&
                    <React.Fragment>
                        {HELPER_FUNCTIONS.backgroundLoading()}
                    </React.Fragment>
                }

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
                            <button onClick={e => this.createProgram(e)}><GroupAddIcon style={{ fontSize: 33 }} /></button>
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

                                    totalUsuarios.map((group, index) => {

                                        return (
                                            <tr key={index}>

                                                <td>{group.group}</td>
                                                {/* {HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") && */}
                                                    <td onClick={e => this.editProgram(e, group)}><EditIcon style={{ fontSize: 15 }} /></td>
                                                {/* } */}
                                                {/* {!HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") &&
                                                    <td disabled><EditIcon></EditIcon></td>
                                                } */}
                                                {/* {HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") && */}
                                                    <td onClick={e => this.deleteProgram(e, group)}><DeleteIcon style={{ fontSize: 15 }} /></td>
                                                {/* } */}
                                                {/* {!HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") &&
                                                    <td disabled><DeleteIcon></DeleteIcon></td>
                                                } */}

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
            </div>
        )
    }
}
