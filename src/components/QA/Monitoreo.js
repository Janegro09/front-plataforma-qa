import React, { Component } from 'react';
import axios from 'axios';
import SiderbarLeft from '../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import ModalNuevoMonitoreo from './ModalNuevoMonitoreo';
import './Mon.css';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import { Breadcrumbs } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded';
import CheckIcon from '@material-ui/icons/Check';
import TimerIcon from '@material-ui/icons/Timer';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


export default class Monitoreo extends Component {
    state = {
        loading: false,
        monitoreos: [],
        redirect: false,
        abrirModal: false,
        programs: [],
        programsGroups: [],
        empresasSeleccionadas: [],
        users: [],
        usuariosConFiltro: [],
        monitoreosSeleccionados: [],
        buscadorUsuario: "",
        buscadorUsuarioCreatedBy: "",
        usuarioSeleccionadoCreatedBy: null,
        buscador: {
            program: []
        },
        usuarioSeleccionado: null,
        toggleBuscador: true
    }

    nuevoMonitoreo = (e) => {
        e.preventDefault();
        this.setState({ abrirModal: true });
    }

    componentDidMount() {
        // Treamos los programas y los usuarios

        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        axios.get(Global.getUsers + '?specificdata=true', { headers: { Authorization: bearer } }).then(response => {

            token = response.data.loggedUser.token;
            bearer = `Bearer ${token}`
            let users = response.data.Data;
            let usuariosConFiltro = users;
            axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                // let p = response.data.Data || false;
                // let programs;
                // if (p) {
                //     programs = p.filter(elem => elem.section === 'M');
                // }

                axios.get(Global.frontUtilities).then(response => {
                    
                    const programsGroups = response.data.Data?.programsGroups || [];
                    this.setState({
                        programsGroups,
                        usuariosConFiltro,
                        users,
                        loading: false
                    })
                })
            })


        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });

        // Hacer rekest

    }

    buscar = (e) => {
        e.preventDefault();
        const { buscador } = this.state;
        this.setState({
            loading: true
        })

        // Convert to query string
        let query = "";

        for (let b in buscador) {
            let tempQuery = buscador[b]
            if (b === 'program') {
                let temp = "";

                for (let program of buscador[b]) {
                    temp = temp ? temp += `%%${program.id}` : program.id;
                }

                tempQuery = temp;
            }
            if (tempQuery !== "") {
                let data = `${b}=${tempQuery}`;
                query = !!query ? `${query}&${data}` : `?${data}`;
            }
        }


        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.monitoreos + query, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                monitoreos: response.data.Data,
                loading: false,
                toggleBuscador: false
            })

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });
    }

    buscarUsuario = (e) => {
        let buscado = e.target.value.toLowerCase();
        const { users } = this.state;

        let encontrado = users.filter(user => user.id.includes(buscado) || `${user.name} ${user.lastName}`.includes(buscado)
        )

        this.setState({ usuariosConFiltro: encontrado, buscadorUsuario: buscado });

    }
    buscarUsuarioCreatedBy = (e) => {
        let buscado = e.target.value.toLowerCase();
        const { users } = this.state;

        let encontrado = users.filter(user => user.id.includes(buscado) || `${user.name} ${user.lastName}`.includes(buscado)
        )

        this.setState({ usuariosConFiltro: encontrado, buscadorUsuarioCreatedBy: buscado });

    }

    marcarFila = (user) => {
        return {
            cursor: "pointer",
            background: user.id === this.state.buscador.userId ? "#ebecf0" : ""
        }
    }
    marcarFilaCreatedBy = (user) => {
        return {
            cursor: "pointer",
            background: user.id === this.state.buscador.createdBy ? "#ebecf0" : ""
        }
    }

    agregarUsuario = (user) => {
        let { buscador, buscadorUsuario, usuarioSeleccionado } = this.state;

        buscadorUsuario = "";
        usuarioSeleccionado = user;
        buscador.userId = user.id;
        this.setState({ buscador, buscadorUsuario, usuarioSeleccionado });
    }
    agregarUsuarioCreatedBy = (user) => {
        let { buscador, buscadorUsuarioCreatedBy, usuarioSeleccionadoCreatedBy } = this.state;

        buscadorUsuarioCreatedBy = "";
        usuarioSeleccionadoCreatedBy = user;
        buscador.createdBy = user.id;
        this.setState({ buscador, buscadorUsuarioCreatedBy, usuarioSeleccionadoCreatedBy });
    }

    addEmpresas = (e) => {
        let { value, id, type } = e.target;
        let { empresasSeleccionadas, programsGroups } = this.state;

        if (value === 'allEmpresas') {
            empresasSeleccionadas = programsGroups;

        } else if(value === 'clearEmpresas'){
            empresasSeleccionadas = [];
        } else if (empresasSeleccionadas.findIndex(elemento => elemento.id === value) === -1) {
            let empresa = programsGroups.find(elem => elem.id === value);
            empresasSeleccionadas.push(empresa);
        }

        this.get_programs(empresasSeleccionadas);
    }

    changeBuscador = (e) => {
        // e.preventDefault();
        let { value, id, type } = e.target;
        let { buscador, programs } = this.state;

        if (type === 'checkbox') {
            value = buscador[id] === true ? false : true;
        }

        if (id === 'program') {
            if (value === 'allPrograms') {
                buscador.program = programs;

            } else if(value === 'clearPrograms'){
                buscador.program = [];
            } else if (buscador.program.findIndex(elemento => elemento.id === value) === -1) {
                let program = programs.find(elem => elem.id === value);
                buscador.program.push(program);
            }

        } else if (id) {
            buscador[id] = value;
        }

        this.setState({ buscador });
    }

    editar = (e) => {
        const { id } = e.target.dataset;

        let redirect = '/monitoreo/' + id;

        if (id) {
            this.setState({ redirect })
        }
    }

    getUser = (userId) => {
        const { users } = this.state;

        let user = users.find(elem => elem.id === userId);

        if (user) {
            userId = (user.legajo || user.id) + ' - ' + user.name + ' ' + user.lastName
        }

        return userId;
    }

    eliminarEmpresa = (e) => {
        let { id } = e.target;
        let { empresasSeleccionadas } = this.state;
        if (empresasSeleccionadas.length > 1) {
            empresasSeleccionadas = empresasSeleccionadas.filter(elem => elem.id !== id);
        } else if (empresasSeleccionadas.length === 1) {
            empresasSeleccionadas = []
        }

        this.get_programs(empresasSeleccionadas);
    }

    eliminarPrograma = (e) => {
        let { id } = e.target;
        let { buscador } = this.state;
        if (buscador.program.length > 1) {
            buscador.program = buscador.program.filter(elem => elem.id !== id);
        } else if (buscador.program.length === 1) {
            buscador.program = []
        }
        this.setState({ buscador })
    }

    deleteMon = (e) => {
        const { id } = e.target.dataset;

        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar un monitoreo, no podrás recuperarlo",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let token = JSON.parse(sessionStorage.getItem('token'))
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    axios.delete(Global.monitoreos + "/" + id, config)
                        .then(response => {
                            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                            if (response.data.Success) {
                                swal("Felicidades!", "Monitoreo eliminado correctamente", "success").then(() => {
                                    window.location.reload(window.location.href);
                                });
                            }

                        })
                        .catch(e => {
                            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                HELPER_FUNCTIONS.logout()
                            } else {
                                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                swal("Error al eliminar!", {
                                    icon: "error",
                                });

                            }
                            console.log("Error: ", e)
                        })

                } else {
                    swal("No se elimino nada");
                }
            });
    }

    exportarMonitoreos = (e) => {
        e.preventDefault();
        const { monitoreosSeleccionados } = this.state;

        const dataToSend = {
            monitoringsIds: monitoreosSeleccionados
        }

        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        this.setState({ loading: true });

        axios.post(Global.monitoreos + '/exports', dataToSend, config).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            })

            let p = response.data.Data || false;

            if (p.tempId) {
                let win = window.open(Global.download + '/' + p.tempId, '_blank');
                win.focus();
            }

        }).catch((e) => {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                this.setState({
                    loading: false
                })
                swal("Error!", `${e.response.data.Message}`, "error");
            }
            console.log("Error: ", e)
        });
    }

    seleccionarTodos = () => {
        let { monitoreosSeleccionados, monitoreos } = this.state;

        monitoreosSeleccionados = [];
        for (let m of monitoreos) {
            if (monitoreosSeleccionados.includes(m.id)) continue;

            monitoreosSeleccionados.push(m.id);
        }

        this.setState({ monitoreosSeleccionados });

    }

    des_seleccionar_todos = () => {
        let { monitoreosSeleccionados } = this.state;

        monitoreosSeleccionados = [];

        this.setState({ monitoreosSeleccionados });
    }

    toggleAddMonitoring = (e) => {
        const { id } = e.target.dataset;
        let { monitoreosSeleccionados } = this.state;

        if (!id) return false;

        if (!monitoreosSeleccionados.includes(id)) {
            //A Agregamos la empresa al array
            monitoreosSeleccionados.push(id);

        } else {
            // Eliminamos la empresa del array
            if (monitoreosSeleccionados.length > 1) {
                monitoreosSeleccionados = monitoreosSeleccionados.filter(elem => elem !== id);
            } else if(monitoreosSeleccionados.length === 1) {
                monitoreosSeleccionados = []
            }
        }

        this.setState({ monitoreosSeleccionados });

    }

    toggleBuscadorStatus = () => {
        let { toggleBuscador } = this.state;

        this.setState({ toggleBuscador: !toggleBuscador });
    }

    get_programs = (empresas) => {
        let { buscador } = this.state;
        buscador.program = [];
        let dataToSend = [];
        for(let { name } of empresas) {
            dataToSend.push(name)
        }

        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        this.setState({ loading: true, empresasSeleccionadas: empresas });

        axios.post(Global.monitoreos + '/filters', dataToSend, config).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let programs = response.data.Data.programs || false;

            this.setState({
                buscador,
                empresasSeleccionadas: empresas,
                programs,
                loading: false
            })

        }).catch((e) => {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                this.setState({
                    loading: false
                })
                swal("Error!", `${e.response.data.Message}`, "error");
            }
            console.log("Error: ", e)
        });
    }


    render() {
        const { programsGroups, empresasSeleccionadas ,toggleBuscador, monitoreosSeleccionados, loading, monitoreos, redirect, abrirModal, usuarioSeleccionadoCreatedBy, buscadorUsuarioCreatedBy, buscadorUsuario, programs, buscador, usuarioSeleccionado, usuariosConFiltro } = this.state;

        if (redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }


                {abrirModal &&
                    <ModalNuevoMonitoreo />
                }

                <div className="section-content">
                    <div className="flex-input-add input-add-spacebetween">
                        <h4 className="mr-2">MONITOREO</h4>
                        <div className="">
                            <button
                                className="btnDefault"
                                onClick={this.nuevoMonitoreo}
                            >
                                Agregar monitoreo
                            {/* <HearingIcon /> */}
                            </button>
                        </div>
                    </div>
                    <hr />
                    <br />
                    <button className="btn btnTres" onClick={this.toggleBuscadorStatus}>{toggleBuscador ? 'Cerrar' : 'Abrir'} buscador</button>

                    {toggleBuscador &&
                        <div className="buscadorMon">
                            {/* User id */}
                            <article>
                                <h6>Id de Usuario</h6>
                                <br />
                                <input
                                    type="text"
                                    placeholder="Buscar usuario"
                                    onChange={this.buscarUsuario}
                                    value={buscadorUsuario}
                                    className="form-control margin-bottom-10"
                                />
                                {!buscadorUsuario && usuarioSeleccionado &&
                                    <small>
                                        Usuario Seleccionado: <strong>{usuarioSeleccionado.name} {usuarioSeleccionado.lastName} - {usuarioSeleccionado.id}</strong>
                                    </small>
                                }

                                {usuariosConFiltro && buscadorUsuario &&
                                    <table className="tablaBuscarUsuarios">
                                        <thead>
                                            <tr>
                                                <th>DNI</th>
                                                <th>Nombre y apellido</th>
                                            </tr>
                                        </thead>
                                        {usuariosConFiltro?.slice(0, 10).map(user => {
                                            return (
                                                <tbody key={user.id}
                                                    style={this.marcarFila(user)}
                                                    onClick={(e) => { e.preventDefault(); this.agregarUsuario(user); }}
                                                >
                                                    <tr>
                                                        <td>{user.id}</td>
                                                        <td>{user.name} {user.lastName}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })}
                                    </table>
                                }


                            </article>
                            <br />

                            <article>
                                <h6>Empresa</h6>
                                <br />
                                <select onChange={this.addEmpresas} value="" id="empresas"> 
                                    <option>Selecciona...</option>
                                    <option value='allEmpresas'>Seleccionar todos</option>
                                    <option value='clearEmpresas'>Des-seleccionar todos</option>
                                    {programsGroups.map(v => {
                                        return <option key={v.id} value={v.id}>{v.name}</option>
                                    })
                                    }
                                </select>
                                <div className="programasSeleccionados">
                                    {empresasSeleccionadas.length > 0 &&
                                        empresasSeleccionadas.map(p => {
                                            return (
                                                <span key={p.id}>{p.name}
                                                    <button id={p.id} onClick={this.eliminarEmpresa}>X</button>
                                                </span>)
                                        })
                                    }

                                </div>
                            </article>
                            <br/>
                            {/* Program */}
                            {programs.length > 0 && 
                                <>
                                <article>
                                    <h6>Programa</h6>
                                    <br />
                                    <select onChange={this.changeBuscador} value="" id="program">
                                        <option>Selecciona...</option>
                                        <option value='allPrograms'>Seleccionar todos</option>
                                        <option value='clearPrograms'>Des-seleccionar todos</option>
                                        {programs.map(v => {
                                            return <option key={v.id} value={v.id}>{v.name}</option>
                                        })
                                        }
                                    </select>
                                    <div className="programasSeleccionados">
                                        {buscador.program.length > 0 &&
                                            buscador.program.map(p => {
                                                return (
                                                    <span key={p.id}>{p.name}
                                                        <button id={p.id} onClick={this.eliminarPrograma}>X</button>
                                                    </span>)
                                            })
                                        }

                                    </div>
                                </article>
                                <br />
                                </>
                            }

                            {/* Fecha de transaccion */}
                            <article>
                                <h6>Fecha de transacción</h6>
                                <br />
                                <span>
                                    <label>Desde</label>
                                    <input className="form-control" type="date" id="dateTransactionStart" onChange={this.changeBuscador} />
                                </span>
                                <span>
                                    <label>Hasta</label>
                                    <input className="form-control" type="date" id="dateTransactionEnd" onChange={this.changeBuscador} />
                                </span>
                            </article>
                            <br />

                            {/* Responses */}
                            {/* <article>
                                <h6>Respuestas</h6>
                            </article>
                            <hr /> */}

                            {/* Status */}
                            <article>
                                <h6>Estado</h6>
                                <br />
                                <select onChange={this.changeBuscador} value={buscador.status} id="status">
                                    <option>Selecciona...</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="run">En proceso</option>
                                    <option value="finished">Terminado</option>
                                </select>
                            </article>
                            <br />

                            {/* Case id */}
                            <article>
                                <h6>Id del caso</h6>
                                <br />
                                <input className="form-control" type="text" id="caseId" onChange={this.changeBuscador} value={buscador.caseId} />
                            </article>
                            <br />

                            {/* Created by */}
                            <article>
                                <h6>Creado por</h6>
                                <br />
                                <input
                                    type="text"
                                    placeholder="Buscar usuario"
                                    onChange={this.buscarUsuarioCreatedBy}
                                    value={buscadorUsuarioCreatedBy}
                                    className="form-control margin-bottom-10"
                                />
                                {!buscadorUsuarioCreatedBy && usuarioSeleccionadoCreatedBy &&
                                    <small>
                                        Usuario Seleccionado: <strong>{usuarioSeleccionadoCreatedBy.name} {usuarioSeleccionadoCreatedBy.lastName} - {usuarioSeleccionadoCreatedBy.id}</strong>
                                    </small>
                                }

                                {usuariosConFiltro && buscadorUsuarioCreatedBy &&
                                    <table className="tablaBuscarUsuarios">
                                        <thead>
                                            <tr>
                                                <th>DNI</th>
                                                <th>Nombre y apellido</th>
                                            </tr>
                                        </thead>
                                        {usuariosConFiltro?.slice(0, 10).map(user => {
                                            return (
                                                <tbody key={user.id}
                                                    style={this.marcarFilaCreatedBy(user)}
                                                    onClick={(e) => { e.preventDefault(); this.agregarUsuarioCreatedBy(user); }}
                                                >
                                                    <tr>
                                                        <td>{user.id}</td>
                                                        <td>{user.name} {user.lastName}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        })}
                                    </table>
                                }

                            </article>

                            {/* Invalidated */}
                            {/* Comentamos INVALIDADO por solicitud de Gabriel el 20/10/2020 */}
                            {/* <article className="flexAlign input-add-spacebetween">
                                <h6>Invalidado</h6>
                                <br />
                                <Checkbox type="checkbox" id="invalidated" onChange={this.changeBuscador} checked={buscador.invalidated} />

                            </article> */}
                            <br />
                            <article className="flexAlign input-add-spacebetween">
                                <h6>Disputado</h6>
                                <br />
                                <Checkbox type="checkbox" id="disputado" onChange={this.changeBuscador} checked={buscador.disputado} />
                            </article>
                            <br />
                            <Breadcrumbs />
                            <article className="flexAlign input-add-spacebetween">
                                <h6>Evaluado</h6>
                                <br />
                                <Checkbox type="checkbox" id="evaluated" onChange={this.changeBuscador} checked={buscador.evaluated} />
                            </article>
                            <br />
                            <button className="btnSecundario" type="button" onClick={this.buscar}>Buscar</button>
                        </div>

                    }

                    <div className="botonera-exportar">
                        {monitoreosSeleccionados.length > 0 &&
                            <>
                                <button className="btnSecundario" type="button" onClick={this.exportarMonitoreos}>Exportar</button>
                                <button className="btnSecundario" type="button" onClick={this.des_seleccionar_todos}>Des-seleccionar todos</button>
                            </>
                        }
                        {monitoreos.length > 0 &&
                            <button className="btnSecundario" type="button" onClick={this.seleccionarTodos}>Seleccionar todos</button>
                        }

                    </div>
                    <div className="resultados">
                        {monitoreos.length > 0 &&
                            <table>
                                <thead>
                                    <tr>
                                        <th>Seleccionar</th>
                                        <th>ID del caso</th>
                                        <th>Creado Por</th>
                                        <th>Usuario monitoreado</th>
                                        <th>Fecha de creación</th>
                                        <th>Fecha de Transacción</th>
                                        <th>Modificado por</th>
                                        <th>Programa</th>
                                        <th>Estado</th>
                                        <th>Disputado</th>
                                        {/* <th>Invalidado</th> */}
                                        <th>Evaluado</th>
                                        <th>Calificación</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                {monitoreos?.map(mon => {

                                    return (
                                        <tbody key={mon.id}>
                                            <tr>
                                                <td>
                                                    <input
                                                        data-id={mon.id}
                                                        name="export"
                                                        type="checkbox"
                                                        checked={monitoreosSeleccionados.includes(mon.id)}
                                                        onClick={this.toggleAddMonitoring}
                                                    />
                                                </td>
                                                <td>{mon.caseId}</td>
                                                <td>{this.getUser(mon.createdBy)}</td>
                                                <td>{this.getUser(mon.userId)}</td>
                                                <td>{moment(mon.createdAt).format('DD/MM/YYYY  HH:mm')}</td>
                                                <td>{moment(mon.transactionDate).format('DD/MM/YYYY  HH:mm')}</td>
                                                <td>{mon.modifiedBy.length}</td>
                                                <td>{mon.program}</td>
                                                <td>{(mon.status === 'pending' ? <TimerIcon className="timerIcon" /> : (mon.status === 'finished' ? <CheckIcon className="CheckIcon" /> : <PlayArrowRoundedIcon className="PlayArrowRoundedIcon" />))}</td>
                                                <td className="tablaVariables tableIcons"><div className={mon.disputado ? "estadoActivo" : "estadoInactivo"}></div></td>
                                                {/* <td className="tablaVariables tableIcons"><div className={mon.invalidated ? "estadoActivo" : "estadoInactivo"}></div></td> */}
                                                <td className="tablaVariables tableIcons"><div className={mon.evaluated ? "estadoActivo" : "estadoInactivo"}></div></td>
                                                <td>
                                                    {(mon.improvment === "+" || mon.improvment === '++' ? 
                                                        <ExpandLessIcon className="arrowUp" /> : (mon.improvment === "+-" ?
                                                            <ImportExportRoundedIcon /> : <ExpandMoreIcon className="arrowDown" />))}
                                                </td>
                                                <td className="buttonsMons">
                                                    <button type="button" data-id={mon.id} onClick={this.editar}>

                                                        {mon.modifiedBy.length === 0 ? 'Responder' : 'Editar'}

                                                    </button>
                                                    <button data-id={mon.id} type="button" onClick={this.deleteMon}>Eliminar</button>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        }
                        {monitoreos.length === 0 &&
                            <div className="alert alert-warning">No existen monitoreos para mostrar</div>
                        }
                    </div>
                </div>
            </>
        )
    }
}
