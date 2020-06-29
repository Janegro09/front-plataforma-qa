import React, { Component } from 'react'
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../../Global'
import SelectGroup from './SelectGroup'
import SelectRoles from './SelectRoles'
import SimpleReactValidator from 'simple-react-validator'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import { Redirect } from 'react-router-dom'
import Logo from '../../Home/logo_background.png';

export default class addUserComponent extends Component {
    constructor(props) {
        super(props)
        this.addUser = this.addUser.bind(this)
        this.state = {
            groups: null,
            roles: null,
            redirect: false
        }

        this.validator = new SimpleReactValidator({
            messages: {
                required: 'Completá este campo'
            }
        });
        this.handleChange = this.handleChange.bind(this);
        this.handleTurno = this.handleTurno.bind(this);
    }

    addUser(event) {
        event.preventDefault()
        console.log(this.validator)
        if (!this.validator.allValid()) {
            swal("Error!", "Parámetros inválidos", "error");
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            let token = JSON.parse(sessionStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const bodyParameters = {
                id: this.id.value,
                dni: this.dni.value,
                name: this.name.value,
                lastName: this.lastName.value,
                role: this.role,
                legajo: this.legajo.value,
                email: this.email.value,
                phone: this.phone.value,
                sexo: this.sexo,
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

            axios.post(
                Global.createUser,
                bodyParameters,
                config
            ).then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                this.setState({
                    redirect: true
                })
                swal("Usuario creado!", "Ya se encuentra registrado", "success");
            }).catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar el usuario", "error");
                }
                console.log("Error: ", e)
            });
        }

    }

    componentDidMount() {
        // console.log(HELPER_FUNCTIONS.logout)
        axios.get(Global.frontUtilities)
            .then(response => {
                this.setState({
                    groups: response.data.Data.groups,
                    roles: response.data.Data.roles
                })

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

    handleChange(event) {
        this.sexo = event.target.value
    }

    handleTurno(event) {
        this.turno = event.target.value
    }

    render() {
        // Protección de rutas
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }

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
                    <img src={Logo} alt="Logo" title="Logo" className="logoFixed" />
                </div>

                <form onSubmit={this.addUser} className="inputsEditUser addUserPadding">
                    
                    <input className="form-control" type="text" placeholder="id" name="id" ref={(c) => this.id = c} required />
                    <div className="error">
                        {
                            this.validator.message('title', this.id, 'required')
                        }
                    </div>
                    <span className="Label">Dni</span>
                    <input className="form-control" type="text" placeholder="" name="dni" ref={(c) => this.dni = c} required />
                    <span className="Label">Nombre</span>
                    <input className="form-control" type="text" placeholder="" name="name" ref={(c) => this.name = c} required />
                    <span className="Label">Apellido</span>
                    <input className="form-control" type="text" placeholder="" name="lastName" ref={(c) => this.lastName = c} required />
                    <SelectRoles getValue={(c) => this.role = c} />
                    <span className="Label">Legajo</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.legajo = c} />
                    <span className="Label">Email</span>
                    <input className="form-control" type="email" placeholder="" ref={(c) => this.email = c} required />
                    <span className="Label">Telefono</span>
                    <input className="form-control" type="tel" placeholder="" ref={(c) => this.phone = c} />
                    <div>
                    <span className="Label">Sexo</span>
                    <select onChange={this.handleChange}>
                        <option value="MASCULINO">Hombre</option>
                        <option value="FEMENINO">Mujer</option>
                        <option value="OTRO">Otro</option>
                    </select>
                    </div>
                    <span className="Label">Fecha Ingreso</span>
                    <input className="form-control" type="date" placeholder="" ref={(c) => this.fechaIngresoLinea = c} />
                    <span className="Label">Fecha de baja</span>
                    <input className="form-control" type="date" placeholder="" ref={(c) => this.fechaBaja = c} />
                    <span className="Label">Motivo de baja</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.motivoBaja = c} />
                    <span className="Label">Propiedad</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.propiedad = c} />
                    <span className="Label">Canal</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.canal = c} />
                    <span className="Label">Negocio</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.negocio = c} />
                    <span className="Label">Razón social</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.razonSocial = c} />
                    <span className="Label">Edificio laboral</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.edificioLaboral = c} />
                    <span className="Label">Gerencia</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.gerencia1 = c} />
                    <span className="Label">Gerente</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.nameG1 = c} />
                    <span className="Label">Nombre Gerencia</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.gerencia2 = c} />
                    <span className="Label">Coordinador</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.nameG2 = c} />
                    <span className="Label">Jefe Coordinador</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.jefeCoordinador = c} />
                    <span className="Label">Responsable</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.responsable = c} />
                    <span className="Label">Supervisor</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.supervisor = c} />
                    <span className="Label">Líder</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.lider = c} />
                    <span className="Label">Provincia</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.provincia = c} />
                    <span className="Label">Región</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.region = c} />
                    <span className="Label">Subregión</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.subregion = c} />
                    <span className="Label">Equipo específico</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.equipoEspecifico = c} />
                    <span className="Label">Punto venta</span>
                    <input className="form-control" type="text" placeholder="" ref={(c) => this.puntoVenta = c} />
                    <SelectGroup getValue={(c) => this.group = c} />
                    <select onChange={this.handleTurno}>
                        <option value="TT">TT</option>
                        <option value="TM">TM</option>
                    </select>
                    {/* <input type="text" placeholder="turno" ref={(c) => this.turno = c} /> */}
                    {/* <input type="text" placeholder="imagen" ref={(c) => this.imagen = c} /> */}
                    <button  className="btn btn-block btn-info ripple-effect confirmar" type="submit" name="Submit" alt="sign in">Crear Usuario</button>
                    
               

                    
                </form>
            </div>
        )
    }
}
