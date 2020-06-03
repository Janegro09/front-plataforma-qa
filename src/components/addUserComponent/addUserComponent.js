import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'

export default class addUserComponent extends Component {
    // constructor(props) {
    //     super(props)
    //     this.addUser = this.addUser.bind(this)
    // }

    /*
// CREAR USUARIO
let token = JSON.parse(localStorage.getItem('token'))
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
                    <input type="text" placeholder="name" name="name" ref={(c) => this.name = c} />
                    <input type="text" placeholder="lastName" name="lastName" ref={(c) => this.lastName = c} />
                    <input type="text" placeholder="role" ref={(c) => this.role = c} />
                    <input type="text" placeholder="legajo" ref={(c) => this.legajo = c} />
                    <input type="text" placeholder="email" ref={(c) => this.email = c} />
                    <input type="text" placeholder="phone" ref={(c) => this.phone = c} />
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
                    <input type="submit" value="modificar usuario" />
                </form>
            </div>
        )
    }
}
