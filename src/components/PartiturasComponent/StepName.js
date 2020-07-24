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

export default class StepName extends Component {

    state = {
        loading: false,
        data: null,
        customFields: null
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

                console.log(response.data.Data)

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
        let { data, customFields } = this.state;
        data = data ? data[0] : null;

        let date = new Date();
        date = moment(date);

        const instances = data ? data.instances[0] : null;

        const step = instances ? instances.steps[0] : null;

        return (
            <>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

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
                                <h4>{step.name}</h4>
                                <article>
                                    {/* Custom file sync */}
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
                                <div className="information">

                                    <section>
                                        <article>
                                            <h6>Lider</h6>
                                            <div>
                                                <p>Audios requeridos: {step.requestedMonitorings}</p>
                                                <p>Audios faltantes: {(step.audioFiles === false ? step.requestedMonitorings : (step.requestedMonitorings - step.audioFiles.length))} </p>
                                                <select name="" id="">
                                                    <option value="file">Audio</option>
                                                    <option value="message">Mensaje</option>
                                                </select>
                                                <input type="file" name="" id="" />
                                                <input type="text" name="" id="" />
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
                                            </div>

                                            <label htmlFor="ddt">Detalle de transacción</label>
                                            <textarea name="" id="ddt" cols="30" rows="10"></textarea>

                                            <label htmlFor="cr">Causa Raíz</label>
                                            <textarea name="" id="cr" cols="30" rows="10"></textarea>

                                            <label htmlFor="cdr">Compromiso del representante</label>
                                            <textarea name="" id="cdr" cols="30" rows="10"></textarea>

                                            <label htmlFor="imp">Improvment</label>
                                            <select name="" id="imp">
                                                <option value="+">Mejoro el wachin</option>
                                                <option value="+-">Sigue igual</option>
                                                <option value="-">Es un inutil</option>
                                            </select>
                                        </article>
                                    </section>
                                    <section>
                                        <article>
                                            <h6>Responsable</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'RESP') {
                                                        return <CustomFields key={field.id} field={field} />
                                                    }
                                                })
                                            }
                                            cargamos los campos personalizados de resp (rekess)
                                        </article>

                                        <article>
                                            <h6>Gerente</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'GTE') {
                                                        return <CustomFields key={field.id} field={field} />
                                                    }
                                                })
                                            }
                                            cargamos los campos personalizados de gte (rekess)
                                        </article>

                                        <article>
                                            <h6>Coordinador On Site</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'COO') {
                                                        return <CustomFields key={field.id} field={field} />
                                                    }
                                                })
                                            }

                                                cargamos los campos personalizados de COO (rekess)
                                        </article>

                                        <article>
                                            <h6>Administrador</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'ADM') {
                                                        return <CustomFields key={field.id} field={field} />
                                                    }
                                                })
                                            }
                                            cargamos los campos personalizados de ADM (rekess)
                                        </article>

                                        <article>
                                            <h6>Coach</h6>
                                            {customFields &&
                                                customFields.map(field => {
                                                    if (field.section === 'P' && field.subsection === 'COACH') {
                                                        return <CustomFields key={field.id} field={field} />
                                                    }
                                                })
                                            }
                                            cargamos los campos personalizados de Coach (rekess)
                                        </article>

                                    </section>
                                </div>
                                <article>
                                    <label htmlFor="uploadAudio">Subir Audio</label>
                                    <input type="file" name="" id="" />

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
