import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'
import SelectGroup from './SelectGroup'
import SelectRoles from './SelectRoles'
import SimpleReactValidator from 'simple-react-validator'
import {HELPER_FUNCTIONS} from '../../helpers/Helpers'

export default class addUserComponent extends Component {
    constructor(props) {
        super(props)
        this.addUser = this.addUser.bind(this)
        this.state = {
            groups: null,
            roles: null
        }

        this.validator = new SimpleReactValidator({
            messages: {
                required: 'Completá este campo'
            }
        });
        this.handleChange = this.handleChange.bind(this);
    }

    addUser(event) {
        event.preventDefault()
        console.log(this.validator)
        if (this.validator.allValid()) {
            alert("ok")
        } else {
            alert()
            this.validator.showMessages();
            this.forceUpdate();
        }

        let token = JSON.parse(localStorage.getItem('token'))
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
            status: this.status.value,
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
            turno: this.turno.value,
            // imagen: this.imagen.value
        }

        axios.post(
            Global.createUser,
            bodyParameters,
            config
        ).then(response => {
            localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
        }).catch(e => {
            console.log(e)
            HELPER_FUNCTIONS.logout()
        });
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
                console.log("Error: ", e)
            })
    }

    handleChange(event) {
        this.sexo = event.target.value
    }

    render() {

        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>

                <form onSubmit={this.addUser}>
                    <input type="text" placeholder="id" name="id" ref={(c) => this.id = c} required />
                    <div className="error">
                        {
                            this.validator.message('title', this.id, 'required')
                        }
                    </div>
                    <input type="text" placeholder="dni" name="dni" ref={(c) => this.dni = c} required />
                    <input type="text" placeholder="name" name="name" ref={(c) => this.name = c} required />
                    <input type="text" placeholder="lastName" name="lastName" ref={(c) => this.lastName = c} required />
                    <SelectRoles getValue={(c) => this.role = c} />

                    <input type="text" placeholder="legajo" ref={(c) => this.legajo = c} />
                    <input type="email" placeholder="email" ref={(c) => this.email = c} required />
                    <input type="tel" placeholder="phone" ref={(c) => this.phone = c} />
                    <select onChange={this.handleChange}>
                        <option value="MASCULINO">Hombre</option>
                        <option value="FEMENINO">Mujer</option>
                        <option value="OTRO">Otro</option>
                    </select>
                    <input type="text" placeholder="status" ref={(c) => this.status = c} />
                    <input type="date" placeholder="fechaIngresoLinea" ref={(c) => this.fechaIngresoLinea = c} />
                    <input type="date" placeholder="fechaBaja" ref={(c) => this.fechaBaja = c} />
                    <input type="text" placeholder="motivoBaja" ref={(c) => this.motivoBaja = c} />
                    <input type="text" placeholder="propiedad" ref={(c) => this.propiedad = c} />
                    <input type="text" placeholder="canal" ref={(c) => this.canal = c} />
                    <input type="text" placeholder="negocio" ref={(c) => this.negocio = c} />
                    <input type="text" placeholder="razonSocial" ref={(c) => this.razonSocial = c} />
                    <input type="text" placeholder="edificioLaboral" ref={(c) => this.edificioLaboral = c} />
                    <input type="text" placeholder="gerencia1" ref={(c) => this.gerencia1 = c} />
                    <input type="text" placeholder="nameG1" ref={(c) => this.nameG1 = c} />
                    <input type="text" placeholder="gerencia2" ref={(c) => this.gerencia2 = c} />
                    <input type="text" placeholder="nameG2" ref={(c) => this.nameG2 = c} />
                    <input type="text" placeholder="jefeCoordinador" ref={(c) => this.jefeCoordinador = c} />
                    <input type="text" placeholder="responsable" ref={(c) => this.responsable = c} />
                    <input type="text" placeholder="supervisor" ref={(c) => this.supervisor = c} />
                    <input type="text" placeholder="lider" ref={(c) => this.lider = c} />
                    <input type="text" placeholder="provincia" ref={(c) => this.provincia = c} />
                    <input type="text" placeholder="region" ref={(c) => this.region = c} />
                    <input type="text" placeholder="subregion" ref={(c) => this.subregion = c} />
                    <input type="text" placeholder="equipoEspecifico" ref={(c) => this.equipoEspecifico = c} />
                    <input type="text" placeholder="puntoVenta" ref={(c) => this.puntoVenta = c} />
                    <SelectGroup getValue={(c) => this.group = c} />
                    <input type="text" placeholder="turno" ref={(c) => this.turno = c} />
                    {/* <input type="text" placeholder="imagen" ref={(c) => this.imagen = c} /> */}
                    <input type="submit" value="Crear usuario" />
                </form>
            </div>
        )
    }
}
