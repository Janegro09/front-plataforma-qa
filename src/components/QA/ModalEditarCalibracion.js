import React, { Component } from 'react'
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import './Modal.css'
import moment from 'moment'
import { Redirect } from 'react-router-dom';

export default class ModalNuevoMonitoreo extends Component {
    state = {
        id: false,
        loading: false,
        redirect: false,
        users: null,
        usuariosFiltradosExperto: null,
        usuariosFiltradosCalibradores: null,
        encontrado: null,
        usuarioSeleccionadoExperto: null,
        usuarioSeleccionadoCalibradores: [],
        calibrationTypes: [],
        dataToSend: {
            caseId: "",
            calibrationType: "",
            calibrators: [],
            expert: ""
        },
        calibration: {},
        buscadorUsuario: "",
        buscadorUsuarioCalibradores: ""
    }

    setDefaultData = () => {
        let { calibration, usuarioSeleccionadoExperto, usuarioSeleccionadoCalibradores, dataToSend } = this.state;

        dataToSend = {
            calibrationType: calibration.calibrationType,
            calibrators: calibration.calibrators,
            caseId: calibration.caseId,
            expert: calibration.expert.id,
            status_open: calibration.status_open,
        }

        usuarioSeleccionadoExperto = calibration.expert;
        usuarioSeleccionadoCalibradores = dataToSend.calibrators;

        if (calibration.startDate) {
            dataToSend.startDate = calibration.startDate
        }
        if (calibration.endDate) {
            dataToSend.endDate = calibration.endDate
        }

        this.setState({ dataToSend, usuarioSeleccionadoExperto, usuarioSeleccionadoCalibradores });
    }


    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }

    buscarUsuario = (e) => {
        let buscado = e.target.value.toLowerCase();
        const { users } = this.state;

        let encontrado = users.filter(user => user.id.includes(buscado) || `${user.name} ${user.lastName}`.includes(buscado)
        )

        this.setState({ usuariosFiltradosExperto: encontrado, buscadorUsuario: buscado });

    }
    buscarUsuarioColaborador = (e) => {
        let buscado = e.target.value.toLowerCase();
        const { users } = this.state;

        let encontrado = users.filter(user => user.id.includes(buscado) || `${user.name} ${user.lastName}`.includes(buscado)
        )

        this.setState({ usuariosFiltradosCalibradores: encontrado, buscadorUsuarioCalibradores: buscado });

    }

    agregarUsuario = (user) => {
        let { dataToSend, buscadorUsuario, usuarioSeleccionadoExperto } = this.state;

        buscadorUsuario = "";
        usuarioSeleccionadoExperto = user;
        dataToSend.expert = user.id;
        this.setState({ dataToSend, buscadorUsuario, usuarioSeleccionadoExperto });
    }

    agregarUsuarioColaborador = (user) => {
        let { buscadorUsuarioCalibradores, usuarioSeleccionadoCalibradores } = this.state;

        buscadorUsuarioCalibradores = "";
        if (!usuarioSeleccionadoCalibradores.includes(user.id)) {

            usuarioSeleccionadoCalibradores.push(user)
        }
        this.setState({ buscadorUsuarioCalibradores, usuarioSeleccionadoCalibradores });
    }

    marcarFila = (user) => {
        return {
            cursor: "pointer",
            background: user.id === this.state.dataToSend.expert ? "green" : ""
        }
    }


    componentDidMount() {
        const { id } = this.props;
        this.setState({
            loading: true,
            id
        })


        const tokenUser = JSON.parse(localStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        axios.get(Global.getUsers + '?specificdata=true', { headers: { Authorization: bearer } }).then(response => {
            let users = response.data.Data;
            let usuariosFiltradosExperto = response.data.Data;

            token = response.data.loggedUser.token
            bearer = `Bearer ${token}`

            axios.get(Global.calibrationTypes, { headers: { Authorization: bearer } }).then(response => {
                let calibrationTypes = []
                if (response.data.Data) {
                    calibrationTypes = response.data.Data;
                }

                token = response.data.loggedUser.token
                bearer = `Bearer ${token}`

                axios.get(Global.calibration + '/' + id, { headers: { Authorization: bearer } }).then(response => {
                    localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

                    if (response.data.Data) {

                        this.setState({
                            calibrationTypes,
                            users,
                            usuariosFiltradosExperto,
                            loading: false,
                            calibration: response.data.Data[0]
                        })

                        this.setDefaultData();

                    } else {
                        window.location.reload(window.location.href);
                    }
                }).catch((e) => {
                    // Si hay algún error en el request lo deslogueamos
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        this.setState({
                            loading: false
                        })
                        swal("Error!", `${e.response.data.Message}`, "error");
                    }
                    console.log("Error: ", e)
                });

            }).catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });


        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });
    }
    changeCalibrationsValues = (e) => {
        e.preventDefault();
        const { value, id } = e.target;
        let { dataToSend } = this.state;
        if (id) {
            dataToSend[id] = value;
        }

        this.setState({ dataToSend });

    }

    crearCalibracion = (e) => {
        e.preventDefault();
        let { dataToSend, usuarioSeleccionadoCalibradores, id } = this.state;
        dataToSend.calibrators = [];
        for (let u of usuarioSeleccionadoCalibradores) {
            if (!dataToSend.calibrators.includes(u.id)) {
                dataToSend.calibrators.push(u.id);
            }
        }


        this.setState({ loading: true })

        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.put(Global.calibration + '/' + id, dataToSend, config)
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                this.setState({ loading: false })
                if (response.data.Success) {
                    swal("Felicidades!", "Se ha modificado la sesion de calibracion correctamente", "success").then(() => {
                        window.location.reload(window.location.href);
                    })
                }

            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No se ha modificado la calibracion", "info");
                }
                console.log("Error: ", e)
            })

    }

    verInforme = () => {
        const { id } = this.state;

        if (id) {
            this.setState({ redirect: '/calibraciones/' + id });
        }

    }

    deleteCalibrator = (e) => {
        const { id } = e.target.dataset;
        let { usuarioSeleccionadoCalibradores } = this.state;

        if (id) {
            if (usuarioSeleccionadoCalibradores.length > 1) {
                usuarioSeleccionadoCalibradores = usuarioSeleccionadoCalibradores.filter(elem => elem.id !== id);
            } else {
                usuarioSeleccionadoCalibradores = [];
            }


        }

        this.setState({ usuarioSeleccionadoCalibradores })
    }


    render() {

        const {
            redirect,
            calibration,
            calibrationTypes,
            usuariosFiltradosCalibradores,
            usuarioSeleccionadoCalibradores,
            buscadorUsuarioCalibradores,
            buscadorUsuario,
            usuarioSeleccionadoExperto,
            loading,
            usuariosFiltradosExperto,
            dataToSend
        } = this.state;

        if (redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <div className="modal" id="modal-casero">
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="hijo">
                    <div className="boton-cerrar">
                        <button onClick={
                            (e) => {
                                e.preventDefault()
                                this.cerrarModal()
                            }
                        }>x</button>
                    </div>

                    <section>
                        {calibration.calibration?.error &&
                            <div className="alert alert-warning">{calibration.calibration?.error}</div>
                        }
                        {!calibration.calibration?.error &&
                            <button className="btn" onClick={this.verInforme}>Ver informe</button>
                        }
                    </section>

                    <section className="expert">
                        <h6>Usuario monitoreado</h6>
                        <br />
                        <input
                            type="text"
                            placeholder="Buscar usuario"
                            onChange={this.buscarUsuario}
                            value={buscadorUsuario}
                            className="form-control"
                        />
                        {!buscadorUsuario && usuarioSeleccionadoExperto &&
                            <small>
                                Usuario Seleccionado: <strong>{usuarioSeleccionadoExperto.name} {usuarioSeleccionadoExperto.lastName} - {usuarioSeleccionadoExperto.id}</strong>
                            </small>
                        }

                        {usuariosFiltradosExperto && buscadorUsuario &&
                            <table>
                                <thead>
                                    <tr>
                                        <th>DNI</th>
                                        <th>Nombre y apellido</th>
                                    </tr>
                                </thead>
                                {usuariosFiltradosExperto?.slice(0, 10).map(user => {
                                    return (
                                        <tbody key={user.id}
                                            style={this.marcarFila(user)}
                                            onClick={(e) => { e.preventDefault(); this.agregarUsuario(user); }}
                                        >
                                            <tr>
                                                <td>{user.id}</td>
                                                <td>{user.name} {user.lastName}</td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        }
                    </section>

                    <section className="expert">
                        <h6>Calibradores</h6>
                        <br />
                        <input
                            type="text"
                            placeholder="Buscar usuario"
                            onChange={this.buscarUsuarioColaborador}
                            value={buscadorUsuarioCalibradores}
                            className="form-control"
                        />
                        {!buscadorUsuarioCalibradores && usuarioSeleccionadoCalibradores.length > 0 &&
                            <div className="calibradores">
                                {usuarioSeleccionadoCalibradores.map(v => {
                                    return (
                                        <span key={v.id}>
                                            {v.legajo || v.id} - {v.name} {v.lastName}
                                            <button type="button" onClick={this.deleteCalibrator} data-id={v.id}>X</button>
                                        </span>
                                    )
                                })

                                }
                            </div>
                        }

                        {usuariosFiltradosCalibradores && buscadorUsuarioCalibradores &&
                            <table>
                                <thead>
                                    <tr>
                                        <th>DNI</th>
                                        <th>Nombre y apellido</th>
                                    </tr>
                                </thead>
                                {usuariosFiltradosCalibradores?.slice(0, 10).map(user => {
                                    return (
                                        <tbody key={user.id}
                                            onClick={(e) => { e.preventDefault(); this.agregarUsuarioColaborador(user); }}
                                        >
                                            <tr>
                                                <td>{user.id}</td>
                                                <td>{user.name} {user.lastName}</td>
                                            </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        }
                    </section>

                    <hr />

                    <section className="transactionData">
                        <h6>Datos de la transacción</h6>
                        <br />
                        {/* Case ID */}
                        <article>
                            <label htmlFor="caseId">ID del caso</label>
                            <input className="form-control" type="text" id="caseId" required onChange={this.changeCalibrationsValues} value={dataToSend.caseId} />
                        </article>

                        <article>
                            <label htmlFor="calibrationType">Tipo de calibracion</label>
                            <select value={dataToSend.calibrationType} onChange={this.changeCalibrationsValues} id="calibrationType">
                                <option>Selecciona...</option>
                                {calibrationTypes &&
                                    calibrationTypes.map(v => {
                                        return <option key={v._id} value={v.name}>{v.name}</option>
                                    })
                                }

                            </select>
                        </article>
                        <article>
                            <label htmlFor="status_open">Estado</label>
                            <select value={dataToSend.status_open} onChange={this.changeCalibrationsValues} id="status_open">
                                <option option="true">Abierto</option>
                                <option option="false">Cerrado</option>

                            </select>
                        </article>
                        <article>
                            <label htmlFor="startDate">Fecha de inicio</label>
                            <input type="date" id="startDate" onChange={this.changeCalibrationsValues} value={moment(dataToSend.startDate).format('YYYY-MM-DD')} />
                        </article>
                        <article>
                            <label htmlFor="endDate">Fecha de fin</label>
                            <input type="date" id="endDate" onChange={this.changeCalibrationsValues} value={moment(dataToSend.endDate).format('YYYY-MM-DD')} />
                        </article>
                    </section>

                    <hr />

                    <section>
                        <button type="button" className="btn" onClick={this.crearCalibracion}>Enviar</button>
                    </section>
                </div>
            </div>
        )
    }
}

