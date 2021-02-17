import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../../Global'
import SelectRoles from '../addUserComponent/SelectRoles'
import ChangePassword from '../../changePassword/ChangePassword'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import Logo from '../../Home/logo_background.png';
import SeleccionarGrupo from './SeleccionarGrupo'

export default class editUserComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
            redirect: false
        }
    }

    handleChange = (event) => {
        this.sexo = event.target.value
    }

    handleChangeStatus = (event) => {
        this.userActive = event.target.value
    }

    handleChangeTurno = (event) => {
        this.turno = event.target.value
    }

    modifyUser = () => {
        // e.preventDefault()
        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = {
            // id: this.id.value,
            // dni: this.dni.value,
            name: this.name.value,
            lastName: this.lastName.value,
            role: this.role,
            legajo: this.legajo.value,
            email: this.email.value,
            phone: this.phone.value,
            sexo: this.sexo,
            userActive: this.userActive,
            fechaIngresoLinea: this.fechaIngresoLinea.value,
            fechaBaja: this.fechaBaja.value,
            motivoBaja: this.motivoBaja.value,
            propiedad: this.propiedad.value,
            canal: this.canal.value,
            negocio: this.negocio.value,
            razonSocial: this.razonSocial.value,
            edificioLaboral: this.edificioLaboral.value,
            gerencia1: this.gerencia1.value,
            nameG1: this.nameG1.value,
            gerencia2: this.gerencia2.value,
            nameG2: this.nameG2.value,
            jefeCoordinador: this.jefeCoordinador.value,
            responsable: this.responsable.value,
            supervisor: this.supervisor.value,
            lider: this.lider.value,
            provincia: this.provincia.value,
            region: this.region.value,
            subregion: this.subregion.value,
            equipoEspecifico: this.equipoEspecifico.value,
            puntoVenta: this.puntoVenta.value,
            group: this.group,
            turno: this.turno,
            // imagen: this.imagen.value
        }

        let id = this.props.location.state.userSelected.id

        axios.post(Global.modifyUser + id, bodyParameters, config)
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                this.setState({
                    redirect: true
                })
                swal("Genial!", "Usuario editado exitosamente!", "success");
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    // swal("Error!", "Hubo un problema al agregar el usuario", "error");
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            })

    }

    componentDidMount() {
        let token = JSON.parse(localStorage.getItem('token'))
        // Protección de rutas
        if (token === null) {
            return <Redirect to={'/'} />
        }

        if (this.props.location.state) {
            let id = this.props.location.state.userSelected.id
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            axios.get(Global.getUsers + '/' + id, config)
                .then(response => {
                    this.setState({
                        userInfo: response.data.Data[0]
                    })
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        // swal("Error!", "Hubo un problema", "error");
                        swal("Error!", `${e.response.data.Message}`, "error");
                        this.setState({
                            redirect: true
                        })
                    }
                    console.log("Error: ", e)
                })
        } else {
            this.setState({
                redirect: true
            })
            return HELPER_FUNCTIONS.logout()
        }
    }

    render() {
        const user = this.state.userInfo
        if (this.state.redirect) {
            return <Redirect to="/users" />
        }

        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />

                </div>

                <div className="logoBackground">
                    <img src={Logo} alt="" title="Logo" className="logoFixed" />
                </div>
                <section className="section-content">
                {user !== null &&
                    <form className="inputsEditUser addUserPadding">
                <h4>Editar Usuario</h4>
                    <hr />
                    <br />  
                        <div className="Label headEditUser">ID
                        <input className={`form-control ${!user.userActive ? "Inactivo " : 'Activo'}`} type="text" placeholder="id" name="id" ref={(c) => this.id = c} defaultValue={user.id ? user.id : ''} disabled />
                            <select onChange={this.handleChangeStatus}>
                                <option value={user.userActive}>{user.userActive ? "Activo" : "Inactivo"}</option>
                                <option value={!user.userActive}>{user.userActive ? "Inactivo" : "Activo"}</option>
                            </select>
                            {this.state.userInfo !== null &&
                                <ChangePassword user={this.state.userInfo} />
                            }


                        </div>

                        <span className="Label">Nombre</span>
                        <input className="form-control" type="text" placeholder="name" name="name" ref={(c) => this.name = c} defaultValue={user.name ? user.name : ''} />
                        <span className="Label">Apellido</span>
                        <input className="form-control" type="text" placeholder="lastName" name="lastName" ref={(c) => this.lastName = c} defaultValue={user.lastName ? user.lastName : ''} />
                        {/* <input type="text" placeholder="role" ref={(c) => this.role = c} defaultValue={user.role ? user.role : ''} /> */}
                        <SelectRoles getValue={(c) => this.role = c} defaultValue={user.role.id ? user.role.id : ''} />
                        <span className="Label">Legajo</span>
                        <input className="form-control" type="text" placeholder="legajo" ref={(c) => this.legajo = c} defaultValue={user.legajo ? user.legajo : ''} />
                        <span className="Label">Email</span>
                        <input className="form-control" type="text" placeholder="email" ref={(c) => this.email = c} defaultValue={user.email ? user.email : ''} />
                        <span className="Label">Telefono</span>
                        <input className="form-control" type="text" placeholder="phone" ref={(c) => this.phone = c} defaultValue={user.phone ? user.phone : ''} />
                        {/* <input type="text" placeholder="sexo" ref={(c) => this.sexo = c} defaultValue={user.sexo ? user.sexo : ''} /> */}
                        <div>
                            <span className="Label">Sexo</span>
                            <select onChange={this.handleChange} selected="OTRO">
                                <option value={user.sexo}>{user.sexo || ""}</option>
                                <option value="MASCULINO">Hombre</option>
                                <option value="FEMENINO">Mujer</option>
                                <option value="OTRO">Otro</option>
                            </select>
                            {/* <input type="text" placeholder="status" ref={(c) => this.status = c} defaultValue={user.status ? user.status : ''} /> */}
                        </div>
                        <span className="Label">Fecha Ingreso</span>
                        <input className="form-control" type="date" placeholder="" ref={(c) => this.fechaIngresoLinea = c} defaultValue={user.fechaIngresoLinea ? user.fechaIngresoLinea : ''} />
                        <span className="Label">Fecha de baja</span>
                        <input className="form-control" type="date" placeholder="" ref={(c) => this.fechaBaja = c} defaultValue={user.fechaBaja ? user.fechaBaja : ''} />
                        <span className="Label">Motivo de baja</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.motivoBaja = c} defaultValue={user.motivoBaja ? user.motivoBaja : ''} />
                        <span className="Label">Propiedad</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.propiedad = c} defaultValue={user.propiedad ? user.propiedad : ''} />
                        <span className="Label">Canal</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.canal = c} defaultValue={user.canal ? user.canal : ''} />
                        <span className="Label">Negocio</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.negocio = c} defaultValue={user.negocio ? user.negocio : ''} />
                        <span className="Label">Razón social</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.razonSocial = c} defaultValue={user.razonSocial ? user.razonSocial : ''} />
                        <span className="Label">Edificio laboral</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.edificioLaboral = c} defaultValue={user.edificioLaboral ? user.edificioLaboral : ''} />
                        <span className="Label">Gerencia</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.gerencia1 = c} defaultValue={user.gerencia1 ? user.gerencia1 : ''} />
                        <span className="Label">Gerente</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.nameG1 = c} defaultValue={user.nameG1 ? user.nameG1 : ''} />
                        <span className="Label">Nombre Gerencia</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.gerencia2 = c} defaultValue={user.gerencia2 ? user.gerencia2 : ''} />
                        <span className="Label">Coordinador</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.nameG2 = c} defaultValue={user.nameG2 ? user.nameG2 : ''} />
                        <span className="Label">Jefe Coordinador</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.jefeCoordinador = c} defaultValue={user.jefeCoordinador ? user.jefeCoordinador : ''} />
                        <span className="Label">Responsable</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.responsable = c} defaultValue={user.responsable ? user.responsable : ''} />
                        <span className="Label">Supervisor</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.supervisor = c} defaultValue={user.supervisor ? user.supervisor : ''} />
                        <span className="Label">Líder</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.lider = c} defaultValue={user.lider ? user.lider : ''} />
                        <span className="Label">Provincia</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.provincia = c} defaultValue={user.provincia ? user.provincia : ''} />
                        <span className="Label">Región</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.region = c} defaultValue={user.region ? user.region : ''} />
                        <span className="Label">Subregión</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.subregion = c} defaultValue={user.subregion ? user.subregion : ''} />
                        <span className="Label">Equipo específico</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.equipoEspecifico = c} defaultValue={user.equipoEspecifico ? user.equipoEspecifico : ''} />
                        <span className="Label">Punto Venta</span>
                        <input className="form-control" type="text" placeholder="" ref={(c) => this.puntoVenta = c} defaultValue={user.puntoVenta ? user.puntoVenta : ''} />
                        {/* <input type="text" placeholder="group" ref={(c) => this.group = c} defaultValue={user.group ? user.group : ''} /> */}
                        <SeleccionarGrupo getValue={(c) => this.group = c} defaultValue={user.group ? user.group : ''} />
                        <select onChange={this.handleChangeTurno} className="form-control select-t" style={{ marginTop: '34px' }}>
                            <option value={user.turno ? user.turno : 'TM'}>{user.turno ? user.turno === 'TM' ? 'TM' : 'TT' : "TM"}</option>
                            <option value={user.turno ? user.turno === 'TM' ? 'TT' : 'TM' : 'TT'}>{user.turno ? user.turno === 'TT' ? 'TM' : 'TT' : "TT"}</option>
                        </select>
                        {/* <input type="text" placeholder="imagen" ref={(c) => this.imagen = c} defaultValue={user.imagen ? user.imagen : ''} /> */}
                        {HELPER_FUNCTIONS.checkPermission("POST|users/:id") &&
                            <button className="btn btn-block btn-info guardar-cambios" alt="sign in"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.modifyUser()
                                }}
                            >Guardar</button>
                        }
                    </form>
                }

               
                    
             
                    </section>
            </div>
        )
    }
}
