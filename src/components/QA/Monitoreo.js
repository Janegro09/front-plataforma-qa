import React, { Component } from 'react';
import axios from 'axios';
import SiderbarLeft from '../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import ModalNuevoMonitoreo from './ModalNuevoMonitoreo';
import './Mon.css';
// import moment from 'moment';
import moment from 'moment-timezone';
import { Redirect } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import { Breadcrumbs } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
export default class Monitoreo extends Component {
    state = {
        abrirModal: false,
        buscador: {
            program: []
        },
        buscadorUsuario: "",
        buscadorUsuarioCreatedBy: "",
        empresasSeleccionadas: [],
        limit: 150,
        loading: false,
        monitoreos: [],
        monitoreosSeleccionados: [],
        monitoreosTotales:0,
        offset: 0,
        programs: [],
        programsGroups: [],
        redirect: false,
        toggleBuscador: true,
        users: [],
        usuariosConFiltro: [],
        usuarioSeleccionado: null,
        usuarioSeleccionadoCreatedBy: null,
    }

    handleChangeLimit = (e) => {
        this.setState({
            limit :e.target.value
        })
    }

    handleChangeLimit = (e) => {
        this.setState({
            limit: e.target.value
        })
    }

    nuevoMonitoreo = (e) => {
        e.preventDefault();
        this.setState({ abrirModal: true });
    }

