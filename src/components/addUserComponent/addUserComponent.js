import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'

export default class addUserComponent extends Component {
    constructor(props) {
        super(props)
        this.addUser = this.addUser.bind(this)
    }

    /*
// CREAR USUARIO
token = JSON.parse(localStorage.getItem('token'))
console.log("token: ", token)
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

// PARAMETROS REQUERIDOS, DESPUES HAY COMO 75 MAS NO REQUERIDOS 
const bodyParameters = {
    id: "38823924",
    dni: "38823924",
    name: "Maximiliano",
    lastName: "Coppola",
    role: "5ebd7b9f9a69c765fe761991",
    email: "maxicopp@gmail.com"
};

axios.post(
    Global.createUser,
    bodyParameters,
    config
).then(response => console.log(response)).catch(e => console.log(e));
// FIN CREAR USUARIO 
*/
    addUser(event) {
        event.preventDefault()
        console.log("Agregar usuario")

        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = {
            id: this.id.value,
            dni: this.dni.value,
            name: this.name.value,
            lastName: this.lastName.value,
            role: this.role.value,
            legajo: this.legajo.value,
            email: this.email.value,
            phone: this.phone.value,
            sexo: this.sexo.value,
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
            group: this.group.value,
            turno: this.turno.value,
            imagen: this.imagen.value
        }

        axios.post(
            Global.createUser,
            bodyParameters,
            config
        ).then(response => {
            console.log(response)
            localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
        }).catch(e => console.log(e));
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
                    <input type="text" placeholder="dni" name="dni" ref={(c) => this.dni = c} required />
                    <input type="text" placeholder="name" name="name" ref={(c) => this.name = c} required />
                    <input type="text" placeholder="lastName" name="lastName" ref={(c) => this.lastName = c} required />
                    <input type="text" placeholder="role" ref={(c) => this.role = c} required />
                    <input type="text" placeholder="legajo" ref={(c) => this.legajo = c} />
                    <input type="email" placeholder="email" ref={(c) => this.email = c} required />
                    <input type="tel" placeholder="phone" ref={(c) => this.phone = c} />
                    <input type="text" placeholder="sexo" ref={(c) => this.sexo = c} />
                    <input type="text" placeholder="status" ref={(c) => this.status = c} />
                    <input type="text" placeholder="fechaIngresoLinea" ref={(c) => this.fechaIngresoLinea = c} />
                    <input type="text" placeholder="fechaBaja" ref={(c) => this.fechaBaja = c} />
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
                    <input type="text" placeholder="group" ref={(c) => this.group = c} />
                    <input type="text" placeholder="turno" ref={(c) => this.turno = c} />
                    <input type="text" placeholder="imagen" ref={(c) => this.imagen = c} />
                    <input type="submit" value="Crear usuario" />
                </form>
            </div>
        )
    }
}
