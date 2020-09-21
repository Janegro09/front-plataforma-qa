import React, { Component } from 'react'
import axios from 'axios';
import swal from 'sweetalert';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import './Modal.css'

export default class ModalNuevoMonitoreo extends Component {

    state = {
        loading: false,
        users: null,
        usuariosConFiltro: null,
        encontrado: null,
        usuarioSeleccionado: null,
        programs: [],
        file: null,
        dataToSend: {
            userId: "",
            transactionDate: "",
            caseId: "",
            programId: ""
        },
        buscadorUsuario: ""
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }

    buscarUsuario = (e) => {
        let buscado = e.target.value.trim().toLowerCase();
        const { users } = this.state;

        let encontrado = users.filter(user => user.id.trim().includes(buscado) || `${user.name} ${user.lastName}`.trim().includes(buscado)
        )

        this.setState({ usuariosConFiltro: encontrado, buscadorUsuario: buscado });

    }

    uploadFile = (e) => {
        e.preventDefault();

        if(e.target.files.length > 0) {
            this.setState({ 
                file: e.target.files[0]
            })

        }
    }

    agregarUsuario = (user) => {
        let { dataToSend, buscadorUsuario, usuarioSeleccionado } = this.state;

        buscadorUsuario = "";
        usuarioSeleccionado = user;
        dataToSend.userId = user.id;
        this.setState({ dataToSend, buscadorUsuario, usuarioSeleccionado });
    }

    marcarFila = (user) => {
        return {
            cursor: "pointer",
            background: user.id === this.state.dataToSend.userId ? "green" : ""
        }
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
            let usuariosConFiltro = response.data.Data;

            axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

                let p = response.data.Data || false;
                let programs;
                if(p) {
                    programs = p.filter(elem => elem.section === 'M');
                }

                this.setState({
                    programs,
                    users,
                    usuariosConFiltro,
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
    changeMonitoringValues = (e) => {
        e.preventDefault();
        const { value, id } = e.target;
        let { dataToSend } = this.state;
        if(id) {

            dataToSend[id] = value;

        }

        this.setState({ dataToSend });

    }

    crearMonitoreo = (e) => {
        e.preventDefault();
        let { dataToSend, file } = this.state;
        this.setState({ loading: true })
        const formData = new FormData();
        // Verificamos los datos requeridos
        for(let d in dataToSend) {
            if(!dataToSend[d]) {
                swal('Error', "Falta el dato en: " + d, 'error');
                return;
            }
            formData.append(d, dataToSend[d]);
        }

        if(file) {
            formData.append('file', file);
        }

        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.post(Global.monitoreos + '/new', formData, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                this.setState({ loading: true })
                if (response.data.Success) {
                    swal("Felicidades!", "Se ha creado el monitoreo correctamente", "success");
                    window.location.reload(window.location.href);
                }

            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No se ha agregado el monitoreo", "info");
                }
                console.log("Error: ", e)
            })

        console.log(formData)

    }

    render() {

        const { loading, usuariosConFiltro, dataToSend, usuarioSeleccionado, programs, buscadorUsuario } = this.state;

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

                    <section className="userId">
                        <h5>Usuario monitoreado</h5>
                        <input
                            type="text"
                            placeholder="Buscar usuario"
                            onChange={this.buscarUsuario}
                            value={buscadorUsuario}
                            className="form-control"
                        /> 
                        {!buscadorUsuario && usuarioSeleccionado &&
                            <small>
                                Usuario Seleccionado: <strong>{usuarioSeleccionado.name} {usuarioSeleccionado.lastName} - {usuarioSeleccionado.id}</strong> 
                            </small>
                        }

                        {usuariosConFiltro && buscadorUsuario &&
                            <table>
                                <thead>
                                    <tr>
                                        <th>DNI</th>
                                        <th>Nombre y apellido</th>
                                    </tr>
                                </thead>
                                {usuariosConFiltro?.slice(0, 10).map(user => {
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

                    <hr />

                    <section className="transactionData">
                        <h5>Datos de la transacción</h5>

                        {/* Transaction Date */}
                        <article>
                            <label htmlFor="transactionDate">Fecha de transacción</label>
                            <input type="date" id="transactionDate" required onChange={this.changeMonitoringValues} value={dataToSend.transactionDate}/>
                        </article>

                        {/* Case ID */}
                        <article>
                            <label htmlFor="caseId">ID del caso</label>
                            <input type="text" id="caseId" required onChange={this.changeMonitoringValues} value={dataToSend.caseId}/>
                        </article>

                        <article>
                            <label htmlFor="programId">Programa</label>
                            <select value={dataToSend.programId} onChange={this.changeMonitoringValues} id="programId">
                                <option>Selecciona...</option>
                                {programs.map(v => {
                                    return <option key={v.id} value={v.id}>{v.name}</option>
                                })
                                }
                            </select>
                        </article>

                        <article>
                            <label htmlFor="file">Archivo</label>
                            <input type="file" id="file" onChange={this.uploadFile}/>
                        </article>

                    </section>

                    <hr />

                    <section>
                        <button type="button" className="btn" onClick={this.crearMonitoreo}>Enviar</button>
                    </section>
                    

                </div>
            </div>
        )
    }
}

