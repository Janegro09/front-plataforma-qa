import React, { Component } from 'react'
import axios from 'axios';
import SiderbarLeft from '../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import './Mon.css';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import '../BackOfficeComponent/AdministracionFormulariosComponent/formularios.css';


export default class componentName extends Component {

    state = {
        loading: false,
        id: null,
        redirect: null,
        monitoringDate: false,
        transactionDate: false,
        monitoreo: false,
        disputarArea: false,
        invalidarArea: false,
        buscadorUsuario: false,
        responses: [],
        usuarioSeleccionado: false,
        usuariosConFiltro: [],
        users: [],
        dataToSend: {
            userId: "",
            improvment: "",
            status: ""
        }
    }

    setDefaultData = () => {
        let { invalidarArea, disputarArea, dataToSend, monitoreo, usuarioSeleccionado } = this.state;

        const { responses, userId, improvment, disputado, invalidated, evaluated, status, transactionDate, monitoringDate, comments, devolucion } = monitoreo;

        usuarioSeleccionado = {
            ...monitoreo.userInfo
        }

        let rsp = [];

        for(let r of responses) {
            for(let qst of r.customFields) {
                let td = {
                    section: r.id,
                    question: qst.questionId,
                    response: qst.response
                }

                rsp.push(td);
            }
        }
        
        monitoreo.modifiedBy = monitoreo.modifiedBy.sort((a,b) => Date.parse(b.modifiedAt) - Date.parse(a.modifiedAt));

        dataToSend = {
            userId,
            improvment,
            disputado,
            invalidated,
            evaluated,
            status,
            transactionDate: moment(transactionDate).format('YYYY-MM-DD'),
            monitoringDate: moment(monitoringDate).format('YYYY-MM-DD'),
            comments,
            comentariosDevolucion: devolucion?.comentariosDevolucion,
            fortalezasUsuario: devolucion?.fortalezasUsuario, 
            pasosMejora: devolucion?.pasosMejora
        }

        disputarArea    = !!dataToSend.disputado;
        invalidarArea   = !!dataToSend.invalidated

        this.setState({ dataToSend, usuarioSeleccionado, responses: rsp, disputarArea, invalidarArea, monitoreo });
    }

    marcarFila = (user) => {
        return {
            cursor: "pointer",
            background: user.id === this.state.dataToSend.userId ? "green" : ""
        }
    }

