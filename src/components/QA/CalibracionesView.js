import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'

import axios from 'axios';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import './Cal.css';

export default class componentName extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            redirect: false,
            calibration: false,
            id: false,
            printScreen: true
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({
            loading: true,
            id
        })

        document.addEventListener('click', () => {
            this.setState({ printScreen: false })
        })
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`


        axios.get(Global.calibration + '/' + id,{ headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            if(response.data.Data) {

                this.setState({
                    loading: false,
                    calibration: response.data.Data[0]
                })

            } else {
                this.setState({ redirect: '/calibraciones' })
            }
        }).catch((e) => {
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

    render() {
        const { printScreen, redirect, loading, calibration } = this.state;

        if (redirect) {
            return <Redirect to={redirect} />
        }

        return (
            <>
                {!printScreen &&

                    <div className="header">
                        {/* BOTON DE SALIDA */}
                        {/* BARRA LATERAL IZQUIERDA */}
                        <SiderbarLeft />
                        <UserAdminHeader />
                    </div>
                }
                {printScreen &&
                    window.print()
                }

                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                
                {calibration &&
                    <div className="section-content">
                            <section className="sectionTitles">
                                <h2>Datos de la calibración</h2>
                                <hr />
                                <h4>Cablibracion - Case ID: {calibration.caseId}</h4> 
                                <p>Creado: {moment(calibration.createdAt).format('DD/MM/YYYY')}</p> 
                                <p>Fecha de inicio: {moment(calibration.startDate).format('DD/MM/YYYY')}</p> 
                                <p>Fecha de fin: {moment(calibration.endDate).format('DD/MM/YYYY')}</p> 
                                
                            </section>
                            <section className="sectionTitles">
                                <h2>Experto</h2>
                                <hr />
                                <h4>{calibration.expert.name} {calibration.expert.lastName}</h4> 
                                <p>Legajo: {calibration.expert.legajo}</p>
                                <p>ID / DNI: {calibration.expert.id}</p>
                            </section>
                            <section className="sectionTitles">
                                <h2>Calibradores</h2>
                                <hr />
                                {calibration.calibrators.map((v, i) => {
                                    return (
                                        <article key={v.idDB}>
                                            <h4>{i + 1}. {v.name} {v.lastName}</h4> 
                                            <p>Legajo: {v.legajo}</p>
                                            <p>ID / DNI: {v.id}</p>
                                        </article>
                                    )
                                })

                                }
                            </section>
                            <section className="sectionTitles resultados">
                                <h2>Resultados</h2>
                                <hr />
                                {calibration?.calibration.comparacion.map((v, i) => {
                                    return (
                                        <article key={v.question} className="question">
                                            <h4>{i + 1}. {v.questionName}</h4> 
                                            <span>
                                                <h6>Resultados</h6>
                                                <table>
                                                    <thead>
                                                        <th>Respuesta</th>
                                                        <th>Cant. Respuestas</th>
                                                        <th>Resultado</th>
                                                    </thead>
                                                    <tbody>
                                                        {v.result.map(result => {
                                                            return (
                                                                <tr key={result.respuesta}>
                                                                    <td>{result.respuesta}</td>        
                                                                    <td>{result.cant}</td>        
                                                                    <td>{result.porcentaje}</td>        
                                                                </tr>
                                                            )
                                                        })

                                                        }
                                                    </tbody>
                                                </table>
                                            </span>

                                        </article>
                                    )
                                })

                                }
                            </section>
                        </div>
                }
            </>
        )
    }
}