    get_all_programs = () => {
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        axios.get(Global.getAllProgramsGroups, { headers: { Authorization: bearer } }).then(response => {
            const programsGroups = response.data.Data || [];
            this.setState({
                programsGroups,
                loading: false
            })
        }).catch((e) => {
            // Si hay alg??n error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                this.setState({
                    loading: false
                })
                swal("Error!", `${e.response.data.Message}`, "error");
            }
            console.log("Error: ", e)
        });
    }

    get_users = async (q = "") => {
        this.setState({ loading: true })
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        try {
            const response =  await axios.get(Global.getUsers + '?specificdata=true&limit=5&offset=0&q=' + q, { headers: { Authorization: bearer } });
            let users = response.data.Data;
            this.setState({ loading: false })
            return users || [];
        } catch (e) {
            this.setState({ loading: false })

            // Si hay alg??n error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                return []
            }

            console.log("Error: ", e)
        }
    }

    componentDidMount() {
        HELPER_FUNCTIONS.set_page_title('Monitorings');
        this.get_all_programs();
    }

    buscar = (e) => {
        e.preventDefault();
        let buscador_init = { monitoreos: [], offset: 0, limit: this.state.limit }
        this.setState(buscador_init);
        this.get_monitorings(buscador_init);
    }

    verMas = (e) => {
        e.preventDefault();
        this.get_monitorings({});
    }

    get_monitorings = ({ limit = this.state.limit, offset = false }) => {
        const { buscador } = this.state;
        this.setState({
            loading: true
        });
        buscador.offset = this.state.offset || 0;
        buscador.limit  = this.state.limit  || 150;

        if( offset !== false ){
            buscador.offset=offset;
        } 

        if( limit !== false ){
            buscador.limit=limit;
        }

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


        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.monitoreos + query, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            // console.log(response.data.Data);
            this.setState({
                monitoreosTotales:response.data.Data[0].monitoring_total_count,
                monitoreos: [...this.state.monitoreos, ...response.data.Data],
                offset: [...this.state.monitoreos, ...response.data.Data].length,
                loading: false,
                toggleBuscador: false
            })

        })
            .catch((e) => {
                // Si hay alg??n error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
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

        this.get_users(buscado).then(v => {
            this.setState({ usuariosConFiltro: v, buscadorUsuario: buscado });
        }).catch(() => {
            this.setState({ loading: false })
        }) 

    }

    buscarUsuarioCreatedBy = (e) => {
        let buscado = e.target.value.toLowerCase();

        this.get_users(buscado).then(v => {
            this.setState({ usuariosConFiltro: v, buscadorUsuarioCreatedBy: buscado });
        }).catch(() => {
            this.setState({ loading: false })
        }) 
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
        let { value } = e.target;
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
            switch(id) {
                case 'dateCreatedAtStart':
                case 'dateCreatedAtEnd':
                    // Formateamos la fecha y le agregamos la zona horaria a 0
                    value += ':00.00Z';
                break;
                default:

            }
            buscador[id] = value;
        }

        console.log(value);

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
            text: "Estas por eliminar un monitoreo, no podr??s recuperarlo",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let token = JSON.parse(localStorage.getItem('token'))
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    axios.delete(Global.monitoreos + "/" + id, config)
                        .then(response => {
                            localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
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
                                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                swal(e.response.data.Message, {
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

        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        this.setState({ loading: true });

        axios.post(Global.monitoreos + '/exports', dataToSend, config).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            })

            let p = response.data.Data || false;

            if (p.tempId) {
                let win = window.open(Global.download + '/' + p.tempId, '_blank');
                win.focus();
            }

        }).catch((e) => {
            // Si hay alg??n error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
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

        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        this.setState({ loading: true, empresasSeleccionadas: empresas });

        axios.post(Global.monitoreos + '/filters', dataToSend, config).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let programs = response.data.Data.programs || false;
            this.setState({
                buscador,
                empresasSeleccionadas: empresas,
                programs,
                loading: false
            })

        }).catch((e) => {
            // Si hay alg??n error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
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

                    {toggleBuscador && <>
                        <div className="buscadorMon">
                            
                            {/* User id */}
                            <article>
                                <h6>Id de Usuario</h6>
                                <br />
                                <input
                                    type="text"
                                    placeholder="Buscar usuario"
                                    onBlur={this.buscarUsuario}
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
                                        {usuariosConFiltro.map(user => {
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
                             
                           
                                <article>
                                    <h6>Programa</h6>
                                    <br />
                                    <select onChange={this.changeBuscador} value="" id="program" disabled={!programs.length}>
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


                                {/* <article>
                                <h6>Cantidad de Monitoreos</h6>
                                <br />
                                <select onChange={ this.handleChangeLimit } value={this.state.limit} id="limit">
                                        <option>Selecciona...</option>

                                        {[10,50,100,150].map(v => {
                                            return <option key={v} value={v}>{v}</option>
                                        })
                                        }
                                    </select>
                                    
                                </article>   */}
                            <br/>




                                <br />
                                
                           
                            </div>
                            <div className="buscadorMon">
                            {/* Fecha de transaccion */}
                            <article>
                                <h6>Fecha de Creaci??n</h6>
                                <br />
                                <span>
                                    <label>Desde</label>
                                    <input className="form-control" type="datetime-local" id="dateCreatedAtStart" onChange={this.changeBuscador} />
                                </span>
                                <span>
                                    <label>Hasta</label>
                                    <input className="form-control" type="datetime-local" id="dateCreatedAtEnd" onChange={this.changeBuscador} />
                                </span>
                            </article>
                            <br />

                            {/* Responses */}
                            {/* <article>
                                <h6>Respuestas</h6>
                            </article>
                            <hr /> */}

                            {/* Status */}
                    
                            <br />

                            {/* Case id */}
 
                            <br />

                            {/* Created by */}
                            <article>
                                <h6>Creado por</h6>
                                <br />
                                <input
                                    type="text"
                                    placeholder="Buscar usuario"
                                    onBlur={this.buscarUsuarioCreatedBy}
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
                            <article className="input-add-spacebetween">
                            <h6>Id del caso</h6>
                                <br />
                                <input className="form-control" type="text" id="caseId" onChange={this.changeBuscador} value={buscador.caseId} />
                                <br />
                                {/* Se comenta por pedido de Gabriel, modificaciones 20/11/2020 */}
                                {/* <h6>Estado</h6>
                                <br />
                                <select onChange={this.changeBuscador} value={buscador.status} id="status">
                                    <option>Selecciona...</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="run">En proceso</option>
                                    <option value="finished">Terminado</option>
                                </select>    */}
                                <span className="flexAlignCenter"> 
                                <h6>Observado</h6>
                                
                                <Checkbox type="checkbox" id="disputado" onChange={this.changeBuscador} checked={buscador.disputado} />
                                </span>
                                <span className="flexAlignCenter"> 
                                <h6>Respuesta a observacion</h6>
                                
                                <Checkbox type="checkbox" id="disputar_response" onChange={this.changeBuscador} checked={buscador.disputar_response} />
                                </span>
                                <span className="flexAlignCenter">
                                <h6>Devolucion al representante</h6>
                                
                                <Checkbox type="checkbox" id="evaluated" onChange={this.changeBuscador} checked={buscador.evaluated} />
                                </span>
                            </article>
                            <br />
                            <Breadcrumbs />
                            <br />
                        </div>
                            
                            <button className="btnSecundario" type="button" onClick={this.buscar}>Buscar</button>
                            </>
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
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Seleccionar</th>
                                        <th>ID del caso</th>
                                        <th>Creado Por</th>
                                        <th>Usuario monitoreado</th>
                                        <th>Fecha de creaci??n</th>
                                        <th>Fecha de Transacci??n</th>
                                        <th>Modificado por</th>
                                        <th>Programa</th>
                                        {/* <th>Estado</th> */}
                                        <th>Observaciones</th>
                                        {/* <th>Invalidado</th> */}
                                        <th>RT. Observaci??n</th>
                                        <th>Devoluci??n</th>
                                        <th>Calificaci??n</th>
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
                                                <td>{moment(mon.createdAt).tz("America/Argentina/Buenos_Aires").format('DD/MM/YYYY  HH:mm')}</td>
                                                <td>{moment(mon.transactionDate).tz("Europe/Lisbon").format('DD/MM/YYYY ')}</td>
                                                <td>{mon.modifiedBy.length}</td>
                                                <td>{mon.program}</td>
                                                {/* <td>{(mon.status === 'pending' ? <TimerIcon className="timerIcon" /> : (mon.status === 'finished' ? <CheckIcon className="CheckIcon" /> : <PlayArrowRoundedIcon className="PlayArrowRoundedIcon" />))}</td> */}
                                                <td className="tablaVariables tableIcons"><div className={mon.disputado ? "estadoInactivoObs" : "estadoActivoObs" }></div></td>
                                                <td className="tablaVariables tableIcons"><div className={mon.disputar_response ? "estadoActivo" : "estadoInactivo"}></div></td>
                                                {/* <td className="tablaVariables tableIcons"><div className={mon.invalidated ? "estadoActivo" : "estadoInactivo"}></div></td> */}
                                                <td className="tablaVariables tableIcons"><div className={mon.devolucionRepresentante ? "estadoActivo" : "estadoInactivo"}></div></td>
                                                <td>
                                                    {(mon.improvment === "+" || mon.improvment === '++' ? 
                                                        <ExpandLessIcon className="arrowUp" /> : (mon.improvment === "+-" ?
                                                            <UnfoldMoreIcon /> : <ExpandMoreIcon className="arrowDown" />))}
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
                            <div className="flex-row-reverse">
                                <small>
                                    Mostrando {monitoreos.length} de {this.state.monitoreosTotales}
                                </small>
                            </div>
                        </> 
                        }
                        {monitoreos.length === 0 &&
                            <div className="alert alert-warning">No existen monitoreos para mostrar</div>
                        }
                    </div>
                    {monitoreos.length > 0 && (this.state.monitoreosTotales-monitoreos.length)>0 &&
                        <button 
                            className="btnSecundario" 
                            onClick={this.verMas}
                            disabled={(this.state.monitoreosTotales-monitoreos.length)<=0}
                                >
                            VER MAS 
                            ({this.state.monitoreosTotales-monitoreos.length})
                            </button>
                    }
                </div>
            </>
        )
    }
}
