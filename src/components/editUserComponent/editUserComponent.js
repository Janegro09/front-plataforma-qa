import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'
import SelectGroup from '../addUserComponent/SelectGroup'
import SelectRoles from '../addUserComponent/SelectRoles'
import ChangePassword from '../changePassword/ChangePassword'

export default class editUserComponent extends Component {
    constructor(props) {
        super(props)
        console.log("Desde el constructor ", this.props.location.state.userSelected)
        this.state = {
            userInfo: null
        }
        this.modifyUser = this.modifyUser.bind(this)
        this.handleChangeStatus = this.handleChangeStatus.bind(this)
        this.handleChangeTurno = this.handleChangeTurno.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        console.log("Componente lanzado!!")
        console.log(this.props.location.state.userSelected)
        let token = JSON.parse(localStorage.getItem('token'))
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
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
            })
            .catch(e => {
                console.log("error", e)
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
            })
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
                console.log(response)
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
            })
            .catch(e => {
                console.log("Error: ", e)
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
            })

    }

    render() {
        const user = this.state.userInfo
        console.log("userInfo: ", user)
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
                {this.state.userInfo !== null &&
                    <ChangePassword user={this.state.userInfo} />
                }

                {user !== null &&
                    <form onSubmit={this.modifyUser}>
                        <input type="text" placeholder="id" name="id" ref={(c) => this.id = c} defaultValue={user.id ? user.id : ''} disabled />
                        <input type="text" placeholder="name" name="name" ref={(c) => this.name = c} defaultValue={user.name ? user.name : ''} />
                        <input type="text" placeholder="lastName" name="lastName" ref={(c) => this.lastName = c} defaultValue={user.lastName ? user.lastName : ''} />
                        {/* <input type="text" placeholder="role" ref={(c) => this.role = c} defaultValue={user.role ? user.role : ''} /> */}
                        <SelectRoles getValue={(c) => this.role = c} defaultValue={user.role.id ? user.role.id : ''} />
                        <input type="text" placeholder="legajo" ref={(c) => this.legajo = c} defaultValue={user.legajo ? user.legajo : ''} />
                        <input type="text" placeholder="email" ref={(c) => this.email = c} defaultValue={user.email ? user.email : ''} />
                        <input type="text" placeholder="phone" ref={(c) => this.phone = c} defaultValue={user.phone ? user.phone : ''} />
                        {/* <input type="text" placeholder="sexo" ref={(c) => this.sexo = c} defaultValue={user.sexo ? user.sexo : ''} /> */}
                        <select onChange={this.handleChange} selected="OTRO">
                            <option value={user.sexo}>{user.sexo || ""}</option>
                            <option value="MASCULINO">Hombre</option>
                            <option value="FEMENINO">Mujer</option>
                            <option value="OTRO">Otro</option>
                        </select>
                        {/* <input type="text" placeholder="status" ref={(c) => this.status = c} defaultValue={user.status ? user.status : ''} /> */}
                        <select onChange={this.handleChangeStatus}>
                            <option value={user.userActive}>{user.userActive ? "Activo" : "Inactivo"}</option>
                            <option value={!user.userActive}>{user.userActive ? "Inactivo" : "Activo"}</option>
                        </select>
                        <input type="date" placeholder="fechaIngresoLinea" ref={(c) => this.fechaIngresoLinea = c} defaultValue={user.fechaIngresoLinea ? user.fechaIngresoLinea : ''} />
                        <input type="date" placeholder="fechaBaja" ref={(c) => this.fechaBaja = c} defaultValue={user.fechaBaja ? user.fechaBaja : ''} />
                        <input type="text" placeholder="motivoBaja" ref={(c) => this.motivoBaja = c} defaultValue={user.motivoBaja ? user.motivoBaja : ''} />
                        <input type="text" placeholder="propiedad" ref={(c) => this.propiedad = c} defaultValue={user.propiedad ? user.propiedad : ''} />
                        <input type="text" placeholder="canal" ref={(c) => this.canal = c} defaultValue={user.canal ? user.canal : ''} />
                        <input type="text" placeholder="negocio" ref={(c) => this.negocio = c} defaultValue={user.negocio ? user.negocio : ''} />
                        <input type="text" placeholder="razonSocial" ref={(c) => this.razonSocial = c} defaultValue={user.razonSocial ? user.razonSocial : ''} />
                        <input type="text" placeholder="edificioLaboral" ref={(c) => this.edificioLaboral = c} defaultValue={user.edificioLaboral ? user.edificioLaboral : ''} />
                        <input type="text" placeholder="gerencia1" ref={(c) => this.gerencia1 = c} defaultValue={user.gerencia1 ? user.gerencia1 : ''} />
                        <input type="text" placeholder="nameG1" ref={(c) => this.nameG1 = c} defaultValue={user.nameG1 ? user.nameG1 : ''} />
                        <input type="text" placeholder="gerencia2" ref={(c) => this.gerencia2 = c} defaultValue={user.gerencia2 ? user.gerencia2 : ''} />
                        <input type="text" placeholder="nameG2" ref={(c) => this.nameG2 = c} defaultValue={user.nameG2 ? user.nameG2 : ''} />
                        <input type="text" placeholder="jefeCoordinador" ref={(c) => this.jefeCoordinador = c} defaultValue={user.jefeCoordinador ? user.jefeCoordinador : ''} />
                        <input type="text" placeholder="responsable" ref={(c) => this.responsable = c} defaultValue={user.responsable ? user.responsable : ''} />
                        <input type="text" placeholder="supervisor" ref={(c) => this.supervisor = c} defaultValue={user.supervisor ? user.supervisor : ''} />
                        <input type="text" placeholder="lider" ref={(c) => this.lider = c} defaultValue={user.lider ? user.lider : ''} />
                        <input type="text" placeholder="provincia" ref={(c) => this.provincia = c} defaultValue={user.provincia ? user.provincia : ''} />
                        <input type="text" placeholder="region" ref={(c) => this.region = c} defaultValue={user.region ? user.region : ''} />
                        <input type="text" placeholder="subregion" ref={(c) => this.subregion = c} defaultValue={user.subregion ? user.subregion : ''} />
                        <input type="text" placeholder="equipoEspecifico" ref={(c) => this.equipoEspecifico = c} defaultValue={user.equipoEspecifico ? user.equipoEspecifico : ''} />
                        <input type="text" placeholder="puntoVenta" ref={(c) => this.puntoVenta = c} defaultValue={user.puntoVenta ? user.puntoVenta : ''} />
                        {/* <input type="text" placeholder="group" ref={(c) => this.group = c} defaultValue={user.group ? user.group : ''} /> */}
                        <SelectGroup getValue={(c) => this.group = c} defaultValue={user.group ? user.group : ''} />
                        <select onChange={this.handleChangeTurno}>
                            <option value={user.turno ? user.turno : 'TM'}>{user.turno ? user.turno === 'TM' ? 'TM' : 'TT' : "TM"}</option>
                            <option value={user.turno ? user.turno === 'TM' ? 'TT' : 'TM' : 'TT'}>{user.turno ? user.turno === 'TT' ? 'TM' : 'TT' : "TT"}</option>
                        </select>
                        {/* <input type="text" placeholder="imagen" ref={(c) => this.imagen = c} defaultValue={user.imagen ? user.imagen : ''} /> */}
                        <input type="submit" value="modificar usuario" />
                    </form>
                }

            </div>
        )
    }
}
