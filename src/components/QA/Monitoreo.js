import React, { Component } from 'react';
import axios from 'axios';
import SiderbarLeft from '../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import ModalNuevoMonitoreo from './ModalNuevoMonitoreo';

export default class Monitoreo extends Component {
    state = {
        loading: false,
        monitoreos: null,
        abrirModal: false
    }

    nuevoMonitoreo = (e) => {
        e.preventDefault();
        this.setState({ abrirModal: true });
    }

    componentDidMount() {
        // Hacer rekest
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.monitoreos, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            console.log(response.data.Data);
            this.setState({
                monitoreos: response.data.Data,
                loading: false
            })

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {
        const { abrirModal } = this.state;

        return (
            <>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                {abrirModal &&
                    <ModalNuevoMonitoreo />
                }

                <div className="section-content">
                    <h4>Monitoreo</h4>

                    <button
                        className="btn btn-primary"
                        onClick={this.nuevoMonitoreo}
                    >
                        +
                    </button>

                    <div className="buscador">

                    </div>

                    <div className="resultados">

                    </div>
                </div>
            </>
        )
    }
}
