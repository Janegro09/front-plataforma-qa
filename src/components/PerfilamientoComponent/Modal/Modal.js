import React, { Component } from 'react'
import './Modal.css'
import axios from 'axios'
import Global from '../../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'

export default class Modal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            allPrograms: null,
            programsFiltered: null
        }
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    buscar = () => {
        const { allPrograms } = this.state
        let searched = this.searched.value.toLowerCase()
        const result = allPrograms.filter(word => word.name.toLowerCase().includes(searched));

        this.setState({
            programsFiltered: result
        })
    }

    enviarPrograma = (programa) => {
        let id = programa.id;
        const { idFile } = this.props
        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = {
            program: id
        }

        axios.put(Global.reasignProgram + "/" + idFile, bodyParameters, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                swal("Felicidades!", "Has reasignado el programa", "success").then(() => {
                    this.cerrarModal()
                })
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención!", "No has cambiado nada", "info");
                }
                console.log("Error: ", e)
            })
    }

    componentDidMount() {
        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        this.setState({
            loading: true
        })
        axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                allPrograms: response.data.Data,
                programsFiltered: response.data.Data,
                loading: false
            })


        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    this.setState({
                        loading: false
                    })
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {
        const { programsFiltered, loading } = this.state

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


                    <input className="form-control form-control-modal" type="text" placeholder="Buscar" ref={(c) => this.searched = c} onChange={this.buscar} />


                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programsFiltered &&

                                programsFiltered.map((program, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>
                                                {program.name}

                                            </td>
                                            <td>
                                                <button onClick={
                                                    (e) => {
                                                        e.preventDefault()
                                                        this.enviarPrograma(program)
                                                    }
                                                }>Asignar</button>
                                            </td>
                                        </tr>
                                    )
                                })


                            }
                        </tbody>

                    </table>
                </div>
            </div>
        )
    }
}
