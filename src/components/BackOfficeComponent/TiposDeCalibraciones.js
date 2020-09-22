import React, { Component } from 'react';

import SiderbarLeft from '../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader';
import ModalNuevoTipoCalibracion from './ModalNuevoTipoCalibracion';

import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import Global from '../../Global';
import swal from 'sweetalert';
import axios from 'axios';
import moment from 'moment';

export default class TiposDeCalibraciones extends Component {

    state = {
        loading: false,
        response: {},
        abrirModal: false
    }

    abrirModalNuevoTipoCalibracion() {
        this.setState({ abrirModal: true })
    }

    eliminar = (id) => {
        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar un tipo de calibración, no podrás recuperarla",
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
                    axios.delete(Global.calibrationTypes + "/" + id, config)
                        .then(response => {
                            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                            if (response.data.Success) {
                                swal("Felicidades!", `${response.data?.Message}`, "success").then(() => {
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

    componentDidMount() {
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
                        onClick={(e) => {
                            e.preventDefault();
                            this.abrirModalNuevoTipoCalibracion();
                        }}
                    >
                        +
                    </button>

                    <section>
                        {response && response.length > 0 ?
                            <>
                                <h4>Tipos de calibraciones</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Fecha de creación</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {response.map(item => (
                                            <tr key={item._id}>
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td>{moment(item.createdAt).format("DD/MM/YYYY")}</td>
                                                <td>
                                                    <button
                                                        onClick={
                                                            (e) => {
                                                                e.preventDefault();
                                                                this.eliminar(item._id);
                                                            }
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>

                            </>
                            :
                            <div>
                                <h4>Sin datos para mostrar</h4>
                            </div>
                        }
                    </section>
                </div>
            </>
        )
    }
}
