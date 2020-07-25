import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import Global from '../../Global';
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import moment from 'moment';
import './steps.css'
import CustomFields from '../AdministradorFormularios/customfields/CustomFields';
import AsignarArchivos from './AsignarArchivos'

export default class StepName extends Component {

    state = {
        loading: false,
        data: null,
        customFields: null,
        abrirModalAsignarArchivos: false,
        archivosSeleccionados: null,
        value: '-',
        dataToSend: {}
    }

    asignarArchivos = () => {

        this.setState({
            abrirModalAsignarArchivos: true
        });

    }

    armarObjeto = (e) => {
        let id = e.target.name;
        let { dataToSend } = this.state;

        dataToSend[id] = e.target.value;

        if (e.target.type === 'checkbox') {
            dataToSend[id] = e.target.checked;
        }

        this.setState({
            dataToSend
        });
    }

    enviar = () => {
        let { id, idStep, idUsuario } = this.props.match.params;
        let { dataToSend, archivosSeleccionados } = this.state;
        let sendData = {
            archivosSeleccionados
        }

        for (let item in dataToSend) {
            if (item.indexOf('#') === 0) {
                let temp = item.substr(1, item.length)
                temp = temp.split('/');

                let name = temp[0];
                let data = temp[1];

                data += `@${dataToSend[item]}`;

                /**
                 * Si ya existe un dato o es uno nuevo
                 * 
                 */
                sendData[name] ? sendData[name] += `%${data}` : sendData[name] = data;
            } else {
                sendData[item] = dataToSend[item];
            }

        }

        

        // /analytics/partitures/:id/:userId/:stepId

        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };


