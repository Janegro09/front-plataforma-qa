import React, { Component } from 'react'
// import './GroupTable.css'
import { Redirect } from 'react-router-dom'
import './ProgramsComponent.css';
import Global from '../../Global'
import axios from 'axios'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SiderBarLeft from '../SidebarLeft/SiderbarLeft'
import ProgramsGroupComponent from './ProgramsGroupComponent'
import Logo from '../Home/logo_background.png';



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
            createProgram: false,
            ok: false,
            buscando: false
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
        this.setState({
            buscando: true
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

    deleteProgram = (event, userInfo) => {
        // Cargo en el estado la información del usuario seleccionado
        console.log(event)
        event.preventDefault()
        console.log(userInfo)
        // event.preventDefault()
        let token = JSON.parse(sessionStorage.getItem('token'));
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        swal({
            title: "Estás seguro?",
            text: "Una vez borrado el programa, no podrás recuperarlo!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete(Global.getAllPrograms + '/' + userInfo.id, config).then(response => {
                        sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                        if (response.data.Success) {
                            swal("Genial! el programa se ha eliminado correctamente", {
                                icon: "success",
                            });
                        }
                    }).catch(e => {
                        if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                            HELPER_FUNCTIONS.logout()
                        } else {
                            sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                            swal("Error!", "Hubo un problema al agregar el usuario", "error");
                        }
                        console.log("Error: ", e)
                    })
                } else {
                    swal("Ok, no has borrado nada");
                }
            });


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
        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
            console.log("ramagon")
            console.log(response)

            // console.log("El token: ", response.data.loggedUser.token)
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                allPrograms: response.data.Data,
                ok: true
            })
            console.log("El token: ", JSON.parse(sessionStorage.getItem('token')))
            // this.buscar()
        })
            .catch((e) => {
                console.log("Error")
                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                this.setState({
                    allPrograms: [],
                    ok: true
                })
                console.log("Error: ", e)
            });
    }

    render() {
        const { allPrograms } = this.state
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

        // Si se selecciono editar usuario lo envío a la página editProgram con los datos del usuario
        if (this.state.editProgram) {
            return <Redirect to={{
                pathname: '/editarPrograma',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

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

        return (
            <div>
                <div className="logoBackground">
                    <img src={Logo} alt="Logo" title="Logo" className="logoFixed" />
                </div>
                <SiderBarLeft />
                {!this.state.allPrograms &&
                    <React.Fragment>
                        {HELPER_FUNCTIONS.backgroundLoading()}
                    </React.Fragment>
                }

                <div className="section-content doble-section">
                    {!this.state.createProgram &&
                        <div className="table-users ">
                            <h3 className="marginBotton15">Programas</h3>
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
                                    {allPrograms &&

                                        allPrograms.filter(program => {
                                            if (this.title.value === '') {
                                                return true;
                                            } else {
                                                return program.name.toUpperCase().indexOf(this.title.value.toUpperCase()) >= 0;
                                            }
                                        }).map((program, index) => {

                                            return (
                                                <tr key={index}>

                                                    <td>{program.name}</td>
                                                    <td onClick={e => this.editProgram(e, program)}><EditIcon style={{ fontSize: 15 }} /></td>
                                                    <td onClick={e => this.deleteProgram(e, program)}><DeleteIcon style={{ fontSize: 15 }} /></td>
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
                    }

                    {this.state.createProgram &&
                        <div className="table-users table-users-edit">
                            <div className="table-users-edit">
                                <h3>Cesar soler</h3>
                                <button onClick={
                                    () => {
                                        this.setState({
                                            createProgram: false
                                        })
                                    }
                                }>Cancelar</button>
                            </div>
                        </div>
                    }



                    <hr></hr>
                    <div className="table-users">
                        <h4 className="marginBotton15">Grupos</h4>
                        <div className="table-users-edit">
                            {this.state.ok &&

                                <ProgramsGroupComponent ok={this.state.ok} />
                            }</div>
                    </div>
                </div>

            </div>
        )
    }
}
