import React, { Component } from 'react'

import FileSelection from './FileSelection'
import PerfilamientoSelection from './PerfilamientoSelection'
import InstancePartitureSelection from './InstancePartitureSelection'


import './Modal.css'
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

export default class Modal extends Component {

    state = {
        ids: [],
        perfilamiento: [],
        paginaActual: 1
    }

    siguientePagina = () => {
        this.setState({
            paginaActual: this.state.paginaActual + 1
        });
    }

    quitarIds = (instances) => {
        let dataReturn = [];

        for (let i of instances) {
            let tempData = {
                name: i.name,
                expirationDate: i.expirationDate,
                steps: []
            }

            for (let j of i.steps) {
                let tp = {
                    name: j.name,
                    requiredMonitorings: j.requiredMonitorings
                }

                tempData.steps.push(tp)
            }

            dataReturn.push(tempData)
        }

        return dataReturn;
    }

    obtenerIds = () => {
        const { perfilamiento } = this.state;
        let dataReturn = [];

        for (let p of perfilamiento) {
            if (!dataReturn.includes(p.fileId)) {
                dataReturn.push(p.fileId)
            }
        }

        return dataReturn;
    }

    crear = (instances) => {
        const { perfilamiento } = this.state;

        let inst = this.quitarIds(instances);

        let fileId = this.obtenerIds();
        let sendObject = {
            fileId,
            expirationDate: "",
            perfilamientosAsignados: perfilamiento,
            instances: inst
        }
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.post(Global.getAllPartitures + "/new", sendObject, { headers: { Authorization: bearer } })
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                if (response.data.Success) {
                    swal("Felicidades!", "Se ha creado la partitura", "success").then(() => {
                        window.location.reload(window.location.href);
                    });
                }

            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No se ha agregado el grupo", "info");
                    this.setState({
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    render() {
        let { paginaActual, ids } = this.state;

        return (
            <div className="modal" id="modal-casero">
                <div className="hijo2">
                    <div className="boton-cerrar">
                        <button onClick={
                            (e) => {
                                e.preventDefault()
                                this.cerrarModal()
                            }
                        }>x</button>
                    </div>

                    {paginaActual === 1 &&
                        <FileSelection getData={(ids) => { this.setState({ ids }); this.siguientePagina(); }} />
                    }

                    {paginaActual === 2 &&
                        <PerfilamientoSelection getData={(perfilamiento) => { this.setState({ perfilamiento }); this.siguientePagina(); }} files={ids} />
                    }

                    {paginaActual === 3 &&
                        <InstancePartitureSelection getData={(instances) => { this.crear(instances); }} />
                    }
                </div>
            </div>
        )
    }
}
