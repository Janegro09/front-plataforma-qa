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
import HearingIcon from '@material-ui/icons/Hearing';

export default class Monitoreo extends Component {
    state = {
        loading: false,
        monitoreos: [],
        redirect: false,
        abrirModal: false,
        programs: [],
        users: [],
        usuariosConFiltro: [],
        buscadorUsuario: "",
        buscadorUsuarioCreatedBy: "",
        usuarioSeleccionadoCreatedBy: null,
        buscador: {
            program: []
        },
        usuarioSeleccionado: null
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

                let p = response.data.Data || false;
                let programs;
                if (p) {
                    programs = p.filter(elem => elem.section === 'M');
                }

                this.setState({
                    programs,
                    usuariosConFiltro,
                    users,
                    loading: false
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

<<<<<<< HEAD
        for (let b in buscador) {
            let data = `${b}=${buscador[b]}`;
            query = !!query ? `${query}&${data}` : `?${data}`;
=======
        for(let b in buscador) {
            let tempQuery = buscador[b]
            if(b === 'program') {
                let temp = "";

                for(let program of buscador[b]) {
                    temp = temp ? temp += `%%${program.id}` : program.id;
                }

                tempQuery = temp;
            }
            let data = `${b}=${tempQuery}`;
            console.log(data);
            query = !!query ? `${query}&${data}` : `?${data}`;            
>>>>>>> 524a4986dbe1894728ce722f67720a325b7e457d
        }


        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.monitoreos + query, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            console.log(response.data.Data);
            this.setState({
                monitoreos: response.data.Data,
                loading: false
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
        let buscado = e.target.value.trim().toLowerCase();
        const { users } = this.state;

        let encontrado = users.filter(user => user.id.trim().includes(buscado) || `${user.name} ${user.lastName}`.trim().includes(buscado)
        )

        this.setState({ usuariosConFiltro: encontrado, buscadorUsuario: buscado });

    }
    buscarUsuarioCreatedBy = (e) => {
        let buscado = e.target.value.trim().toLowerCase();
        const { users } = this.state;

        let encontrado = users.filter(user => user.id.trim().includes(buscado) || `${user.name} ${user.lastName}`.trim().includes(buscado)
        )

        this.setState({ usuariosConFiltro: encontrado, buscadorUsuarioCreatedBy: buscado });

    }

    marcarFila = (user) => {
        return {
            cursor: "pointer",
            background: user.id === this.state.buscador.userId ? "green" : ""
        }
    }
    marcarFilaCreatedBy = (user) => {
        return {
            cursor: "pointer",
            background: user.id === this.state.buscador.createdBy ? "green" : ""
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

    changeBuscador = (e) => {
        // e.preventDefault();
        let { value, id, type } = e.target;
        let { buscador, programs } = this.state;

        if (type === 'checkbox') {
            value = buscador[id] === true ? false : true;
        }

<<<<<<< HEAD
        if (id) {
=======
        if(id === 'program') {
            if(value === 'allPrograms') {
                buscador.program = programs;
>>>>>>> 524a4986dbe1894728ce722f67720a325b7e457d

            } else if(buscador.program.findIndex(elemento => elemento.id === value) === -1) {
                let program = programs.find(elem => elem.id === value);
                buscador.program.push(program);
            }

        } else if(id) {
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

<<<<<<< HEAD
        if (user) {
            userId = user.id + ' - ' + user.name + ' ' + user.lastName
=======
        if(user) {
            userId =  (user.legajo || user.id) + ' - ' + user.name + ' ' + user.lastName
>>>>>>> 524a4986dbe1894728ce722f67720a325b7e457d
        }

        return userId;
    }

    eliminarPrograma = (e) => {
        let { id } = e.target;
        let { buscador } = this.state;
        if(buscador.program.length > 1) {
            buscador.program = buscador.program.filter(elem => elem.id !== id);
        } else if(buscador.program.length === 1) {
            buscador.program = [] 
        }
        this.setState({ buscador })
    }


    render() {
        const { loading, monitoreos, redirect, abrirModal, usuarioSeleccionadoCreatedBy, buscadorUsuarioCreatedBy, buscadorUsuario, programs, buscador, usuarioSeleccionado, usuariosConFiltro } = this.state;

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

                    <div className="flex-input-add">
                        <h4>Monitoreo</h4>

                        <button
                            className="btnDefault addMonitoreo"
                            onClick={this.nuevoMonitoreo}
                        >
                            Agregar monitoreo <HearingIcon />
                    </button>
                    </div>
                    <div className="buscadorMon">
                        {/* User id */}
                        <article>
                            <h6>Id de Usuario</h6>

                            <input
                                type="text"
                                placeholder="Buscar usuario"
                                onChange={this.buscarUsuario}
                                value={buscadorUsuario}
                                className="form-control"
                            />
                            {!buscadorUsuario && usuarioSeleccionado &&
                                <small>
                                    Usuario Seleccionado: <strong>{usuarioSeleccionado.name} {usuarioSeleccionado.lastName} - {usuarioSeleccionado.id}</strong>
                                </small>
                            }

                            {usuariosConFiltro && buscadorUsuario &&
                                <table>
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
                        <hr />

                        {/* Program */}
                        <article>
                            <h6>Programa</h6>
                            <select onChange={this.changeBuscador} value="" id="program">
                                <option>Selecciona...</option>
                                {console.log(programs)}
                                <option value='allPrograms'>Seleccionar todos</option>
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
                        <hr />

                        {/* Fecha de transaccion */}
                        <article>
                            <h6>Fecha de transacción</h6>
                            <span>
                                <label>Desde</label>
                                <input type="date" id="dateTransactionStart" onChange={this.changeBuscador} />
                            </span>
                            <span>
                                <label>Hasta</label>
                                <input type="date" id="dateTransactionEnd" onChange={this.changeBuscador} />
                            </span>
                        </article>
                        <hr />

                        {/* Responses */}
                        {/* <article>
                            <h6>Respuestas</h6>
                        </article>
                        <hr /> */}

                        {/* Status */}
                        <article>
                            <h6>Estado</h6>
                            <select onChange={this.changeBuscador} value={buscador.status} id="status">
                                <option>Selecciona...</option>
                                <option value="pending">Pendiente</option>
                                <option value="run">En proceso</option>
                                <option value="finished">Terminado</option>
                            </select>
                        </article>
                        <hr />

                        {/* Case id */}
                        <article>
                            <h6>Id del caso</h6>
                            <input type="text" id="caseId" onChange={this.changeBuscador} value={buscador.caseId} />
                        </article>
                        <hr />

                        {/* Created by */}
                        <article>
                            <h6>Creado por</h6>

                            <input
                                type="text"
                                placeholder="Buscar usuario"
                                onChange={this.buscarUsuarioCreatedBy}
                                value={buscadorUsuarioCreatedBy}
                                className="form-control"
                            />
                            {!buscadorUsuarioCreatedBy && usuarioSeleccionadoCreatedBy &&
                                <small>
                                    Usuario Seleccionado: <strong>{usuarioSeleccionadoCreatedBy.name} {usuarioSeleccionadoCreatedBy.lastName} - {usuarioSeleccionadoCreatedBy.id}</strong>
                                </small>
                            }

                            {usuariosConFiltro && buscadorUsuarioCreatedBy &&
                                <table>
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
                        <hr />

                        {/* Invalidated */}
                        <article>
                            <h6>Invalidado</h6>
                            <input type="checkbox" id="invalidated" onChange={this.changeBuscador} checked={buscador.invalidated} />
                        </article>
                        <hr />
                        <article>
                            <h6>Disputado</h6>
                            <input type="checkbox" id="disputado" onChange={this.changeBuscador} checked={buscador.disputado} />
                        </article>
                        <hr />
                        <article>
                            <h6>Evaluado</h6>
                            <input type="checkbox" id="evaluated" onChange={this.changeBuscador} checked={buscador.evaluated} />
                        </article>
                        <hr />
                        <button className="btn" type="button" onClick={this.buscar}>Buscar</button>
                    </div>

                    <div className="resultados">
                        {monitoreos.length > 0 &&
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID del caso</th>
                                        <th>Creado Por</th>
                                        <th>Usuario monitoreado</th>
                                        <th>Fecha de creación</th>
                                        <th>Fecha de Transacción</th>
                                        <th>Modificado por</th>
                                        <th>Programa</th>
                                        <th>Estado</th>
                                        <th>Disputado</th>
                                        <th>Invalidado</th>
                                        <th>Evaluado</th>
                                        <th>Improvment</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                {monitoreos?.map(mon => {
                                    return (
                                        <tbody key={mon.id}>
                                            <tr>
                                                <td>{mon.caseId}</td>
                                                <td>{this.getUser(mon.createdBy)}</td>
                                                <td>{this.getUser(mon.userId)}</td>
                                                <td>{moment(mon.createdAt).format('DD/MM/YYYY  HH:mm')}</td>
                                                <td>{moment(mon.transactionDate).format('DD/MM/YYYY  HH:mm')}</td>
                                                <td>{mon.modifiedBy.length}</td>
                                                <td>{mon.program}</td>
                                                <td>{mon.status}</td>
                                                <td>{mon.disputado.toString()}</td>
                                                <td>{mon.invalidated.toString()}</td>
                                                <td>{mon.evaluated.toString()}</td>
                                                <td>{mon.improvment}</td>
                                                <td>
                                                    <button type="button" data-id={mon.id} onClick={this.editar}>Editar</button>
                                                    <button type="button">Eliminar</button>
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
