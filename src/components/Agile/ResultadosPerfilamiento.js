import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Body } from '../UI/Body';
import axios from 'axios'
import swal from 'sweetalert'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import moment from 'moment'
import './tablasEspeciales.css';


export const ResultadosPerfilamiento = ({ responseAgil, archivosSeleccionados }) => {
    const [redirect, setredirect] = useState(null)
    const [errores, seterrores] = useState([]);
    const [filas, setfilas]     = useState([]);
    const [headers, setheaders] = useState([]);
    const [rows, setrows]       = useState([]);
    const [columnas, setcolumnas] = useState([]);

    const search_file_name = (file_id) => {
        let file_name = archivosSeleccionados.find(elem => elem.id == file_id);

        if(file_name) {
            return file_name.name;
        } else return file_id
    }

    const dividir_response = () => {
        if(!responseAgil) {
            swal('Error', "Ocurrio un error interno, por favor, vuelva a intentarlo", 'error').then(() => {
                setredirect('/agile/perfilamiento');
            })
            return;
        }

        const { errores, success } = responseAgil;

        if(errores) {
            seterrores(errores);
        }

        if(success && success instanceof Array) {
            get_columnas(success);
            get_headers(success);
        }
    }

    const ordernar_filas = (successArray, headers) => {
        let FilasAux = [];

        for(let { file_id } of headers) {
            // Buscamos el archivo
            let archivoBuscado = successArray.find(elem => elem.file_id == file_id);
            if(!archivoBuscado) continue;

            // Buscamos la columna
            FilasAux.push(archivoBuscado.response_data);

        }

        setfilas([...FilasAux]);
    }

    const get_headers = (successArray) => {
        let headersAux = [];

        for(let { file_id } of successArray) {
            let aux = {
                file_id,
                file_name: search_file_name(file_id)
            }
            headersAux.push(aux);
        }

        setheaders([...headersAux]);
        ordernar_filas(successArray, headersAux);
    }

    const get_columnas = (successArray) => {
        let headersAux = [];

        for(let { response_data } of successArray) {
            for(let group of response_data) {
                if(!headersAux.includes(group['Nombre del grupo'].value)) {
                    headersAux.push(group['Nombre del grupo'].value);
                }
            }
        }

        setcolumnas([...headersAux]);
    }

    useEffect(() => {
        dividir_response();
        return () => {
            
        }
    }, [])

    const redirectToCuartiles = (e) => {
        const { id } = e.target;

        if(!id) return;

        setredirect({
           pathname: `/perfilamiento/perfilamientos`, 
           cuartilSeleccionado: id,
            nameCuartilSelected: search_file_name(id)
        })
    }

    if(redirect) {
        return <Redirect to={redirect}/>
    }

    return (
        <div className="">
            <div className="mt-3">
                <h4 className="mb-2">Errores ({errores.length})</h4>
                {errores.length > 0 ?
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Archivo</th>
                                <th>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {errores.map(error => {
                                return (
                                    <tr key={error.file_id}>
                                        <td>{search_file_name(error.file_id)}</td>
                                        <td>{error.response_data}</td>
                                    </tr>
                                )
                            })
                            }
                    
                        </tbody>
                    </Table>
                    :
                        <Alert variant="info">
                            El perfilamiento agil realizad0 devolvio 0 errores de {responseAgil.total} archivos cuartilizados.
                        </Alert>
                }
            </div>
            <div className="mt-3">
                <h4 className="mb-2">Respuestas ({filas.length})</h4>
                {filas.length > 0 &&
                    <Table striped bordered hover className="table_agile" >
                        <thead>
                            <tr>
                                <th colspan="2">Columnas</th>
                                {headers.map((v) => {
                                    return <th id={v.file_id} onClick={redirectToCuartiles} key={v.file_id}>{v.file_name}</th>
                                })
                                }
                            </tr>
                        </thead>
                        <tbody className="tbody_agile">
                            {columnas.map((v, i) => {
                                return  (
                                    <tr key={v}>
                                        <td>
                                            <div className="file_name">
                                                <h4>{v}</h4>                                                        
                                            </div>
                                        </td>
                                        <td>
                                            <article>
                                                <div className="file_rows">
                                                    <span>Agentes</span>
                                                    <span>Cluster</span>
                                                    <span>Aplica a todos los usuarios</span>
                                                    <span>% del total</span>
                                                </div>
                                            </article>
                                        </td>
                                        {filas.map((filas, index) => {
                                            // Buscamos si existe la fila para este archivo
                                            const existelafila = filas.find(elem => elem["Nombre del grupo"].value == v);
                                            if(existelafila) {
                                                return (
                                                    <td>
                                                        <article>
                                                            <div className="file_rows">
                                                                <span>{existelafila['Cant de agentes'].value}</span>

                                                                <span>{existelafila['Cluster'].value}</span>

                                                                <span>{existelafila['assignAllUsers'].value}</span>

                                                                <span>{existelafila['% Total'].value}</span>
                                                            </div>
                                                        </article>
                                                    </td>
                                                )
                                            } else {
                                                return (
                                                    <td>
                                                        <article>
                                                            <div className="file_rows">
                                                                <span>-</span>
                                                                <span>-</span>
                                                                <span>-</span>
                                                                <span>-</span>
                                                            </div>
                                                        </article>
                                                    </td>
                                                )
                                            }
                                        })
                                        }
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </Table>
                }
            </div>
        </div>
    )
}
