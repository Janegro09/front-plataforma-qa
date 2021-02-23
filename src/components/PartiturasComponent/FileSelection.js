import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import moment from 'moment'

export default class FileSelection extends Component {

    state = {
        selecteds: [],
        loading: false,
        files: [],
        arrayToSend: [],
        search_params: { limit: 10, offset: 0, q: "" }
    }
    showMore = () => {
        this.get_files();
    }

    buscar = (e) => {
        const { value } = e.target;
        let { search_params } = this.state;

        search_params.q = value;
        search_params.offset = 0;

        this.setState({ search_params });
        this.get_files(search_params);
    }

    agregar = (e) => {
        const { fileid } = e.target.dataset;
        let { selecteds, files, arrayToSend } = this.state;

        if(fileid) {
            // Buscamos el archivo en el array de files
            const file = files.find(element => element.id === fileid);
            if(!file) return;

            
            // En selecteds guardamos todo el objeto para poder mostrarlos en el margen superior
            selecteds.push(file);

            // En array to send solo agregamos el id del archivo
            arrayToSend.push(fileid);
            this.setState({ selecteds, arrayToSend });
        }
    }

    eliminar = (e) => {
        const { fileid } = e.target.dataset;
        let { selecteds, arrayToSend } = this.state;

        if(fileid) {
            // En selecteds guardamos todo el objeto para poder mostrarlos en el margen superior
            selecteds = selecteds.filter(elem => elem.id !== fileid);

            // En array to send solo agregamos el id del archivo
            arrayToSend = arrayToSend.filter(elem => elem !== fileid);
            this.setState({ selecteds, arrayToSend });
        }

    }

    get_files = (search_params) => {
        this.setState({
            loading: true
        })

        let url_with_params = Global.getAllFiles;

        // Ponemos un codicional, por si el usuario buscó entonces renovamos el array
        let renovar_array = false;
        if(!search_params) {
            search_params = this.state.search_params
        } else {
            renovar_array = true;
        }

        for(let p in search_params) {
            if(!search_params[p]) continue;
            url_with_params += url_with_params.includes('?') ? "&" : "?";
            url_with_params += `${p}=${search_params[p]}`
        }

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(url_with_params, { headers: { Authorization: bearer } }).then(response => {
            const array_to_insert = renovar_array ? response.data.Data : [ ...this.state.files, ...response.data.Data ];
            search_params.offset = array_to_insert.length;

            this.setState({
                loading: false,
                files: array_to_insert,
                search_params,
            })

        }).catch((e) => {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                this.setState({
                    loading: false
                })
                swal("Error!", "Hubo un problema", "error");
            }
            console.log("Error: ", e)
        });
    }

    componentDidMount() {
        this.get_files();
    }

    render() {
        let { selecteds, files, arrayToSend } = this.state;
        return (
            <>
                <h2>Seleccion de archivos</h2>
                <h4>{arrayToSend.length} archivos seleccionados</h4>
                {files &&
                    <>
                        <input className="form-control" type="text" id="searched" onBlur={this.buscar} />
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Programa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mostamos los archivos seleccionados */}
                                {selecteds.map(file => {
                                    return (
                                        <tr key={file.id} className="selected_file">
                                            <td>
                                                <button
                                                    type='button'
                                                    onClick={this.eliminar}
                                                    data-fileid={file.id}>Quitar</button>
                                            </td>
                                            <td>{file.name}</td>
                                            <td>{moment(file.date).format("DD/MM/YYYY")}</td>
                                            <td>{file.program ? file.program.name : 'Sin Programa asignado'}</td>
                                        </tr>
                                    )
                                })
                                }
                                {/* Mostramos los siguientes archivos */}
                                {files.map(file => {
                                    if(arrayToSend.includes(file.id)) return true;
                                    return (
                                        <tr key={file.id}>
                                            <td>
                                                <button
                                                    type='button'
                                                    onClick={this.agregar}
                                                    data-fileid={file.id}>Añadir</button>
                                            </td>
                                            <td>{file.name}</td>
                                            <td>{moment(file.date).format("DD/MM/YYYY")}</td>
                                            <td>{file.program ? file.program.name : 'Sin Programa asignado'}</td>
                                        </tr>
                                    )
                                })
                                }

                            </tbody>
                        </table>
                        <div className="verMas">
                            <button onClick={this.showMore}>Ver mas</button>
                        </div>
                        {arrayToSend.length >= 1 &&
                            <button 
                                type="button"
                                className="buttonSiguiente"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.props.getData(selecteds);
                                }}
                            >
                                Siguiente
                            </button>
                        }
                    </>

                }
            </>
        )
    }
}
