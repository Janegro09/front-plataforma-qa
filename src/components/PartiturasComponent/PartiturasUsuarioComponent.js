import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import Global from '../../Global';
import swal from 'sweetalert';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded';
import CheckIcon from '@material-ui/icons/Check';
import TimerIcon from '@material-ui/icons/Timer';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import Checkbox from '@material-ui/core/Checkbox';
import './partitures.css';
// import { LensTwoTone } from '@material-ui/icons';

export default class PartiturasUsuarioComponent extends Component {

    state = {
        loading: false,
        data: null,
        redirect: false,
        id: null,
        volver: false
    }

    modificarEstado = (StepId) => {
        // Hace un request a put y envia ID del 
        let { id, idUsuario } = this.props.match.params;
        let bodyParameters = [
            { "stepId": StepId, "completed": true }
        ];

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.put(Global.getAllPartitures + '/' + id + '/' + idUsuario, bodyParameters, { headers: { Authorization: bearer } })
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token));
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atenci??n", "No se ha agregado el grupo", "info");
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
            let value = users.rowFromPartiture[th]
            console.log(value);
            if(th.includes('%')){
                if(!isNaN(value)){
                    value = parseFloat(value) * 100;
                }
            } 

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
                            <td>{(users.partitureStatus === 'pending' ? <TimerIcon className="clockIcon" /> : (users.partitureStatus === 'finished' ? <CheckIcon /> : <PlayArrowRoundedIcon />))}</td>
                            <td>{(users.improvment === "+" ?
                                <ExpandLessIcon className="arrowUp" /> : (users.improvment === "+-" ?  <ImportExportRoundedIcon />
                                   : <ExpandMoreIcon className="arrowDown" />))}</td>
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
        HELPER_FUNCTIONS.set_page_title('Partitures');
        let { id, idUsuario } = this.props.match.params;

        this.setState({
            loading: true
        });

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures + '/' + id + '/' + idUsuario, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false,
                data: response.data.Data
            })

        })
            .catch((e) => {
                // Si hay alg??n error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    // swal("Error!", "Hubo un problema", "error");
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });
    }
    render() {
        let { data, redirect, id, loading, volver } = this.state;
        data = data ? data[0] : null;
        let date = new Date();
        date = moment(date);

        if (redirect) {
            return <Redirect to={'/partituras/step/' + this.props.match.params.id + '/' + this.props.match.params.idUsuario + '/' + id} />
        }

        if (volver) {
            return <Redirect to={'/partituras/' + this.props.match.params.id} />
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

                {data &&
                    <div className="section-content">

                        <button
                            className="btnSecundario pasoAnterior"
                            
                            onClick={() => { this.volverAtras() }}
                        >
                            Paso anterior
                        </button>

                        <h4>PARTITURAS</h4>
                        <hr />
                        <br />
                        <p>Archivo actual</p>
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
                                        {(data.partitureStatus === 'pending' ? <TimerIcon className="clockIcon" /> :
                                            (data.partitureStatus === 'finished' ? <CheckIcon /> : <PlayArrowRoundedIcon />))}
                                    </td >
                                    <td className="tableIcons">{data.fileId.length}</td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <p>Usuario actual</p>
                        {this.getUsersColumns()}

                        <section>
                            {data.instances &&
                                data.instances.map(v =>
                                    (
                                        <article key={v.id}>
                                            <div className="headerBox">
                                            <h6 className="titulo-semana">{v.name}</h6>
                                            <span className={!moment(v.dates.expirationDate).isBefore(date) ? 'fecha' : 'fecha vencido'}>Venc. {moment(v.dates.expirationDate).format("DD/MM/YYYY")}</span>
                                            </div>
                                            <div className="steps">
                                                {v.steps.length > 0 &&
                                                    v.steps.map(s => (
                                                        <span key={s.id}>
                                                            <Checkbox
                                                                onClick={
                                                                    (e) => {
                                                                        e.preventDefault();
                                                                        this.goToStep(s.id);
                                                                    }
                                                                }
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
