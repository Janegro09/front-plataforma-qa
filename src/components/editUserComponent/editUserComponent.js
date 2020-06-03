import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'

export default class editUserComponent extends Component {
    constructor(props) {
        super(props)
        console.log("Desde el constructor ", this.props.location.state.userSelected)
    }

    componentDidMount() {
        console.log("Componente lanzado!!")

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

        //========================================================================
        /*
        // GET USER
        let token = JSON.parse(localStorage.getItem('token'))
        let id = this.props.location.state.userSelected.id
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.get(Global.getUsers+'/'+id, config)
        .then(response => {
            console.log(response)
        })
        .catch(e => {
            console.log("error", e)
        })
        // FIN GET USER
        */
        //========================================================================

        // // DELETE USER
        // let token = JSON.parse(localStorage.getItem('token'))
        // let id = this.props.location.state.userSelected.id
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };

        // axios.delete(Global.getUsers+'/'+id, config)
        // .then(response => {
        //     console.log(response)
        // })
        // .catch(e => {
        //     console.log("error", e)
        // })
        // // FIN DELETE USER
        //========================================================================

        // CHANGE PASSWORD
        // let token = JSON.parse(localStorage.getItem('token'))
        // let id = this.props.location.state.userSelected.id
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };

        // // PARAMETROS REQUERIDOS, SOLO PASSWORD
        // const bodyParameters = {
        //     password: "racingclub"
        // };

        // axios.post(Global.passChange + id, bodyParameters, config)
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(e => {
        //         console.log("Error: ", e)
        //     })
        // FIN CHANGE PASSWORD
        //========================================================================
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
        //========================================================================
        // CHANGE STATUS
        // let token = JSON.parse(localStorage.getItem('token'))
        // let id = this.props.location.state.userSelected.id
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };

        // // PARAMETROS A MODIFICAR, SE MANDAN POR ACA
        // const bodyParameters = {};

        // axios.put(Global.changeStatus + id, bodyParameters, config)
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(e => {
        //         console.log("Error: ", e)
        //     })
        // FIN CHANGE STATUS
        //========================================================================
        // PERMISSIONS
        // let token = JSON.parse(localStorage.getItem('token'))
        // let id = this.props.location.state.userSelected.id
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };

        // axios.get(Global.permissions, config)
        // .then(response => {
        //     console.log(response)
        // })
        // .catch(e => {
        //     console.log("error", e)
        // })
        // FIN PERMISSIONS
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
