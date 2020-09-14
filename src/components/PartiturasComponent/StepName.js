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
import RecordAudio from '../RecordAudio/RecordAudio'
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import EmailIcon from '@material-ui/icons/Email';
import CheckIcon from '@material-ui/icons/Check';
import TimerIcon from '@material-ui/icons/Timer';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Redirect } from 'react-router-dom';

export default class StepName extends Component {

    state = {
        loading: false,
        data: null,
        customFields: null,
        abrirModalAsignarArchivos: false,
        archivosSeleccionados: null,
        value: '-',
        dataToSend: {},
        step: null,
        instances: null,
        valueCoach: '-',
        role: false,
        volver: false
    }

    asignarArchivos = () => {

        this.setState({
            abrirModalAsignarArchivos: true
        });

    }

    armarObjeto = (e, data = false) => {
        let id;
        if (typeof e === 'string') {
            id = e;
        } else {
            id = e.target.name;
        }
        let { dataToSend } = this.state;

        dataToSend[id] = data === false ? e.target.value : data;

        this.setState({
            dataToSend
        });
    }

    enviar = () => {
        let { id, idStep, idUsuario } = this.props.match.params;
        let { dataToSend, archivosSeleccionados } = this.state;
        let customFilesSync = archivosSeleccionados
        let sendData = {
            customFilesSync
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
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token));
                swal('Excelente', 'Paso modificado correctamente', 'success').then(() => {
                    window.location.reload(window.location.href);
                })
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