        axios.put(Global.getAllPartitures + "/" + id + '/' + idUsuario + '/' + idStep, sendData, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                console.log("A ver: ", response.data);
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar los roles", "error");
                }
                console.log("Error: ", e)
            })


    }

    eliminarArchivo = (fileId) => {
        this.setState({
            loading: true
        });

        let id = this.props.match.params.id

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.delete(Global.getAllPartitures + '/' + id + '/' + fileId, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            });
            window.location.reload(window.location.href);
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
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    descargarArchivo = (archivo) => {
        let win = window.open(Global.download + '/' + archivo.id + '?urltemp=false', '_blank');
        win.focus();
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }

    agregarArchivo = (tipoArchivo) => {
        let data;
        const formData = new FormData();

        if (tipoArchivo === 'file') {
            data = this.file[0];
        } else if (tipoArchivo === 'message') {
            data = document.getElementById('texto').value;
        }

        formData.append(
            tipoArchivo,
            data
        );


        let { id, idStep, idUsuario } = this.props.match.params;

        // /analytics/partitures/:id/:userId/:stepId/files?section=monitorings
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        this.setState({
            loading: true
        });

        axios.post(Global.getAllPartitures + '/' + id + '/' + idUsuario + '/' + idStep + '/files?section=monitorings', formData, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            });
            window.location.reload(window.location.href);
        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar el arhcivo", "error");
                    this.setState({
                        loading: false
                    })
                }
                console.log("Error: ", e)
            });
    }

    subirArchivo = () => {
        let data = this.archivoSeleccionado[0];
        let { id, idStep, idUsuario } = this.props.match.params;

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        const formData = new FormData();

        formData.append(
            'file',
            data
        );

        this.setState({
            loading: true
        });

        axios.post(Global.getAllPartitures + '/' + id + '/' + idUsuario + '/' + idStep + '/files?section=coachings', formData, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            });
            window.location.reload(window.location.href);
        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar el arhcivo", "error");
                    this.setState({
                        loading: false
                    })
                }
                console.log("Error: ", e)
            });
    }

    getUsersColumns() {
        let { data } = this.state;

        data = data ? data[0] : null;
        let users = data ? data.users[0] : null

        let ReturnData = {
            headers: [],
            actual: [],
            comparativo: []
        }

        for (let th in users.rowFromPartiture) {
            if (th === 'id') continue;
            const value = users.rowFromPartiture[th]
            ReturnData.headers.push(th)
            ReturnData.actual.push(value);
        }
        /**
         * Cuando se haga reporteria, va a venir una columna mas con la misma sintaxisss que la de arriba para comparar
         */
        // for (let th in users.rowFromPartiture) {
        //     if(th === 'id') continue;
        //     const value = users.rowFromPartiture[th]
        //     ReturnData.comparativo.push(value);
        // }

        return (
            <table className="longXTable">
                <thead>
                    {ReturnData.headers.length > 0 &&
                        <tr>
                            <th>Estado</th>
                            <th>Improvment</th>
                            {ReturnData.headers.map((value, key) => {
                                return <th key={key}>{value}</th>
                            })

                            }
                        </tr>
                    }
                </thead>
                <tbody>
                    {ReturnData.actual.length > 0 &&
                        <tr>
                            <td>{users.partitureStatus}</td>
                            <td>{users.improvment}</td>
                            {ReturnData.actual.map((value, key) => {
                                return <th key={key}>{value}</th>
                            })
                            }
                        </tr>
                    }
                    {ReturnData.comparativo.length > 0 &&
                        <tr>
                            <td>January</td>
                            <td>$100</td>
                            {ReturnData.comparativo.map((value, key) => {
                                return <th key={key}>{value}</th>
                            })
                            }
                        </tr>
                    }
                </tbody>
            </table>
        )
    }

    async componentDidMount() {
        let { id, idStep, idUsuario } = this.props.match.params;
        this.setState({
            loading: true
        })
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`

        axios.get(Global.getAllForms, { headers: { Authorization: bearer } }).then(response => {
            token = response.data.loggedUser.token;
            bearer = `Bearer ${token}`;
            const data = response.data.Data;
            axios.get(Global.getAllPartitures + '/' + id + '/' + idUsuario + '/' + idStep, { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                this.setState({
                    loading: false,
                    data: response.data.Data,
                    customFields: data
                })

            })

        })
            .catch((e) => {

                this.setState({
                    loading: false
                })
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {
        let { data, customFields, abrirModalAsignarArchivos, archivosSeleccionados, value, loading } = this.state;

        data = data ? data[0] : null;



        const instances = data ? data.instances[0] : null;

        const step = instances ? instances.steps[0] : null;

        let contadorAudios = 0;

        return (
            <>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                {abrirModalAsignarArchivos &&
                    <AsignarArchivos getData={(archivosSeleccionados) => { this.setState({ archivosSeleccionados, abrirModalAsignarArchivos: false }); }} archivosSeleccionados={archivosSeleccionados} />
                }

                {data &&
                    <div className="section-content">
                        <h1>Archivo actual</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fechas</th>
                                    <th>Nombre</th>
                                    <th>Estado de partitura</th>
                                    <th>Archivos incluídos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{moment(data.dates.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                    <td>{data.name}</td>
                                    <td>{data.partitureStatus}</td>
                                    <td>{data.fileId.length}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2>Usuarios Actuales</h2>
                        {this.getUsersColumns()}

                        {step &&
                            <div className="stepInformation">
                                <button
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            this.enviar();
                                        }
                                    }
                                >
                                    Modificar
                                </button>
                                <h4>{step.name}</h4>
                                <article>
                                    {/* Custom file sync */}
                                    <div className="archivosCargados">
                                        {archivosSeleccionados &&
                                            archivosSeleccionados.map(archivo => {
                                                return (
                                                    <span
                                                        key={archivo.id}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.descargarArchivo(archivo);
                                                        }}
                                                    >
                                                        <p>{archivo.name}</p>
                                                    </span>
                                                )
                                            })
                                        }

                                        {!archivosSeleccionados &&
                                            <span> <p>No hay archivos seleccionados</p> </span>
                                        }

                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.asignarArchivos();

                                        }}
                                    >
                                        Asignar archivos
                                    </button>
                                </article>
                                <div className="information">

                                    <section>
                                        <article>
                                            <h6>Lider</h6>
                                            <div className="archivosCargados">
                                                {step.audioFiles &&
                                                    step.audioFiles.map(stp => {
                                                        if (stp.section === 'monitorings') {
                                                            contadorAudios++;
                                                            return (
                                                                <span key={stp._id} className={stp.message && 'isMessage'}>
                                                                    <button
                                                                        onClick={
                                                                            (e) => {
                                                                                e.preventDefault();
                                                                                this.eliminarArchivo(stp._id);
                                                                            }
                                                                        }
                                                                    >
                                                                        X
                                                                        </button>
                                                                    {stp.message &&
                                                                        <p>{moment(stp.createdAt).format("DD/MM/YYYY")} - {stp.message} - type: M</p>
                                                                    }
                                                                    {!stp.message &&
                                                                        <p>{moment(stp.createdAt).format("DD/MM/YYYY")} - type: F</p>
                                                                    }
                                                                </span>
                                                            )
                                                        }
                                                    })
                                                }
                                                <p>Audios requeridos: {step.requestedMonitorings}</p>
                                                <p>Audios faltantes: {(step.audioFiles === false ? step.requestedMonitorings : (step.requestedMonitorings - contadorAudios))} </p>
                                            </div>
                                            <div>

                                                {step.requestedMonitorings - contadorAudios > 0 &&
                                                    <select value={this.state.value} onChange={this.handleChange}>
                                                        <option value="-">Selecciona...</option>
                                                        <option value="file">Audio</option>
                                                        <option value="message">Mensaje</option>
                                                    </select>
                                                }

                                                {value === 'file' &&
                                                    <input type="file" name="" id="audio" onChange={
                                                        (e) => {
                                                            this.file = e.target.files;
                                                        }
                                                    } />
                                                }

                                                {value === 'message' &&
                                                    <input type="text" name="" id="texto" />
                                                }

                                                {value !== '-' &&
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.agregarArchivo(value);
                                                        }}
                                                    >
                                                        Agregar
                                                    </button>
                                                }


                                            </div>

                                            <label htmlFor="ddt">Detalle de transacción / Oportunidades indentificadas</label>
                                            <textarea name="detalleTransaccion" id="ddt" cols="30" rows="10" onChange={
                                                this.armarObjeto
                                            }></textarea>

                                            <label htmlFor="cr">Causa Raíz / Descripción del patrón a mejorar</label>
                                            <textarea name="patronMejora" id="cr" cols="30" rows="10" onChange={
                                                this.armarObjeto
                                            }
                                            ></textarea>

                                            <label htmlFor="cdr">Compromiso del representante</label>
                                            <textarea name="compromisoRepresentante" id="cdr" cols="30" rows="10" onChange={
                                                this.armarObjeto
                                            }></textarea>

                                            <label htmlFor="imp">Improvment</label>
                                            <select name="improvment" id="imp" onChange={
                                                this.armarObjeto
                                            }>
                                                <option value="">Selecciona</option>
                                                <option value="+">Mejoro</option>
                                                <option value="+-">Sigue igual</option>
                                                <option value="-">Empeoró</option>
                                            </select>
                                        </article>
                                    </section>
                                    <section>
                                        <article>
                                            <h6>Responsable</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'RESP') {
                                                        return <CustomFields key={field.id} field={field} name={'#responsibleComments/' + field.id} functionOnChange={(e) => this.armarObjeto(e)} />
                                                    }
                                                    return true;
                                                })
                                            }

                                        </article>

                                        <article>
                                            <h6>Gerente</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'GTE') {
                                                        return <CustomFields key={field.id} field={field} name={'#managerComments/' + field.id} functionOnChange={(e) => this.armarObjeto(e)} />
                                                    }
                                                    return true;
                                                })
                                            }

                                        </article>

                                        <article>
                                            <h6>Coordinador On Site</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'COO') {
                                                        return <CustomFields key={field.id} field={field} name={'#coordinatorOnSiteComments/' + field.id} functionOnChange={(e) => this.armarObjeto(e)} />
                                                    }
                                                    return true;
                                                })
                                            }
                                        </article>

                                        <article>
                                            <h6>Administrador</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'ADM') {
                                                        return <CustomFields key={field.id} field={field} name={'#accountAdministratorComments/' + field.id} functionOnChange={(e) => this.armarObjeto(e)} />
                                                    }
                                                    return true;
                                                })
                                            }

                                        </article>

                                        <article>
                                            <h6>Coach</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'COACH') {
                                                        return <CustomFields key={field.id} field={field} name={'#coachingComments/' + field.id} functionOnChange={(e) => this.armarObjeto(e)} />
                                                    }
                                                    return true;
                                                })
                                            }

                                        </article>

                                    </section>
                                </div>
                                <article>
                                    <label htmlFor="uploadAudio">Subir Audio</label>
                                    <input type="file" name="" id="" onChange={
                                        (e) => {
                                            this.archivoSeleccionado = e.target.files
                                        }
                                    } />

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.subirArchivo()
                                        }}
                                    >
                                        Subir el archivo
                                    </button>

                                    <label htmlFor="grabaraudio">Grabar Audio</label>
                                    <div>Componente de grabacion de voz</div>

                                    <div className="archivosCargados">
                                        <span>
                                            <button>X</button>
                                            <p>Archivo 1</p>
                                        </span>
                                        <span>
                                            <button>X</button>
                                            <p>Archivo 1</p>
                                        </span>
                                        <span>
                                            <button>X</button>
                                            <p>Archivo 1</p>
                                        </span>
                                    </div>
                                </article>
                            </div>
                        }

                    </div>
                }

            </>
        )
    }
}