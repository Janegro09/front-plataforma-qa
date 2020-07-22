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
        instances: [],
        paginaActual: 1
    }

    siguientePagina = () => {
        this.setState({
            paginaActual: this.state.paginaActual + 1
        });
    }

    crear = () => {
        swal("Crear")
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    render() {
        let { paginaActual, ids, perfilamiento, instances } = this.state;

        console.log("P: ", perfilamiento);
        console.log("ids: ", ids);

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
                        <InstancePartitureSelection getData={(instances) => { this.setState({ instances }); this.crear() }} />
                    }

                </div>
            </div>
        )
    }
}
