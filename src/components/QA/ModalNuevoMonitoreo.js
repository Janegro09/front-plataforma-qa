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
        dataToSend: {
            userId: "",
            transactionDate: "",
            caseId: "",
            programId: ""
        }
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

        this.setState({ usuariosConFiltro: encontrado })

    }

    agregarUsuario = (user) => {
        let { dataToSend } = this.state;
        dataToSend.userId = user.id;
        this.setState({ dataToSend });
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
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getUsers + '?specificdata=true', { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                users: response.data.Data,
                usuariosConFiltro: response.data.Data,
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

        const { loading, usuariosConFiltro } = this.state;

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

                    <input
                        type="text"
                        placeholder="Buscar usuario"
                        onChange={this.buscarUsuario}
                        className="form-control"
                    />

                    {usuariosConFiltro &&
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
                </div>
            </div>
        )
    }
}

