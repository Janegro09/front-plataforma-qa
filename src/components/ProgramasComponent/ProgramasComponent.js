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
import Logo from '../Home/logo_background.png';
import SelectGroupCreate from './SelectGroupCreate'
import SelectGroupEdit from './SelectGroupEdit'
import SelectGroupParent from './SelectGroupParent'
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';


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
            okProgramas: false,
            buscando: false,
            gruposDeProgramas: null,
            specificGroup: null,
            componenteSelectGrupos: null,
            componenteSelectUsuarios: null,
            programaPadre: null,
            programEditReq: {},
            loading: false,
            redireccion: false,
            selected: 'M',
            goToHome: false
        }
    }

    buscar = () => {
        this.setState({
            buscando: true
        })
    }

    errordeCreacion = () => {
        swal('Debe crear grupos de programas antes de crear programas').then(() => {
            this.setState({
                createProgram: false,
                okProgramas: false,
                goToHome: true
            })
        })
    }

    desasignarGrupo = (idGrupo) => {
        let idPrograma = this.state.specificGroup[0].id
        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        this.setState({
            loading: true
        })
        axios.delete(Global.getAllPrograms + '/' + idPrograma + '/' + idGrupo, { headers: { Authorization: bearer } }).then(response => {
            const respuesta = response.data.Success
            if (respuesta) {
                swal("Genial!", "Grupo borrado correctamente!", "success");
            } else {
                swal("Atención!", "No se pudo borrar!", "info");
            }
            this.setState({
                loading: false
            })
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", "Hubo un problema al borrar el grupo", "error");
                }
                console.log("Error: ", e)
            });

    }

    editProgram = (event, userInfo) => {
        // Cargo en el estado la información del usuario seleccionado
        let id = userInfo.id
        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        this.setState({
            loading: true
        })
        axios.get(Global.getAllPrograms + '/' + id, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            const { Data } = response.data
            this.setState({
                loading: false
            })
            let componente2;
            let componente = <SelectGroupEdit end={() => {
                if (this.state.specificGroup && this.state.specificGroup.length > 0) {
                    let idParentProgram = this.state.specificGroup[0].programParent;
                    componente2 = <SelectGroupParent defaultValue={idParentProgram} getValue={(d) => {
                        this.setState({
                            programEditReq: {
                                parentProgram: d.value
                            }
                        })
                    }} />
                    this.setState({
                        componenteSelectUsuarios: componente2
                    })
                }

            }} getValue={(d) => {
                this.setState({
                    programEditReq: {
                        groupAssign: d
                    }
                })
            }} />
            this.setState({
                specificGroup: Data,
                componenteSelectGrupos: componente,
                componenteSelectUsuarios: componente2
            })

        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
        event.preventDefault()
        this.setState({
            editProgram: true,
            userSelected: userInfo
        })

    }

    deleteProgram = (event, userInfo) => {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
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
                    this.setState({
                        loading: true
                    })
                    axios.delete(Global.getAllPrograms + '/' + userInfo.id, config).then(response => {
                        sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                        this.setState({
                            loading: false
                        })
                        if (response.data.Success) {
                            swal("Genial! el programa se ha eliminado correctamente", {
                                icon: "success",
                            });
                            this.setState({
                                redireccion: true
                            })
                        }
                    }).catch(e => {
                        if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                            HELPER_FUNCTIONS.logout()
                        } else {
                            sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                            this.setState({
                                loading: false
                            })
                            swal("Error!", "Hubo un problema al borrar el programa", "error");
                        }
                        console.log("Error: ", e)
                    })
                } else {
                    swal("Ok, no has borrado nada");
                }
            });


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

    getUsersPage = (page, allPrograms) => {
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

    edit = (e) => {
        e.preventDefault()
        const bodyParameters = {
            name: this.name.value,
            parentProgram: this.state.programEditReq.parentProgram,
            section: this.turno,
            syncGroups: this.state.programEditReq.groupAssign,
            description: this.description.value
        }

        let dataSend = {};

        for (let i in bodyParameters) {
            if (bodyParameters[i]) {
                dataSend[i] = bodyParameters[i]
            }
        }

        let id = this.state.specificGroup[0].id || false

        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        this.setState({
            loading: true,
            // redireccion: true
        });

        // setTimeout(() => {      
        axios.put(Global.getAllPrograms + '/' + id, dataSend, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            window.location.reload(window.location.href);
            this.setState({
                loading: false
            })
        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    this.setState({
                        loading: false
                    })
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
        // }, 4000);


    }

    newProgram = (e) => {
        e.preventDefault()
        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        this.setState({
            loading: true
        })
        axios.get(Global.getAllProgramsGroups, { headers: { Authorization: bearer } }).then(response => {
            const { Data } = response.data
            this.setState({
                loading: false
            })
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                gruposDeProgramas: Data,
                okProgramas: true
            })
        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    this.setState({
                        loading: false
                    })
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
        this.setState({
            createProgram: true
        })
    }


    handleTurno = (event) => {
        event.preventDefault()
        console.log("El turno de la farmacia")
        this.turno = event.target.value
    }

    crearPrograma = (e) => {
        e.preventDefault();

        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const bodyParameters = {
            name: this.name.value,
            parentProgram: this.parentProgram ? this.parentProgram.value : '',
            section: this.turno,
            syncGroups: this.usersAssign.length > 0 ? this.usersAssign : [],
            description: this.description.value
        }

        this.setState({
            loading: true
        });

        axios.post(
            Global.newPrograms,
            bodyParameters,
            config
        ).then(response => {
            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
            swal("Programa creado!", "Ya se encuentra registrado", "success").then(() => {
                this.setState({
                    redirect: true,
                    loading: false,
                    redireccion: true
                })
            });

        }).catch(e => {
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                this.setState({
                    loading: false
                })
                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                swal("Error!", "Hubo un problema", "error");
            }
            console.log("Error: ", e)
        });
    }

    filtrarMonitoreoPerfilamiento = () => {
        let { selected } = this.state;

        if (selected === 'M') {
            this.setState({ selected: 'P' });
        } else {
            this.setState({ selected: 'M' });

        }

        console.log("El estado cambiado: ", this.state.selected)
    }

    componentDidMount() {
        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        this.setState({
            loading: true
        })
        axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            this.setState({
                allPrograms: response.data.Data,
                programsFiltered: response.data.Data,
                ok: true,
                loading: false
            })


        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    this.setState({
                        loading: false
                    })
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {
        const { allPrograms, programsFiltered, userSelected, selected } = this.state
        let pagina = this.getUsersPage(this.state.actualPage, allPrograms)
        let botones = []
        let arrayDiv = []
        let assignedPrograms = []


        if (allPrograms) {

            const data = programsFiltered.filter(program => {
                console.log("Selected: ", selected)
                if (this.title) {
                    if (this.title.value === '' || this.title.value === null) {
                        return (program.section === selected || program.section === 'notSpecify')
                    } else {
                        return (program.name.toUpperCase().indexOf(this.title.value.toUpperCase()) >= 0);
                    }
                } else {
                    return (program.section === selected || program.section === 'notSpecify')
                }

            })

            for (let index = 0; index < data.length; index++) {
                if (assignedPrograms.indexOf(data[index].id) >= 0 || data[index].programParent !== '') {
                    continue
                }

                let rows = []
                let tempData = (
                    <tr key={index}>
                        <td>{data[index].name}</td>
                        {HELPER_FUNCTIONS.checkPermission("PUT|programs/:id") &&
                            <td onClick={e => this.editProgram(e, data[index])}><EditIcon style={{ fontSize: 15 }} /></td>
                        }
                        {HELPER_FUNCTIONS.checkPermission("DELETE|programs/:id") &&
                            <td onClick={e => this.deleteProgram(e, data[index])}><DeleteIcon style={{ fontSize: 15 }} /></td>
                        }
                    </tr>
                )

                rows.push(tempData)
                for (let j = 0; j < data.length; j++) {

                    if (data[j].programParent === data[index].id) {

                        let tempData = (
                            <tr key={index + 1 + j}>
                                <td><SubdirectoryArrowRightIcon className="ArrowRightIcon" /> {data[j].name}</td>
                                <td onClick={e => this.editProgram(e, data[j])}><EditIcon style={{ fontSize: 15 }} /></td>
                                <td onClick={e => this.deleteProgram(e, data[j])}><DeleteIcon style={{ fontSize: 15 }} /></td>
                            </tr>
                        )

                        rows.push(tempData)
                        assignedPrograms.push(data[j].id)


                        for (let k = 0; k < data.length; k++) {

                            if (data[j].id === data[k].programParent) {
                                let tempData = (
                                    <tr key={index + 3 + k}>
                                        <td><SubdirectoryArrowRightIcon className="marginArrow ArrowRightIcon" /> {data[k].name}</td>
                                        <td onClick={e => this.editProgram(e, data[k])}><EditIcon style={{ fontSize: 15 }} /></td>
                                        <td onClick={e => this.deleteProgram(e, data[k])}><DeleteIcon style={{ fontSize: 15 }} /></td>
                                    </tr>
                                )

                                rows.push(tempData)
                                assignedPrograms.push(data[k].id)
                            }
                        }
                    }

                }

                arrayDiv.push(rows)
                assignedPrograms.push(data[index].id)
            }
        }

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

        if (this.state.redireccion) {
            /**Si veo esto en algún momento
             * investigar como recargar el componente y no toda la página
             * atte: el soga
             */
            window.location.reload();
            /** Esto lo hizo el animal de max, pero sin duda, aguante JS papaaaaa soga  */
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

        if (this.state.goToHome) {
            return <Redirect to="/home" />
        }

        return (
            <>
                {this.state.loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="logoBackground">
                    <img src={Logo} alt="" title="Logo" className="logoFixed" />
                </div>
                <SiderBarLeft />

                <div className="BtnInProgramas"> <button><a href="#programasSection">Programas</a></button> <hr></hr><button><a href="#gruposProgSection">Grupos</a></button></div>


                <div className="section-content">
                    {!this.state.createProgram &&
                        <div id="programasSection" className="tabla_parent">
                            <h4>PROGRAMAS</h4>
                            <hr></hr>
                            <br></br>
                            {!this.state.editProgram &&
                                <div>

                                    <div className="flex-input-add">
                                        {/* Buscador */}
                                        {HELPER_FUNCTIONS.checkPermission("GET|groups/:id") &&
                                            <input
                                                className="form-control"
                                                type="text"
                                                ref={(c) => {
                                                    this.title = c
                                                }}
                                                placeholder="Buscar programa"
                                                onChange={this.buscar}
                                            />
                                        }

                                        {HELPER_FUNCTIONS.checkPermission("POST|programs/new") &&
                                            <button className="addItem morph" onClick={e => this.newProgram(e)}><GroupAddIcon className="svgAddButton" style={{ fontSize: 33 }} /></button>
                                        }



                                        {this.state.error &&
                                            <h1>Hubo un error en la búsqueda, inténtalo más tarde</h1>
                                        }
                                    </div>

                                    <div className="filtroSwitch">
                                        <h5>Filtrado por: <strong>{selected === 'M' ? 'Monitoreo' : 'Perfilamiento'}</strong></h5>
                                        <label className="switch">
                                            <input type="checkbox" name="filtro" onChange={this.filtrarMonitoreoPerfilamiento} />
                                            <span className="slider round"></span>
                                        </label>

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
                                            {arrayDiv.length > 0 &&
                                                arrayDiv.map(data => {
                                                    data.map(row => {
                                                        return row;
                                                    })
                                                    return data;
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

                            {this.state.editProgram && this.state.ok &&
                                <div>

                                    {/* <CreateProgramsGroupComponent /> */}
                                    <div>
                                        <form onSubmit={this.edit} className="inputsEditUser addUserPadding">
                                            <span className="Label">Nombre</span>
                                            <input className="form-control" type="text" placeholder="" ref={(c) => this.name = c} defaultValue={userSelected.name ? userSelected.name : ''} />
                                            <span className="Label">Parent program</span>

                                            {this.state.componenteSelectUsuarios !== null &&

                                                this.state.componenteSelectUsuarios
                                            }
                                            <span className="Label">Section</span>
                                            <select onChange={this.handleTurno}>
                                                <option value="-">Selecciona...</option>
                                                <option value="M" selected={userSelected.section === 'M'}>Monitoreo</option>
                                                <option value="P" selected={userSelected.section === 'P'}>Perfilamiento</option>
                                            </select>
                                            <div className="etiquetas">
                                                {this.state.specificGroup && this.state.componenteSelectGrupos !== null &&
                                                    this.state.specificGroup[0].assignedGroups.map(grupo => {
                                                        return (
                                                            <div className="etiqueta">
                                                                <p>{grupo.name}</p>
                                                                <button onClick={(e) => {
                                                                    e.preventDefault()
                                                                    this.desasignarGrupo(grupo.id)
                                                                }}>x</button>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            {this.state.componenteSelectGrupos !== null &&
                                                this.state.componenteSelectGrupos
                                            }
                                            <span className="Label">Description</span>
                                            <input className="form-control" type="text" placeholder="" ref={(c) => this.description = c} defaultValue={userSelected.description ? userSelected.description : ''} />
                                            <button className="btn btn-block btn-info ripple-effect confirmar" type="submit" name="Submit" alt="sign in">Editar Programas</button>
                                        </form>
                                    </div>

                                    <button className="btnClose"
                                        onClick={() => {
                                            this.setState({
                                                editProgram: false
                                            })
                                        }}
                                    >
                                        x
                                    </button>
                                </div>
                            }

                        </div>
                    }

                    {this.state.createProgram && this.state.okProgramas &&
                        <div className="tabla_parent">
                            <h4 className="marginBotton15">Crear programa</h4>
                            <form onSubmit={this.crearPrograma} className="inputsEditUser addUserPadding">
                                <span className="Label">Nombre</span>
                                <input className="form-control" type="text" placeholder="" ref={(c) => this.name = c} />
                                <span className="Label">Parent program</span>
                                <SelectGroupParent getValue={(c) => this.parentProgram = c} defaultValue={this.state.allPrograms ? this.state.allPrograms : ''} />
                                <span className="Label">Section</span>
                                <select onChange={this.handleTurno}>
                                    <option value="M">Monitoreo</option>
                                    <option value="P">Perfilamiento</option>
                                </select>
                                {this.state.gruposDeProgramas &&

                                    <SelectGroupCreate getValue={(c) => this.usersAssign = c} defaultValue={this.state.gruposDeProgramas ? this.state.gruposDeProgramas : ''} />

                                }
                                <span className="Label">Description</span>
                                <input className="form-control" type="text" placeholder="" ref={(c) => this.description = c} />
                                <button className="btn btn-block btn-info ripple-effect confirmar" type="submit" name="Submit" alt="sign in">Crear Programas</button>
                            </form>
                            <button className="btnClose" onClick={
                                () => {
                                    this.setState({
                                        createProgram: false
                                    })
                                }
                            }>x</button>

                        </div>
                    }

                </div>


            </>
        )
    }
}
