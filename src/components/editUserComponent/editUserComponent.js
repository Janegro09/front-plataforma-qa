import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'

export default class editUserComponent extends Component {
    constructor(props) {
        super(props)
        console.log("Desde el constructor ", this.props.location.state.userSelected)
        this.modifyUser = this.modifyUser.bind(this)
    }

    componentDidMount() {
        console.log("Componente lanzado!!")
        // MODIFICAR USUARIO
        // let token = JSON.parse(localStorage.getItem('token'))
        // let id = this.props.location.state.userSelected.id
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };

        // // PARAMETROS A MODIFICAR, SE MANDAN POR ACA
        // const bodyParameters = {
        //     name: "alfredaaa",
        //     lastName: "sosa"
        // };

        // axios.post(Global.modifyUser + id, bodyParameters, config)
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(e => {
        //         console.log("Error: ", e)
        //     })
        // FIN MODIFICAR USUARIO
    }

    modifyUser(e) {
        e.preventDefault()
        let name = this.name.value
        let lastName = this.lastName.value
        let role = this.role.value
        let legajo = this.legajo.value
        let email = this.email.value
        let phone = this.phone.value
        let sexo = this.sexo.value
        let status = this.status.value
        let fechaIngresoLinea = this.fechaIngresoLinea.value
        let fechaBaja = this.fechaBaja.value
        let motivoBaja = this.motivoBaja.value
        let propiedad = this.propiedad.value
        let canal = this.canal.value
        let negocio = this.negocio.value
        let razonSocial = this.razonSocial.value
        let edificioLaboral = this.edificioLaboral.value
        let gerencia1 = this.gerencia1.value
        let nameG1 = this.nameG1.value
        let gerencia2 = this.gerencia2.value
        let nameG2 = this.nameG2.value
        let jefeCoordinador = this.jefeCoordinador.value
        let responsable = this.responsable.value
        let supervisor = this.supervisor.value
        let lider = this.lider.value
        let provincia = this.provincia.value
        let region = this.region.value
        let subregion = this.subregion.value
        let equipoEspecifico = this.equipoEspecifico.value
        let puntoVenta = this.puntoVenta.value
        let group = this.group.value
        let turno = this.turno.value
        let imagen = this.imagen.value

        console.log(name)
        console.log(lastName)
        console.log(role)
        console.log(legajo)
        console.log(email)
        console.log(phone)
        console.log(sexo)
        console.log(status)
        console.log(fechaIngresoLinea)
        console.log(fechaBaja)
        console.log(motivoBaja)
        console.log(propiedad)
        console.log(canal)
        console.log(negocio)
        console.log(razonSocial)
        console.log(edificioLaboral)
        console.log(gerencia1)
        console.log(nameG1)
        console.log(gerencia2)
        console.log(nameG2)
        console.log(jefeCoordinador)
        console.log(responsable)
        console.log(supervisor)
        console.log(lider)
        console.log(provincia)
        console.log(region)
        console.log(subregion)
        console.log(equipoEspecifico)
        console.log(puntoVenta)
        console.log(group)
        console.log(turno)
        console.log(imagen)

    }

    render() {
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
                <form onSubmit={this.modifyUser}>
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
