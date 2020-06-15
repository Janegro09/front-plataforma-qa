import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'
import SelectGroup from '../addUserComponent/SelectGroup'
import SelectRoles from '../addUserComponent/SelectRoles'
import ChangePassword from '../changePassword/ChangePassword'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import Logo from '../Home/logo_background.png';

export default class editUserComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: null,
            redirect: false
        }
        this.modifyUser = this.modifyUser.bind(this)
        this.handleChangeStatus = this.handleChangeStatus.bind(this)
        this.handleChangeTurno = this.handleChangeTurno.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        let token = JSON.parse(sessionStorage.getItem('token'))
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
                    console.log("user: ", response.data.Data[0])
                    this.setState({
                        userInfo: response.data.Data[0]
                    })
                    sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        swal("Error!", "Hubo un problema", "error");
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

    handleChange(event) {
        this.sexo = event.target.value
    }

    handleChangeStatus(event) {
        console.log(this.userActive);

        this.userActive = event.target.value
    }

    handleChangeTurno(event) {
        this.turno = event.target.value
    }

    modifyUser(e) {
        e.preventDefault()
        let token = JSON.parse(sessionStorage.getItem('token'))
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
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                this.setState({
                    redirect: true
                })
                swal("Genial!", "Usuario editado exitosamente!", "success");
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar el usuario", "error");
                }
                console.log("Error: ", e)
            })

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
                    {this.state.userInfo !== null &&
                         <ChangePassword user={this.state.userInfo} />
                         }
                </div>

                <div className="logoBackground">
                    <img src={Logo} alt="Logo" title="Logo" className="logoFixed" />
                </div>


                {user !== null &&
                    <form className="inputsEditUser" onSubmit={this.modifyUser}>
                        <span className="Label">ID</span>
                        <select onChange={this.handleChangeStatus}>
                            <option value={user.userActive}>{user.userActive ? "Activo" : "Inactivo"}</option>
                            <option value={!user.userActive}>{user.userActive ? "Inactivo" : "Activo"}</option>
                        </select>
                        <input className={`form-control ${!user.userActive ? "Inactivo " : 'Activo'}`} type="text" placeholder="id" name="id" ref={(c) => this.id = c} defaultValue={user.id ? user.id : ''} disabled />        
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
                        <select onChange={this.handleChange} selected="OTRO">
                            <option value={user.sexo}>{user.sexo || ""}</option>
                            <option value="MASCULINO">Hombre</option>
                            <option value="FEMENINO">Mujer</option>
                            <option value="OTRO">Otro</option>
                        </select>
                        {/* <input type="text" placeholder="status" ref={(c) => this.status = c} defaultValue={user.status ? user.status : ''} /> */}

                        <span className="Label">Fecha Ingreso</span>
                        <input className="form-control" type="date" placeholder="fechaIngresoLinea" ref={(c) => this.fechaIngresoLinea = c} defaultValue={user.fechaIngresoLinea ? user.fechaIngresoLinea : ''} />
                        <span className="Label">Fecha de baja</span>
                        <input className="form-control" type="date" placeholder="fechaBaja" ref={(c) => this.fechaBaja = c} defaultValue={user.fechaBaja ? user.fechaBaja : ''} />
                        <span className="Label">Motivo de baja</span>
                        <input className="form-control" type="text" placeholder="motivoBaja" ref={(c) => this.motivoBaja = c} defaultValue={user.motivoBaja ? user.motivoBaja : ''} />
                        <span className="Label">Propiedad</span>
                        <input className="form-control" type="text" placeholder="propiedad" ref={(c) => this.propiedad = c} defaultValue={user.propiedad ? user.propiedad : ''} />
                        <span className="Label">Canal</span>
                        <input className="form-control" type="text" placeholder="canal" ref={(c) => this.canal = c} defaultValue={user.canal ? user.canal : ''} />
                        <span className="Label">Negocio</span>
                        <input className="form-control" type="text" placeholder="negocio" ref={(c) => this.negocio = c} defaultValue={user.negocio ? user.negocio : ''} />
                        <span className="Label">Razón social</span>
                        <input className="form-control" type="text" placeholder="razonSocial" ref={(c) => this.razonSocial = c} defaultValue={user.razonSocial ? user.razonSocial : ''} />
                        <span className="Label">Edificio laboral</span>
                        <input className="form-control" type="text" placeholder="edificioLaboral" ref={(c) => this.edificioLaboral = c} defaultValue={user.edificioLaboral ? user.edificioLaboral : ''} />
                        <span className="Label">Gerencia</span>
                        <input className="form-control" type="text" placeholder="gerencia1" ref={(c) => this.gerencia1 = c} defaultValue={user.gerencia1 ? user.gerencia1 : ''} />
                        <span className="Label">Gerente</span>
                        <input className="form-control" type="text" placeholder="nameG1" ref={(c) => this.nameG1 = c} defaultValue={user.nameG1 ? user.nameG1 : ''} />
                        <span className="Label">Nombre Gerencia</span>
                        <input className="form-control" type="text" placeholder="gerencia2" ref={(c) => this.gerencia2 = c} defaultValue={user.gerencia2 ? user.gerencia2 : ''} />
                        <span className="Label">Coordinador</span>
                        <input className="form-control" type="text" placeholder="nameG2" ref={(c) => this.nameG2 = c} defaultValue={user.nameG2 ? user.nameG2 : ''} />
                        <span className="Label">Jefe Coordinador</span>
                        <input className="form-control" type="text" placeholder="jefeCoordinador" ref={(c) => this.jefeCoordinador = c} defaultValue={user.jefeCoordinador ? user.jefeCoordinador : ''} />
                        <span className="Label">Responsable</span>
                        <input className="form-control" type="text" placeholder="responsable" ref={(c) => this.responsable = c} defaultValue={user.responsable ? user.responsable : ''} />
                        <span className="Label">Supervisor</span>
                        <input className="form-control" type="text" placeholder="supervisor" ref={(c) => this.supervisor = c} defaultValue={user.supervisor ? user.supervisor : ''} />
                        <span className="Label">Líder</span>
                        <input className="form-control" type="text" placeholder="lider" ref={(c) => this.lider = c} defaultValue={user.lider ? user.lider : ''} />
                        <span className="Label">Provincia</span>
                        <input className="form-control" type="text" placeholder="provincia" ref={(c) => this.provincia = c} defaultValue={user.provincia ? user.provincia : ''} />
                        <span className="Label">Región</span>
                        <input className="form-control" type="text" placeholder="region" ref={(c) => this.region = c} defaultValue={user.region ? user.region : ''} />
                        <span className="Label">Subregión</span>
                        <input className="form-control" type="text" placeholder="subregion" ref={(c) => this.subregion = c} defaultValue={user.subregion ? user.subregion : ''} />
                        <span className="Label">Equipo específico</span>
                        <input className="form-control" type="text" placeholder="equipoEspecifico" ref={(c) => this.equipoEspecifico = c} defaultValue={user.equipoEspecifico ? user.equipoEspecifico : ''} />
                        <span className="Label">Punto Venta</span>
                        <input className="form-control" type="text" placeholder="puntoVenta" ref={(c) => this.puntoVenta = c} defaultValue={user.puntoVenta ? user.puntoVenta : ''} />
                        {/* <input type="text" placeholder="group" ref={(c) => this.group = c} defaultValue={user.group ? user.group : ''} /> */}
                        <SelectGroup getValue={(c) => this.group = c} defaultValue={user.group ? user.group : ''} />
                        <select onChange={this.handleChangeTurno} className="form-control select-t">
                            <option value={user.turno ? user.turno : 'TM'}>{user.turno ? user.turno === 'TM' ? 'TM' : 'TT' : "TM"}</option>
                            <option value={user.turno ? user.turno === 'TM' ? 'TT' : 'TM' : 'TT'}>{user.turno ? user.turno === 'TT' ? 'TM' : 'TT' : "TT"}</option>
                        </select>
                        {/* <input type="text" placeholder="imagen" ref={(c) => this.imagen = c} defaultValue={user.imagen ? user.imagen : ''} /> */}
                        {HELPER_FUNCTIONS.checkPermission("POST|users/:id") &&
                        <button  className="btn btn-block btn-info ripple-effect confirmar" type="submit" name="Submit" alt="sign in">Guardar cambios</button>
                    
                         
                        }
                    </form>
                }

            </div>
        )
    }
}
