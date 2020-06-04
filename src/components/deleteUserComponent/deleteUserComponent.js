import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'

export default class deleteUserComponent extends Component {
    constructor(props) {
        super(props)
        console.log("Desde el constructor ", this.props.location.state.userSelected.id)
    }

    componentDidMount() {
        console.log("Componente delete lanzado!!");
        // DELETE USER
        let token = JSON.parse(localStorage.getItem('token'))
        let id = this.props.location.state.userSelected.id
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.delete(Global.getUsers + '/' + id, config)
            .then(response => {
                console.log(response)
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
            })
            .catch(e => {
                console.log("error", e)
            })
        // FIN DELETE USER
    }

    render() {
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
            </div>
        )
    }
}
