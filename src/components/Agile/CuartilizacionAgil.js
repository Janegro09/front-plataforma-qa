import React, { useState, useEffect } from 'react';
import { Body } from '../UI/Body';
import axios from 'axios'
import swal from 'sweetalert'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import moment from 'moment'

export const CuartilizacionAgil = () => {
    const [loading, setloading] = useState(false);

    // Archivos
    const [files, setfiles] = useState([]);
    const [models, setModels] = useState([]);
    const [fileSearch, setfileSearch] = useState("");

    const [archivosSeleccionados, setSelectedFiles] = useState([]);

    const getFile = (e) => {
        const { value } = e.target;
        setloading(true);
        setfiles([]);
        const token = JSON.parse(localStorage.getItem("token"))
        const bearer = `Bearer ${token}`

        let url_with_params = Global.getAllFiles;

        url_with_params = url_with_params.concat("?limit=10&offset=0?q=", value);
        axios.get(url_with_params, { headers: { Authorization: bearer } })
        .then(response => {
            let respuesta = response.data.Data;
            setloading(false);
            if(respuesta && respuesta instanceof Array) {
                setfiles([ ...respuesta ])
            }
        })
        .catch((e) => {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            }
            console.log("Error: ", e)
        });
    }
    // Archivos
    // Modelos de cuartiles

    const enviar = () => {
        let Seleccionados = [];
        

        archivosSeleccionados.map(v => {
            if(v.id && v.model_id) {
                Seleccionados.push({
                    file_id: v.id,
                    model_id: v.model_id
                });
            } else {
                swal('Error', `El archivo ${v.name} no tiene un modelo asignado`, 'error');
                return
            }
        })

        setloading(true);
        const token = JSON.parse(localStorage.getItem("token"))
        const bearer = `Bearer ${token}`
        axios.post(Global.agile + '/cuartilizacion', Seleccionados ,{ headers: { Authorization: bearer } })
        .then(response => {
            let respuesta = response.data;
            setloading(false);

            console.log(respuesta)
        })
        .catch((e) => {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            }
            console.log("Error: ", e)
        });
    }

    useEffect(() => {
        setloading(true)
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.newModel, { headers: { Authorization: bearer } }).then(response => {
            let data = response.data.Data

            setloading(false);
            setModels([...data]);
        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    setloading(false);
                }
            });
        
        return () => {
            setfiles([]);
            setModels([]);
            setSelectedFiles([])
        }
    }, [])

    const selectFile = (file) => {

        const { id, name, program } = file

        if(!program) {
            swal('Error', 'Solo puedes agregar archivos que tengan un programa asignado', 'error');
            return;
        }

        let Seleccionados = archivosSeleccionados

        if(!archivosSeleccionados.includes(id)) {
            Seleccionados.push(file) 
        }

        setSelectedFiles([...Seleccionados])
    }

    const selectModel = (e, fileId) => {
        if(!fileId || !e) return;
        const { value } = e.target;

        if(!value) return;

        let Seleccionados = archivosSeleccionados

        // buscamos el idice
        let indiceBuscado = Seleccionados.findIndex(e => e.id == fileId);
        if(indiceBuscado > -1) {
            Seleccionados[indiceBuscado].model_id = value;
            setSelectedFiles([...Seleccionados])
        }

    }
    
    const deleteFile = (file) => {
        const { id, name, program } = file

        let Seleccionados = archivosSeleccionados.filter(e => e.id != file.id);

        setSelectedFiles([...Seleccionados])
    }

    return (
        <Body loading={loading}>
            <div>
                <h4>Cuartilizacion Automatica</h4>
                <div>
                    <br />
                    <input
                        type="text"
                        placeholder="Buscar archivo de perfilamiento"
                        onBlur={getFile}
                        defaultValue={fileSearch}
                        className="form-control margin-bottom-10"
                    />

                    {files.length > 0 &&
                        <table className="tablaBuscarUsuarios">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Programa</th>
                                </tr>
                            </thead>
                            <tbody>
                            {files.map(p => {
                                return (
                                    <tr key={p.id} onClick={() => selectFile(p)}>
                                        <td>{p.name}</td>
                                        <td><span className={!p.program ? 'labelTeco red': "labelTeco green"}>{!p.program ? 'SIN PROGRAMA' : p.program.name }</span></td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    }
                </div>
                <div className="archivosSeleccionadosAgil">
                    {archivosSeleccionados.map(file => {
                        return (
                            <article key={file.id} >
                                <select value={file.model_id} onChange={(e) => selectModel(e,file.id)}>
                                    <option value="">Selecciona un modelo...</option>
                                    {models.map((v) => {
                                        return (
                                            <option key={v._id} value={v._id}>{v.name}</option>
                                        )
                                    })
                                    }
                                </select>
                                <p>{file.name}</p>
                                <span onClick={() => deleteFile(file)}>&times;</span>
                            </article>
                        )
                    })
                    }
                </div>
                <button onClick={enviar} className="buttonSiguiente">Guardar</button>
            </div>
        </Body>
    )
}
