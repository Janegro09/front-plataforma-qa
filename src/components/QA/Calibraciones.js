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
import ModalEditarCalibracion from './ModalEditarCalibracion';

export default class Calibraciones extends Component {
    state = {
        loading: false,
        redirect: false,
        abrirModal: false,
        calibraciones: [],
        calibracionesFiltrada: [],
        modalEdicion: false,
        totalAMostrar: 25
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
                    loading: false,
                    calibracionesFiltrada: calibraciones
                })
            }).catch((e) => {
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
                this.setState({
                    loading: false
                })
                console.log("Error: ", e)
            });


        }).catch((e) => {
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
            this.setState({
                loading: false
            })
            console.log("Error: ", e)
        });
    }

    editarCalibracion = (e) => {
        const { id } = e.target.dataset;

        if (id) {

            this.setState({ modalEdicion: id })

        }
    }

    deleteCal = (e) => {
        const { id } = e.target.dataset;

        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar una calibracion, no podrás recuperarla",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let token = JSON.parse(sessionStorage.getItem('token'))
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    axios.delete(Global.calibration + "/" + id, config)
                        .then(response => {
                            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                            if (response.data.Success) {
                                swal("Felicidades!", "Calibracion eliminada correctamente", "success").then(() => {
                                    window.location.reload(window.location.href);
                                });
                            }

                        })
                        .catch(e => {
                            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                HELPER_FUNCTIONS.logout()
                            } else {
                                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                swal("Error al eliminar!", {
                                    icon: "error",
                                });

                            }
                            console.log("Error: ", e)
                        })

                } else {
                    swal("No se elimino nada");
                }
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

    filtrarCalibracion = (e) => {
        let { calibracionesFiltrada, calibraciones } = this.state;
        let buscado = e.target.value.toLowerCase();

        if (buscado) {
            calibracionesFiltrada = calibraciones.filter(calibracion => calibracion.caseId.toLowerCase().includes(buscado))
            this.setState({ calibracionesFiltrada });
        } else {
            this.setState({ calibracionesFiltrada: calibraciones });
        }

    }

    verMasCalibraciones = () => {
        let { totalAMostrar } = this.state;
        totalAMostrar += 5;

        this.setState({ totalAMostrar })
    }

    render() {
        const { modalEdicion, calibracionesFiltrada, calibraciones, loading, redirect, abrirModal, totalAMostrar } = this.state;

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

                {modalEdicion &&
                    <ModalEditarCalibracion id={modalEdicion} />
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

                    <input
                        type="text"
                        placeholder="Buscar por ID del caso"
                        className="form-control"
                        onChange={this.filtrarCalibracion}
                    />
                    <div className="resultados">
                        {calibracionesFiltrada.length > 0 &&
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID del caso</th>
                                        <th>Tipo de Calibracion</th>
                                        <th>Calibradores</th>
                                        <th>Experto</th>
                                        <th>Desde</th>
                                        <th>Hasta</th>
                                        <th>Abierto</th>
                                        <th>Fecha de creación</th>
                                        <th className="tableIconsFormularios">Acciones</th>
                                    </tr>
                                </thead>
                                {calibracionesFiltrada?.slice(0, totalAMostrar).map(mon => {
                                    return (
                                        <tbody key={mon.id}>
                                            <tr>
                                                <td>{mon.caseId}</td>
                                                <td>{mon.calibrationType}</td>
                                                <td>{mon.calibrators.length}</td>
                                                <td>{this.getUser(mon.expert)}</td>
                                                <td>{moment(mon.startDate).format('DD/MM/YYYY')}</td>
                                                <td>{moment(mon.endDate).format('DD/MM/YYYY')}</td>
                                                <td className="tablaVariables tableIcons"><div className={mon.status_open ? "estadoActivo" : "estadoInactivo"}></div></td>
                                                <td>{moment(mon.createdAt).format('DD/MM/YYYY  HH:mm')}</td>
                                                <td className="tableIconstableIconsFormularios">
                                                    <button type="button" data-id={mon.id} onClick={this.editarCalibracion}>
                                                        {/* <EditIcon style={{ fontSize: 15 }} /> */}
                                                        Editar
                                                    </button>
                                                    <button data-id={mon.id} type="button" onClick={this.deleteCal}>
                                                        {/* <DeleteIcon style={{ fontSize: 15 }} /> */}
                                                        Eliminar
                                                    </button>
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        }

                        {calibracionesFiltrada.length >= 25 &&
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.verMasCalibraciones();
                                }}
                            >
                                Ver más calibraciones
                            </button>
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

