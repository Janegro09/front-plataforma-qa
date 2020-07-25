import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import Global from '../../Global';
import swal from 'sweetalert';
import moment from 'moment';
import './partitures.css';
import { Redirect } from 'react-router-dom';

export default class PartiturasUsuarioComponent extends Component {

    state = {
        loading: false,
        data: null,
        redirect: false,
        id: null
    }

    modificarEstado = (StepId) => {
        // Hace un request a put y envia ID del 
        let { id, idUsuario } = this.props.match.params;
        let bodyParameters = [
            { "stepId": StepId, "completed": true }
        ];

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.put(Global.getAllPartitures + '/' + id + '/' + idUsuario, bodyParameters, { headers: { Authorization: bearer } })
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token));
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No se ha agregado el grupo", "info");
                    this.setState({
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })
    }

    goToStep = (id) => {

        this.setState({
            redirect: true,
            id
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

    componentDidMount() {
        let { id, idUsuario } = this.props.match.params;

        console.log("id: ", id);
        console.log("idUsuario: ", idUsuario);


        this.setState({
            loading: true
        });

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures + '/' + id + '/' + idUsuario, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            console.log(response.data.Data)
            this.setState({
                loading: false,
                data: response.data.Data
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
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }
    render() {
        let { data, redirect, id } = this.state;
        data = data ? data[0] : null;
        let date = new Date();
        date = moment(date);

        ;

        if (redirect) {
            return <Redirect to={'/partituras/step/' + this.props.match.params.id + '/' + this.props.match.params.idUsuario + '/' + id} />
        }

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
                        <h2>Archivo actual</h2>
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

                        <h2>Usuario actual</h2>
                        {this.getUsersColumns()}

                        <section>
                            {data.instances &&
                                data.instances.map(v =>
                                    (
                                        <article key={v.id}>
                                            <h6>{v.name}</h6>
                                            <p className={!moment(v.dates.expirationDate).isBefore(date) ? 'fecha' : 'fecha vencido'}>{moment(v.dates.expirationDate).format("DD/MM/YYYY")}</p>
                                            <div className="steps">
                                                {v.steps.length > 0 &&
                                                    v.steps.map(s => (
                                                        <span key={s.id}>
                                                            <input
                                                                type="checkbox"
                                                                onChange={() => {
                                                                    this.modificarEstado(s.id);
                                                                }}
                                                                defaultChecked={s.completed} />
                                                            <p onClick={(e) => {
                                                                e.preventDefault();
                                                                this.goToStep(s.id);
                                                            }}>{s.name}</p>
                                                            <p>{s.requestedMonitorings}</p>
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        </article>
                                    )
                                )

                            }

                        </section>
                    </div>
                }

            </>
        )
    }
}