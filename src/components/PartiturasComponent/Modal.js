import React, { Component } from 'react'

import FileSelection from './FileSelection'
import PerfilamientoSelection from './PerfilamientoSelection'
import InstancePartitureSelection from './InstancePartitureSelection'

import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import './Modal.css'
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import LinearProgressWithLabel from './ProgressBar/LinearProgressBar';
export default class Modal extends Component {
    state = {
        files: [],
        paginaActual: 1,
        creadas: 0,
        errores: 0,
        total: 0
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

    crear_partitura = async (partiture_object) => {
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`;

        try {
            const response = await axios.post(Global.getAllPartitures + "/new", partiture_object, { headers: { Authorization: bearer } });
            return response.data.Success;
        } catch (e) {
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } 
            return false;
        }
    }

    crear = async (instances) => {
        const { files, paginaActual } = this.state;

        let inst = this.quitarIds(instances);

        const send_array = [];

        for(const { fileId, perfilamientosAsignados } of files) {
            const aux = {
                fileId,
                perfilamientosAsignados,
                expirationDate: "",
                instances: inst
            }

            send_array.push(aux);
        }

        // Seteamos el total 
        this.setState({ total: send_array.length, paginaActual: paginaActual + 1 });

        for(const partitura of send_array) {
            let { errores, creadas } = this.state;
            const aux2 = await this.crear_partitura(partitura);

            if(aux2) {
                creadas += 1;
            } else {
                errores += 1;
            }

            this.setState({ creadas, errores });
        }
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    /**
     * Funcion de callback que agrega los archivos seleccionados en el punto 1 al array
     * @param {Array} ids 
     */
    add_files = (files) => {
        // Creamos los objetos para enviar las partituras posteriormente
        let { paginaActual } = this.state;
        const aux_files = [];
        for(const { id, name } of files) {
            const aux = {
                fileId: [id],
                fileName: name,
                perfilamientosAsignados: []
            }
            aux_files.push(aux);
        }

        this.setState({ files: aux_files, paginaActual: paginaActual + 1 });
    }

    agregar_perfilamientos_asignados = (files) => {
        let { paginaActual } = this.state;
        this.setState({ files, paginaActual: paginaActual + 1 });
    }

    rollBack = () => {
        let { paginaActual } = this.state;
        this.setState({ paginaActual: paginaActual - 1 })
    }

    render() {
        let { paginaActual, files, creadas, total, errores } = this.state;

        const porcentaje = (((creadas + errores) / total) * 100);

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
                        <FileSelection getData={this.add_files} />
                    }

                    {paginaActual === 2 &&
                        <PerfilamientoSelection getData={this.agregar_perfilamientos_asignados} files={files} rollBack={this.rollBack}/>
                    }

                    {paginaActual === 3 &&
                        <InstancePartitureSelection getData={this.crear} />
                    }

                    {paginaActual === 4 &&
                        <div className='progressBar'>
                            <h2>Creando partituras</h2>

                            <h6>Creadas: {creadas}</h6>
                            <h6>Errores: {errores}</h6>
                            <h6>Total: {total}</h6>

                            <LinearProgressWithLabel value={porcentaje} />

                            {porcentaje === 100 &&
                                <button class='btn' type="button" onClick={this.cerrarModal}>Cerrar</button>
                            }
                        </div>
                    }

                </div>
            </div>
        )
    }
}