    descargarArchivoAudio = (idArchivo) => {
        let { id, idStep, idUsuario } = this.props.match.params;
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(`${Global.getAllPartitures}/${id}/${idUsuario}/${idStep}/${idArchivo}`, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let idResp = response.data.Data

            let win = window.open(Global.download + '/' + idResp, '_blank');
            win.focus();

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

    descargarArchivo = (id) => {
        let win = window.open(Global.download + '/' + id + '?urltemp=false', '_blank');
        win.focus();
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }

    handleChangeCoach = (event) => {
        this.setState({ valueCoach: event.target.value });
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
        if (!this.archivoSeleccionado) {
            return;
        }
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

    volverAtras = () => {
        const { volver } = this.state;
        this.setState({ volver: !volver });
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
                            <td>
                                {(users.partitureStatus === 'pending' ? <TimerIcon className="clockIcon" /> : (users.partitureStatus === 'finished' ? <CheckIcon className="CheckIcon" /> : <PlayArrowRoundedIcon />))}
                            </td>
                            <td>
                                {(users.improvment === "+" ?
                                    <ExpandLessIcon className="arrowUp" /> : (users.improvment === "+-" ?
                                        <ImportExportRoundedIcon /> : <ExpandMoreIcon className="arrowDown" />))}
                            </td>
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
        let role = JSON.parse(sessionStorage.getItem("userData"));
        role = role.role[0];
        role = role.role;
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`

        axios.get(Global.getAllForms, { headers: { Authorization: bearer } }).then(response => {
            token = response.data.loggedUser.token;
            bearer = `Bearer ${token}`;
            const data = response.data.Data;
            axios.get(Global.getAllPartitures + '/' + id + '/' + idUsuario + '/' + idStep, { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                const instances = response.data.Data[0].instances[0];
                const step = instances ? instances.steps[0] : null;

                this.setState({
                    loading: false,
                    data: response.data.Data,
                    customFields: data,
                    archivosSeleccionados: step.customFilesSync,
                    step,
                    instances,
                    role: role || false
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
        let { data, customFields, abrirModalAsignarArchivos, archivosSeleccionados, value, loading, step, volver } = this.state;
        data = data ? data[0] : null;

        if (volver) {
            return <Redirect to={'/partituras/' + this.props.match.params.id + '/' + this.props.match.params.idUsuario} />
        }

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
                        <button
                            className="btn pasoAnterior"
                            
                            onClick={() => { this.volverAtras() }}
                        >
                            Paso anterior
                        </button>
                        <h4>PARTITURAS</h4>
                        <hr />
                        <br />
                        <p>Archivo Actual</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fechas</th>
                                    <th>Nombre</th>
                                    <th className="tableIcons">Estado</th>
                                    <th className="tableIcons">Archivos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{moment(data.dates.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                    <td>{data.name}</td>
                                    <td className="tableIcons">
                                        {(data.partitureStatus === 'pending' ? <TimerIcon className="clockIcon" /> : (data.partitureStatus === 'finished' ? <CheckIcon className="CheckIcon" /> : <PlayArrowRoundedIcon />))}
                                    </td>
                                    <td className="tableIcons">{data.fileId.length}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <p>Usuario Actual</p>
                        {this.getUsersColumns()}

                        {step &&
                            <div className="stepInformation">
                                <button className="buttonStepInformation"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            this.enviar();
                                        }
                                    }
                                >
                                    Enviar
                                </button>
                                <h4>Nombre: {step.name}</h4>
                                <br />
                                <article className="btnArticle" 
                                onClick={(e) => {
                                            e.preventDefault();
                                            this.asignarArchivos();

                                        }}>
                                    <h6 className="titulo-seccion">Subir archivos de apoyo</h6>
                                    {/* Custom file sync */}
                                    <div className="archivosCargados">
                                        {archivosSeleccionados &&
                                            archivosSeleccionados.map(archivo => {
                                                return (
                                                    <span
                                                        key={archivo.id}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.descargarArchivo(archivo.id);
                                                        }}
                                                        className="nombreArchivo"
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

                                    <CloudUploadIcon className="uploadIcon" />
                                       
                                </article>
                                <div className="information">

                                    <section>
                                        <article>
                                            <div className="contenedorPartituras">
                                                <h6 className="titulo-seccion">Lider</h6>
                                                <div className="archivosCargados">
                                                    {step.audioFiles &&
                                                        step.audioFiles.map(stp => {
                                                            if (stp.section === 'monitorings') {
                                                                contadorAudios++;
                                                                return (
                                                                    <span key={stp._id} className={stp.message && 'isMessage'}

                                                                    >
                                                                        <button
                                                                            onClick={
                                                                                (e) => {
                                                                                    e.preventDefault();
                                                                                    this.eliminarArchivo(stp._id);
                                                                                }
                                                                            }
                                                                            style={{ zIndex: 10000 }}
                                                                        >
                                                                            X
                                                                        </button>
                                                                        {stp.message &&
                                                                            <p>{moment(stp.createdAt).format("DD/MM/YYYY")} - {stp.message} <EmailIcon /></p>
                                                                        }
                                                                        {!stp.message &&
                                                                            <p onClick={
                                                                                (e) => {
                                                                                    e.preventDefault();
                                                                                    this.descargarArchivoAudio(stp._id);
                                                                                }
                                                                            }>{moment(stp.createdAt).format("DD/MM/YYYY")} <VolumeUpIcon /></p>
                                                                        }

                                                                    </span>
                                                                )
                                                            }
                                                            return true;
                                                        })
                                                    }
                                                    <div className="audiosReq">
                                                        <p>Audios requeridos: {step.requestedMonitorings}</p>
                                                        <p>Audios faltantes: {(step.audioFiles === false ? step.requestedMonitorings : (step.requestedMonitorings - contadorAudios))} </p>
                                                    </div>
                                                    <div className="titleInBox">
                                                        <h6 className="titulo-seccion">Media (Monitorings)</h6>
                                                    </div>
                                                    <hr></hr>
                                                </div>
                                            </div>
                                            <div className="uploadAudioMon">

                                                {step.requestedMonitorings - contadorAudios > 0 &&
                                                    <select value={this.state.value} onChange={this.handleChange} disabled={this.state.role === 'REPRESENTANTE'}>
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
                                                    <input type="text" className="form-control" placeholder="Mensaje explicando el porque no pudo cargar audios" name="" id="texto" />
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
                                            <textarea disabled={this.state.role === 'REPRESENTANTE'} className="textarea" name="detalleTransaccion" id="ddt" cols="30" rows="10" defaultValue={step.detalleTransaccion} onChange={this.armarObjeto}></textarea>

                                            <label htmlFor="cr">Causa Raíz / Descripción del patrón a mejorar</label>
                                            <textarea disabled={this.state.role === 'REPRESENTANTE'} className="textarea" name="patronMejora" id="cr" cols="30" rows="10" defaultValue={step.patronMejora} onChange={
                                                this.armarObjeto
                                            }
                                            ></textarea>

                                            <label htmlFor="cdr">Compromiso del representante</label>
                                            <textarea disabled={this.state.role === 'REPRESENTANTE'} className="textarea" name="compromisoRepresentante" id="cdr" cols="30" rows="10" defaultValue={step.compromisoRepresentante} onChange={
                                                this.armarObjeto
                                            }></textarea>
                                            <label htmlFor="cdr">Resultados del representante</label>
                                            <textarea disabled={this.state.role === 'REPRESENTANTE'} className="textarea" name="resultadosRepresentante" id="rp" cols="30" rows="10" defaultValue={step.resultadosRepresentante} onChange={
                                                this.armarObjeto
                                            }></textarea>
                                            <div className="margin-top-20"></div>
                                            <label htmlFor="imp">Improvment</label>
                                            <select name="improvment" id="imp" defaultValue={step.improvment} disabled={this.state.role === 'REPRESENTANTE'}
                                                onChange={
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
                                        {this.state.role !== false && this.state.role !== 'REPRESENTANTE' &&
                                            <article>
                                                <h6 className="titulo-seccion">Responsable</h6>
                                                <hr />
                                                {customFields &&
                                                    <CustomFields
                                                        fields={customFields}
                                                        disabled={this.state.role !== 'RESPONSABLE' && this.state.role !== 'ADMINISTRATOR'}
                                                        section='P'
                                                        subsection='RESP'
                                                        values={step.responsibleComments}
                                                        data={(d) => {
                                                            this.armarObjeto('responsibleComments', d)
                                                        }}
                                                    />
                                                }
                                            </article>
                                        }
                                        {this.state.role !== false && this.state.role !== 'REPRESENTANTE' && this.state.role !== 'LIDER' &&

                                            <article>
                                                <h6 className="titulo-seccion">Gerente</h6>
                                                <hr />
                                                {customFields &&
                                                    <CustomFields
                                                        disabled={this.state.role !== 'GERENTE' && this.state.role !== 'ADMINISTRATOR'}
                                                        fields={customFields}
                                                        section='P'
                                                        subsection='GTE'
                                                        values={step.managerComments}
                                                        data={(d) => {
                                                            this.armarObjeto('managerComments', d)
                                                        }}
                                                    />
                                                }
                                            </article>


                                        }


                                        {this.state.role !== false && this.state.role !== 'REPRESENTANTE' && this.state.role !== 'LIDER' && this.state.role !== 'RESPONSABLE' &&
                                            <article>
                                                <h6 className="titulo-seccion">Coordinador On Site</h6>
                                                <hr />
                                                {customFields &&
                                                    <CustomFields
                                                        disabled={this.state.role !== 'GERENTE' && this.state.role !== 'ADMINISTRATOR'}
                                                        fields={customFields}
                                                        section='P'
                                                        subsection='COO'
                                                        values={step.coordinatorOnSiteComments}
                                                        data={(d) => {
                                                            this.armarObjeto('coordinatorOnSiteComments', d)
                                                        }}
                                                    />
                                                }
                                            </article>

                                        }

                                        {this.state.role !== false && this.state.role !== 'REPRESENTANTE' && this.state.role !== 'LIDER' && this.state.role !== 'RESPONSABLE' && this.state.role !== 'GERENTE' &&
                                            <article>
                                                <h6 className="titulo-seccion">Administrador</h6>
                                                <hr />
                                                {customFields &&
                                                    <CustomFields
                                                        disabled={this.state.role === 'GERENTE' || this.state.role === 'RESPONSABLE' || this.state.role === 'LIDER' || this.state.role === 'REPRESENTANTE'}
                                                        fields={customFields}
                                                        section='P'
                                                        subsection='ADM'
                                                        values={step.accountAdministratorComments}
                                                        data={(d) => {
                                                            this.armarObjeto('accountAdministratorComments', d)
                                                        }}
                                                    />
                                                }
                                            </article>

                                        }

                                        {this.state.role !== false && this.state.role !== 'REPRESENTANTE' && this.state.role !== 'LIDER' && this.state.role !== 'RESPONSABLE' && this.state.role !== 'GERENTE' &&
                                            <article>
                                                <h6 className="titulo-seccion">Coach</h6>
                                                <hr />
                                                {customFields &&
                                                    <CustomFields
                                                        fields={customFields}
                                                        section='P'
                                                        subsection='COACH'
                                                        values={step.coachingComments}
                                                        data={(d) => {
                                                            this.armarObjeto('coachingComments', d)
                                                        }}
                                                    />
                                                }
                                            </article>
                                        }

                                    </section>
                                </div>
                                <article className="coachingsAudios seccion">
                                    <h6 className="titulo-seccion">Media (Coachings)</h6>


                                    <select value={this.state.valueCoach} onChange={this.handleChangeCoach}>
                                        <option value="-">Selecciona...</option>
                                        <option value="file">Audio</option>
                                        <option value="record">Grabacion</option>
                                    </select>

                                    <div className="formSubirArchivo">

                                        {this.state.valueCoach === 'file' &&
                                            <>
                                                <h6 className="titulo-seccion">Subir Audio</h6>
                                                <input type="file" onChange={(e) => { this.archivoSeleccionado = e.target.files }} />
                                                <button className="buttonupload" onClick={(e) => { e.preventDefault(); this.subirArchivo() }}>
                                                    Subir el archivo
                                            </button>
                                            </>
                                        }

                                        {this.state.valueCoach === 'record' &&
                                            <>
                                                <h6 className="titulo-seccion">Grabar Audio</h6>
                                                <RecordAudio ids={this.props.match.params} />
                                            </>
                                        }

                                    </div>
                                    <div className="archivosCargados">
                                        {step.audioFiles &&
                                            step.audioFiles.map(stp => {
                                                if (stp.section === 'coachings') {
                                                    contadorAudios++;
                                                    return (
                                                        <span key={stp._id} className={stp.message && 'isMessage'}
                                                        >
                                                            <button
                                                                onClick={
                                                                    (e) => {
                                                                        e.preventDefault();
                                                                        this.eliminarArchivo(stp._id);
                                                                    }
                                                                }

                                                                style={{ zIndex: 10000 }}
                                                            >
                                                                X
                                                                        </button>

                                                            {stp.message &&
                                                                <p onClick={
                                                                    (e) => {
                                                                        e.preventDefault();
                                                                        this.descargarArchivoAudio(stp._id);
                                                                    }
                                                                }>{moment(stp.createdAt).format("DD/MM/YYYY")} - {stp.message} - type: M</p>
                                                            }
                                                            {!stp.message &&
                                                                <p onClick={
                                                                    (e) => {
                                                                        e.preventDefault();
                                                                        this.descargarArchivoAudio(stp._id);
                                                                    }
                                                                }>{moment(stp.createdAt).format("DD/MM/YYYY")} <VolumeUpIcon /></p>
                                                            }
                                                        </span>
                                                    )
                                                }
                                                return true;
                                            })
                                        }
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
