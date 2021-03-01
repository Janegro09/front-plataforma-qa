import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'

export default class PerfilamientoSelection extends Component {

    state = {
        perfilamientos: [],
        loading: false,
        files: [],
        file_selected: 0
    }


    get_perfilamientos_by_file = (file_id) => {
        if(!file_id) return;
        let tokenUser = JSON.parse(localStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        this.setState({ loading: true });

        axios.get(`${Global.getAllFiles}/${file_id}/perfilamiento`, { headers: { Authorization: bearer } }).then(response => {
            const array_to_insert = response.data.Data || [];
            this.setState({
                loading: false,
                perfilamientos: array_to_insert
            })
        }).catch(e => {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                this.setState({ loading: false })
                swal("Error!", "Hubo un problema", "error");
            }
            console.log("Error: ", e)
        })

    }

    componentDidMount() {
        let { files } = this.props;
        this.setState({ files });
        this.set_selected_file(0, files);
    }

    set_selected_file = (index, filesArray) => {
        let { files, file_selected, perfilamientos } = this.state;

        if(filesArray) {
            files = filesArray;
        }
        // Buscamos el archivo
        if(!files[index]) return;
        
        // Pbtenemos el id del archivo
        const id = files[index].fileId[0];
        
        // Si existe entonces seteamos el index como archivo seleccionado
        file_selected = index;
        
        // Blanqueamos los perfilamientos y limpiamos la tabla
        perfilamientos = [];

        this.setState({ file_selected, perfilamientos });
        
        // Hacemos el request de los perfilamientos de ese archivo
        this.get_perfilamientos_by_file(id);
    }

    quitar_archivo = () => {
        let { files, file_selected } = this.state;

        // buscamos el archivo
        if(files[file_selected]) {
            let fileId = files[file_selected].fileId[0];

            if(!fileId) return;

            files = files.filter(element => element.fileId[0] !== fileId);

            // El file_selected queda igual, porque al eliminarse, en ese indice, estara el proximo... 

            this.setState({ files });

            if((file_selected + 1) > files.length) {
                // Seteamos el archivo seleccionado en el limite si esta seleccionado un archivo inexistenet
                file_selected = (files.length - 1); // Descontamos uno ya que estamos trabajando con logitudes e indices de array
            }

            this.set_selected_file(file_selected, files);
        }


    }

    toggle_add_perfilamiento = (e) => {
        let { files, file_selected, perfilamientos } = this.state;
        const { perfilamiento } = e.target.dataset;

        if(!files[file_selected] || !perfilamiento) return false;

        const fileId = files[file_selected].fileId[0];

        // Buscamos el perfilamiento
        const perf = perfilamientos.find(elem => elem.name === perfilamiento);
        if(!perf) return false;

        // Creamos el objeto para insertar al archivo
        const aux = {
            fileId,
            name: perf.name
        }

        // perfilamientosAsignados
        if(files[file_selected].perfilamientosAsignados && files[file_selected].perfilamientosAsignados instanceof Array) {
            // Consultamos si existe, sino lo eliminamos
            if(files[file_selected].perfilamientosAsignados.find(e => e.name === perf.name)) {
                files[file_selected].perfilamientosAsignados = files[file_selected].perfilamientosAsignados.filter(e => e.name !== perf.name)
            } else {
                files[file_selected].perfilamientosAsignados.push(aux);
            }
        }

        this.setState({ files });
    }
    exist_perfilamiento = (perfilamiento_name) => {
        let { files, file_selected } = this.state;

        if(!files[file_selected] || !perfilamiento_name) return false;

        // perfilamientosAsignados
        if(files[file_selected].perfilamientosAsignados && files[file_selected].perfilamientosAsignados instanceof Array) {
            return !!files[file_selected].perfilamientosAsignados.find(e => e.name === perfilamiento_name); // Retornamos un booleano
        }
    } 

    nextFile = () => {
        let { file_selected } = this.state;
        this.set_selected_file(file_selected + 1)
    }

    render() {
        let { loading, files, file_selected, perfilamientos } = this.state;
        if(!files) return;
        return (
            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <h2>Seleccion de perfilamientos</h2>
                <h4>Seleccionando los perfilamientos del archivo {file_selected + 1} de {files.length} archivos seleccionado</h4>
                {files[file_selected] &&
                    <h6>Archivo actual: {files[file_selected]?.fileName || ""}</h6>
                }

                {perfilamientos?.length === 0 &&
                    <div className="alert_falta_perfilamiento">
                        <div className="alert alert-warning">Este archivo no tiene perfilamientos, debe quitarlo o volver al paso anterior</div>
                        <div>
                            {/* Si es el unico archivo entonces volvemos al paso anterior */}
                            {files.length > 1 &&
                                <button className="btn" type="button" onClick={this.quitar_archivo}>Quitar archivo</button>
                            }
                        </div>
                    </div>
                }

                {perfilamientos.length > 0 &&
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cluster</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {perfilamientos.map((v, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{v.name}</td>
                                            <td>{v.cluster}</td>
                                            <td>
                                                {!this.exist_perfilamiento(v.name) &&
                                                <button 
                                                    type='button'
                                                    disabled={v.partitura} 
                                                    onClick={this.toggle_add_perfilamiento}
                                                    data-perfilamiento={v.name}>
                                                        Agregar
                                                </button>
                                                }
                                                {this.exist_perfilamiento(v.name) &&
                                                    <button 
                                                        type='button'
                                                        disabled={v.partitura} 
                                                        onClick={this.toggle_add_perfilamiento}
                                                        data-perfilamiento={v.name}
                                                        >
                                                            Quitar
                                                    </button>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                }
                {perfilamientos.length > 0 && (file_selected + 1) < files.length &&
                    <button className="btn" type="button" onClick={this.nextFile}>Siguiente Archivo</button>
                }
                <button 
                        type="button"
                        className="buttonAnterior"
                        onClick={(e) => {
                            e.preventDefault();
                            this.props.rollBack();
                        }}>Anterior</button>
                {files.length >= 1 && perfilamientos?.length > 0 && (file_selected + 1) === files.length &&
                    <button className="buttonSiguiente"
                        onClick={(e) => {
                            e.preventDefault();
                            this.props.getData(files);
                        }}
                    >
                        Siguiente
                    </button>
                }
            </>
        )
    }
}
