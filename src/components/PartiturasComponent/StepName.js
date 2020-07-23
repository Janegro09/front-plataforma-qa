import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import Global from '../../Global';
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';

export default class StepName extends Component {

    state = {
        loading: false,
        data: null
    }

    componentDidMount() {
        let { id, idStep, idUsuario } = this.props.match.params;
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        axios.get(Global.getAllPartitures + '/' + id + '/' + idUsuario + '/' + idStep, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            console.log(response.data.Data)
            this.setState({
                loading: false,
                data: response.data.Data
            })

        })
            .catch((e) => {

                this.setState({
                    loading: false
                })
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {
        let { data } = this.state;

        console.log(data);

        return (
            <>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>
            </>
        )
    }
}
