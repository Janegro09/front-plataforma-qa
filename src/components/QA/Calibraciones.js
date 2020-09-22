import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'

import axios from 'axios';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import ModalNuevaSesiondeCalibracion from './ModalNuevaSesiondeCalibracion';

export default class Calibraciones extends Component {
    state = {
        loading: false,
        redirect: false,
        abrirModal: true
    }

    componentDidMount() {
        
    }

    render() {
        const { loading, redirect, abrirModal } = this.state;

        if (redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>


                {abrirModal &&
                    <ModalNuevaSesiondeCalibracion />
                }

                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                <div className="section-content">
                    <h4>Calibraciones</h4>
                </div>
            </>
        )
    }
}

