import React, { Component } from 'react';

import SiderbarLeft from '../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader';
import ModalNuevoTipoCalibracion from './ModalNuevoTipoCalibracion';

import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import Global from '../../Global';
import swal from 'sweetalert';
import axios from 'axios';

export default class TiposDeCalibraciones extends Component {

    state = {
        loading: false,
        response: {},
        abrirModal: false
    }

    abrirModalNuevoTipoCalibracion() {
        this.setState({ abrirModal: true })
    }

    componentDidMount() {
        // Hacer rekest
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"));
        const token = tokenUser;
        const bearer = `Bearer ${token}`;

        axios.get(Global.calibrationTypes, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            this.setState({
                response: response.data.Data,
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
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }


    render() {
        let { loading, abrirModal, response } = this.state;
        console.log(response);
        return (
            <>
                <div className="header">
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                {abrirModal &&
                    <ModalNuevoTipoCalibracion />
                }

                <div className="container">
                    <h4>Calibraciones</h4>
                    <button
                        className="btn btn-primary"
                        onClick={ (e) => {
                            e.preventDefault();
                            this.abrirModalNuevoTipoCalibracion();
                        }}
                    >
                        +
                    </button>
                </div>
            </>
        )
    }
}