    agregarUsuario = (user) => {
        let { dataToSend, buscadorUsuario, usuarioSeleccionado } = this.state;

        buscadorUsuario = "";
        usuarioSeleccionado = user;
        dataToSend.userId = user.id;
        this.setState({ dataToSend, buscadorUsuario, usuarioSeleccionado });
    }


    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ id, loading: true });

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        axios.get(Global.monitoreos + '/' + id, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            
            let monitoreo = response.data.Data[0] || false;

            this.setState({
                loading: false,
                monitoreo
            })

            this.setDefaultData();


        }).catch((e) => {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                this.setState({
                    loading: false
                })
                swal("Error!", `${e.response.data.Message}`, "error").then(() => {
                    this.setState({ redirect: '/monitoreo' })
                })
            }
            console.log("Error: ", e)
        });
    }

    buscarUsuarios = () => {
        let { users } = this.state;

        if(users.length === 0) {
            this.setState({
                loading: true
            })
    
            const tokenUser = JSON.parse(sessionStorage.getItem("token"))
            let token = tokenUser
            let bearer = `Bearer ${token}`
            axios.get(Global.getUsers + '?specificdata=true', { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                let users = response.data.Data;
                let usuariosConFiltro = response.data.Data;
    
                this.setState({
                    users,
                    usuariosConFiltro,
                    loading: false
                })
    
    
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
                        swal("Error!", `${e.response.data.Message}`, "error");
                    }
                    console.log("Error: ", e)
                });
        }



    }

    cambiarUsuario = (e) => {
        let buscado = e.target.value.trim().toLowerCase();
        const { users } = this.state;

        let encontrado = users.filter(user => user.id.trim().includes(buscado) || `${user.name} ${user.lastName}`.trim().includes(buscado)
        )

        this.setState({ usuariosConFiltro: encontrado, buscadorUsuario: buscado });
    }

    modificarFormulario = (e) => {
        e.preventDefault();

        let { dataToSend, responses, id } = this.state;

        dataToSend.responses = responses;


        // Quitamos las fechas si no se modifican sino generan error
        if(!this.state.monitoringDate) {
            dataToSend.monitoringDate = "";
        }

        if(!this.state.transactionDate) {
            dataToSend.transactionDate = "";
        }

        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.put(Global.monitoreos + '/' + id, dataToSend, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                
                this.setState({ loading: false })
                swal('Excelente', 'Archivo modificado correctamente', 'success').then(() => {
                    
                    this.componentDidMount();

                })


            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No se ha agregado el grupo", "info");
                }
                console.log("Error: ", e)
            })



    }

    uploadFile = (e) => {
        const { files } = e.target;
        const { id } = this.state;
        this.setState({ loading: true });
        
        let file = files.length > 0 ? files[0] : false;

        if(!file) return false;

        let formData = new FormData();

        formData.append('file', file);

        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.put(Global.monitoreos + '/' + id + '/file', formData, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                
                this.setState({ loading: false })
                swal('Excelente', 'Archivo subido correctamente', 'success').then(() => {
                    
                    this.componentDidMount();

                })


            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No se ha agregado el grupo", "info");
                }
                console.log("Error: ", e)
            })
    }


    downloadFile = (e) => {
        e.preventDefault();

        const { id } = e.target.dataset
        let win = window.open(Global.download + '/' + id + '?urltemp=false', '_blank');
        win.focus();
    }

    deleteFile = (e) => {
        e.preventDefault();
        const { id } = this.state;
        const fileId = e.target.dataset.id || false;

        if(!fileId) return false;


        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar un archivo, no podrás recuperarlo",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.setState({ loading: true });

                    let token = JSON.parse(sessionStorage.getItem('token'))
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    axios.delete(Global.monitoreos + '/' + id + '/' + fileId, config)
                    .then(response => {
                        sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                        this.setState({ loading: false })
                        swal('Excelente', 'Archivo eliminado correctamente', 'success').then(() => {
                            
                            this.componentDidMount();
        
                        })
        
                    })
                    .catch(e => {
                        if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                            HELPER_FUNCTIONS.logout()
                        } else {
                            sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                            swal("Atención", "No se ha agregado el grupo", "info");
                        }
                    });

                } else {
                    swal("No se elimino nada");
                }
            });
    }

    changeSelection = (e) => {
        e.preventDefault();
        const { value } = e.target;
        let { responses } = this.state;
        const { question, section, parent, id } = e.target.dataset;

        const changeValue = ({ id, value, parent }, object) => {
            // Buscar en object el padre y le agregamos un child
            if (object.id === parent) {
                object.child = {
                    id,
                    data: value
                }
                return object;
            } else if (object.child) {
                return changeValue({ id, value, parent }, object.child);
            } else {
                return false;
            }
        }


        if (!value && value !== '') return true;
        let respIndex = responses.findIndex(elem => elem.section === section && elem.question === question);
        let q = false;
        if (respIndex !== -1) {
            q = responses[respIndex];
        }


        if (!q) {
            // Creamos la respuesta
            q = {
                section,
                question,
                response: {}
            }
        }

        if (!parent) {
            // Entonces significa que estamos respondiendo una pregunta padre
            q.response = {
                data: value,
                id
            }
        } else if (respIndex !== -1) {
            // Entonces estamos contestando una pregunta hija

            changeValue({ id, value, parent }, q.response);


        } else return false;


        if (respIndex !== -1) {
            responses[respIndex] = q;
        } else {
            responses.push(q);
        }

        this.setState({ responses });

    }



    getDefaultValue = (id, question, section) => {
        const { responses } = this.state;
        if(responses) {
            let q = responses.find(elem => elem.question === question && elem.section === section);
    
            const getById = (id, values) => {
                if (!values) return "";
                let valrtn = "";
                if (values.id && values.id === id) {
                    valrtn = values.data
                } else if (values.child) {
                    valrtn = getById(id, values.child);
                }
    
                return valrtn;
            }
    
            return getById(id, q?.response)
        }
    }

    getCustomField = (value, sectionId) => {
        let index = (Date.now() * Math.random()).toString();

        let defaultValue = this.getDefaultValue(value.id, value.questionId, sectionId);
        let childs = []

        return (
            <article key={index}>
                <p>{value.question || value.name}</p>
                {value.type === 'select' &&

                    <>
                        <select
                            data-question={value.questionId}
                            data-parent={value.parentId}
                            data-section={sectionId}
                            value={defaultValue}
                            data-id={value.id}
                            name={sectionId+value.questionId+value.id}
                            onChange={this.changeSelection}
                        >
                            <option>Selecciona...</option>
                            {value.values.map((cf, ind) => {
                                if (cf.customFieldsSync) {
                                    childs.push({...cf.customFieldsSync[0], parentValue: cf.value})
                                }

                                return (<option value={cf.value} key={ind}>{cf.value}</option>)


                            })


                            }
                        </select>
                        {childs.length > 0 &&
                            childs.map((cf, ind) => {

                                return (
                                    <div key={ind} className={cf.parentValue === defaultValue ? "conditionalCF active" : "conditionalCF"}>
                                        {
                                            this.getCustomField({
                                                ...cf,
                                                questionId: value.questionId,
                                                parentId: value.id
                                            }, sectionId)
                                        }
                                    </div>)
                            })

                        }
                    </>
                }

                {value.type === 'text' &&
                    <>
                        <span>
                            <input
                                type="text"
                                placeholder={value.name}
                                data-section={sectionId}
                                data-question={value.questionId}
                                data-parent={value.parentId}
                                onBlur={this.changeSelection}
                                data-id={value.id}
                                name={sectionId+value.questionId+value.id}
                                defaultValue={defaultValue}
                                id={sectionId+value.questionId+value.id}
                            />
                            <label htmlFor={sectionId+value.questionId+value.id}>{value.name}</label>

                        </span>
                    </>
                }

                {value.type === 'area' &&
                    <>
                        <span>
                            <textarea
                                data-section={sectionId}
                                data-question={value.questionId}
                                data-parent={value.parentId}
                                onBlur={this.changeSelection}
                                data-id={value.id}
                                id={sectionId+value.questionId+value.id}
                                name={sectionId+value.questionId+value.id}
                                defaultValue={defaultValue}

                            >

                            </textarea>
                            <label htmlFor={sectionId+value.questionId+value.id}>{value.name}</label>

                        </span>
                    </>
                }
                {value.type === 'radio' &&
                    <>
                        {value.values.map((cf, ind) => {

                            return (
                                
                                <span className="active" key={ind}>
                                    <label>
                                    <input
                                        type="radio"
                                        checked={cf.value === defaultValue}
                                        value={cf.value}
                                        name={sectionId+value.questionId+value.id+index}
                                        data-id={value.id}
                                        data-section={sectionId}
                                        data-question={value.questionId}
                                        data-parent={value.parentId}
                                        onChange={this.changeSelection}
                                    />
                                    {cf.value}</label>


                                    {cf.customFieldsSync &&
                                        <div className={cf.value === defaultValue ? "conditionalCF active" : "conditionalCF"}>
                                            {
                                                this.getCustomField({
                                                    ...cf.customFieldsSync[0],
                                                    questionId: value.questionId,
                                                    parentId: value.id
                                                }, sectionId)
                                            }
                                        </div>
                                    }
                                </ span>
                            )
                        })

                        }
                    </>
                }

                {value.type === 'checkbox' &&
                    <>
                        {value.values.map((cf, ind) => {
                            return (
                                <span className="active" key={sectionId+value.questionId+value.id}>

                                    <input
                                        type="checkbox"
                                        checked={cf.value === defaultValue}
                                        value={cf.value}
                                        name={sectionId+value.questionId+value.id+index}
                                        data-id={value.id}
                                        data-section={sectionId}
                                        data-question={value.questionId}
                                        data-parent={value.parentId}
                                        onChange={this.changeSelection}
                                        id={sectionId+value.questionId+value.id+ind}
                                    />
                                    <label htmlFor={sectionId+value.questionId+value.id+ind}>{cf.value}</label>

                                    {cf.customFieldsSync &&
                                        <div className={cf.value === defaultValue ? "conditionalCF active" : "conditionalCF"}>
                                            {
                                                this.getCustomField({
                                                    ...cf.customFieldsSync[0],
                                                    questionId: value.questionId,
                                                    parentId: value.id
                                                }, sectionId)
                                            }
                                        </div>
                                    }
                                </ span>
                            )
                        })

                        }
                    </>
                }
            </article>
        )
    }

    handleChange = (e) => {
        let { dataToSend,transactionDate, monitoringDate } = this.state;
        const { id, value } = e.target;

        if(id === 'transactionDate') {
            transactionDate = true;
        } else if(id === 'monitoringDate') {
            monitoringDate = true;
        }
        if(id) {
            
            dataToSend[id] = value;
        }

        this.setState({ dataToSend, transactionDate, monitoringDate });

    }

    activeTextAreas = (e) => {
        let { id } = e.target.dataset;
        const { checked } = e.target;
        
        let { invalidarArea, disputarArea, dataToSend } = this.state;

        switch(id) {
            case "invalidated": 
                    invalidarArea = checked;
                    dataToSend.invalidated = checked;
                break;
            case "disputar":
                disputarArea = checked;
                dataToSend.disputar = checked;
                break;
            default:
                break;
        }

        this.setState({ invalidarArea, disputarArea, dataToSend });
    }


    render() {
        const {buscadorUsuario, usuarioSeleccionado, usuariosConFiltro,invalidarArea, dataToSend, disputarArea, monitoreo, loading, redirect } = this.state;

        if(redirect) {
            return <Redirect to={redirect} />
        }



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

                <div className="section-content">
                    {monitoreo &&
                    <>
                        <div className="monitorInfo">
                            <h4>Monitoreo {monitoreo.caseId} realizado a: {monitoreo.userInfo.name} {monitoreo.userInfo.lastName} ({monitoreo.userInfo.email})</h4>
                            <small>Creado por: {monitoreo.createdBy}</small>
                            <small>Programa: <strong>{monitoreo.program}</strong></small>
                            <small>Fecha de transacción: <strong>{moment(monitoreo.transactionDate).format('MMMM Do YYYY')}</strong></small>
                        </div>

                        <section className="monitorData">
                            <article>
                                <h6>Detalles del monitoreo</h6>

                                <span>
                                    <label>Usuario a monitorear</label>
                                    <input className="form-control" type="text" onFocus={this.buscarUsuarios} onChange={this.cambiarUsuario}/>
                                    
                                    {!buscadorUsuario && usuarioSeleccionado &&
                                        <small>
                                            Usuario Seleccionado: <strong>{usuarioSeleccionado.name} {usuarioSeleccionado.lastName} - {usuarioSeleccionado.id}</strong> 
                                        </small>
                                    }

                                    {usuariosConFiltro && buscadorUsuario &&
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>DNI</th>
                                                    <th>Nombre y apellido</th>
                                                </tr>
                                            </thead>
                                            {usuariosConFiltro?.slice(0, 10).map(user => {
                                                return (
                                                    <tbody key={user.id}
                                                        style={this.marcarFila(user)}
                                                        onClick={(e) => { e.preventDefault(); this.agregarUsuario(user); }}
                                                    >
                                                        <tr>
                                                            <td>{user.id}</td>
                                                            <td>{user.name} {user.lastName}</td>
                                                        </tr>
                                                    </tbody>
                                                )
                                            })}
                                        </table>
                                    }

                                </span>

                                <span>
                                    <label>Fecha de evaluación</label>
                                    <input type="date" value={dataToSend.monitoringDate} id="monitoringDate" onChange={this.handleChange} />
                                </span>

                                <span>
                                    <label>Fecha de transacción</label>
                                    <input type="date" value={dataToSend.transactionDate} id="transactionDate" onChange={this.handleChange} />
                                </span>

                                <span>
                                    <label>Comentarios</label>
                                    <textarea value={dataToSend.comments} id="comments" onChange={this.handleChange} ></textarea>
                                </span>


                                <span>
                                    <label>Improvment</label>
                                    <select value={dataToSend.improvment} id="improvment" onChange={this.handleChange} >
                                        <option value="+">Mejora</option>
                                        <option value="+-">Mantiene</option>
                                        <option value="-">Empeora</option>
                                    </select>
                                </span>

                                <span>
                                    <label>Estado</label>
                                    <select value={dataToSend.status} id="status" onChange={this.handleChange} >
                                        <option>Selecciona...</option>
                                        <option value="run">En proceso</option>
                                        <option value="finished">Finalizado</option>
                                    </select>
                                </span>

                            </article>
                            
                            <article className="monFiles">
                                <h6>Archivos</h6>

                                <input type="file" onChange={this.uploadFile} />

                                <div className="files">
                                    {monitoreo.files &&
                                        monitoreo.files.map((audio, ind) => {

                                            return (
                                                <span key={audio.fileId}>
                                                    <p>{audio.fileId}</p>
                                                    <button data-id={audio.fileId} onClick={this.downloadFile}>Descargar</button>
                                                    <button data-id={audio._id} onClick={this.deleteFile}>Eliminar</button>
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                            </article>

                            <article>
                                <h6>Disputar</h6>
                                <input data-id="disputar" checked={disputarArea}  onClick={this.activeTextAreas} type="checkbox"/>
                                {disputarArea &&
                                    <textarea  id="disputar" onChange={this.handleChange} value={dataToSend.disputado}></textarea>
                                }
                            </article>


                            <article>
                                <h6>Invalidar</h6>
                                <input data-id="invalidated" checked={invalidarArea} onClick={this.activeTextAreas} type="checkbox"/>
                                {invalidarArea &&
                                    <textarea id="invalidated" onChange={this.handleChange} value={dataToSend.invalidated}></textarea>
                                }
                            </article>


                            <article>
                                <h6>Devolución</h6>

                                <span>
                                    <label>Principales comentarios de devolución</label>
                                    <textarea id="comentariosDevolucion" onChange={this.handleChange} value={dataToSend.comentariosDevolucion}></textarea>
                                </span>

                                <span>
                                    <label>Fortalezas del usuario</label>
                                    <textarea id="fortalezasUsuario" onChange={this.handleChange} value={dataToSend.fortalezasUsuario}></textarea>
                                </span>

                                <span>
                                    <label>Pasos de mejora</label>
                                    <textarea id="pasosMejora" onChange={this.handleChange}  value={dataToSend.pasosMejora}></textarea>
                                </span>
                            </article>

                        </section>

                        <div className="formsOfMonitorings">
                        {monitoreo.responses &&
                            monitoreo.responses.map((v, i) => {
                                return (
                                    <section key={i}>
                                        <h6>{v.name}</h6>
                                        {v.customFields &&
                                            v.customFields.map((val, index) => {

                                                return this.getCustomField(val, v.id);
                                            })
                                        }
                                    </section>
                                )
                            })
                        }

                        </div>

                        <button type="button" className="btn" onClick={this.modificarFormulario}>Enviar</button>

                        <hr/>
                        <hr/>
                        <hr/>
                        <hr/>

                        <section className="logEdicion">
                            <h6>Editado por: </h6>
                            <article>
                                {monitoreo.modifiedBy &&
                                    monitoreo.modifiedBy.map(v => {
                                        return (<span key={v._id}>
                                            {v.userId} - {v.rol} - {moment(v.modifiedAt).format("DD/MM/YYYY HH:mm")}
                                        </span>)
                                    })
                                
                                }
                            </article>
                        </section>
                    </>
                    }
                </div>
            </>
        )
    }
}
