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
        abrirModal: false,
        calibraciones: []
    }

    componentDidMount() {
        this.setState({
            loading: true
        })


        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        axios.get(Global.getUsers + '?specificdata=true', { headers: { Authorization: bearer } }).then(response => {

            token = response.data.loggedUser.token;
            bearer = `Bearer ${token}`
            let users = response.data.Data;
            axios.get(Global.calibration, { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                let calibraciones = response.data.Data;

                this.setState({
                    calibraciones,
                    users,
                    loading: false
                })
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

    nuevaCalibracion = (e) => {
        e.preventDefault();
        this.setState({ abrirModal: true });
    }


    getUser = (userId) => {
        const { users } = this.state;

        let user = users.find(elem => elem.id === userId);

        if (user) {
            userId = (user.legajo || user.id) + ' - ' + user.name + ' ' + user.lastName
        }

        return userId;
    }

    render() {
        const { calibraciones ,loading, redirect, abrirModal } = this.state;

        console.log(calibraciones);
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
                    <div className="flex-input-add input-add-spacebetween">
                        <h4>CALIBRACIONES</h4>
                        <div className="">
                            <button
                                className="btnDefault"
                                onClick={this.nuevaCalibracion}
                            >
                                Agregar calibraciones
                            </button>
                        </div>
                    </div>


                    <div className="resultados">
                        {calibraciones.length > 0 &&
                            <table>
                                <thead>
                                    <tr>
                                        <th>Tipo de Calibracion</th>
                                        <th>ID del caso</th>
                                        <th>Calibradores</th>
                                        <th>Experto</th>
                                        <th>Fecha de creación</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                {calibraciones?.map(mon => {
                                    
                                    return (
                                        <tbody key={mon.id}>
                                            <tr>
                                                <td>{mon.calibrationType}</td>
                                                <td>{mon.caseId}</td>
                                                <td>{mon.calibrators.length}</td>
                                                <td>{this.getUser(mon.expert)}</td>
                                                <td>{moment(mon.createdAt).format('DD/MM/YYYY  HH:mm')}</td>
                                                <td>
                                                    <button data-id={mon.id} type="button" >Ver</button>
                                                    <button type="button" data-id={mon.id}>Editar</button>
                                                    <button data-id={mon.id} type="button" >Eliminar</button>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        }
                        {calibraciones.length === 0 &&
                            <div className="alert alert-warning">No existen calibraciones para mostrar</div>
                        }
                    </div>

                </div>
            </>
        )
    }
}

