import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import axios from 'axios';
import Global from '../../Global';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import CheckIcon from '@material-ui/icons/Check';
import TimerIcon from '@material-ui/icons/Timer';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';

export default class PartiturasEspecificComponent extends Component {

    state = {
        id: null,
        loading: false,
        data: null,
        idUsuario: null,
        goBack: false
    }

    verUsuario = (id) => {
        this.setState({
            idUsuario: id
        });
    }

    volver = () => {
        this.setState({ goBack: true });
    }

    componentDidMount() {
        let id = this.props.match.params.id;

        this.setState({
            loading: true
        });

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures + '/' + id, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
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
        let { loading, data, idUsuario, goBack } = this.state;
        data = data ? data[0] : null;

        if (goBack) {
            return <Redirect to={`/partituras`} />
        }


        if (idUsuario) {
            let id = this.props.match.params.id;
            return <Redirect to={`/partituras/${id}/${idUsuario}`} />
        }

        return (
            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                {data &&
                    <div className="section-content">
                        <button
                            onClick={ (e) => {
                                e.preventDefault();
                                this.volver();
                            } }
                        >
                            Partituras
                        </button>

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

                        <h2>Usuarios</h2>
                        <table>
                            <thead>
                                <tr>
                                    
                                    <th>DNI</th>
                                    <th>Nombre</th>
                                    <th>Canal</th>
                                    <th>Última actualización</th>
                                    <th>Cluster</th>
                                    <th>Responsable</th>
                                    <th>Estado</th>
                                    <th>Improvment</th>
                                    <th>Audios</th>
                                    <th>Ver</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.users &&
                                    data.users.map(user => {
                                        return (
                                            <tr key={user.idDB}>
                                                <td>{user.dni}</td>

                                                <td>{user.name} {user.lastName}</td>
                                                <td>{user.canal}</td>
                                                <td>{user.lastUpdate.map(data => {
                                                    return <p key={data.date}>{moment(data.date).format("DD/MM/YYYY")} - {data.section} - {data.user}<br /></p>
                                                })}</td>
                                                <td>{user.cluster}</td>
                                                <td>{user.responsable}</td>
                                                <td>{(user.partitureStatus === 'pending' ? <TimerIcon />:(user.partitureStatus === 'finish' ? <CheckIcon />:<PlayArrowRoundedIcon />))}</td>

                                                <td>{(user.improvment === "+" ? 
                                                <ArrowDropUpRoundedIcon />: (user.improvment === "+-" ? 
                                                <ArrowDropDownRoundedIcon />:<ImportExportRoundedIcon />))}</td>
                                                <td className="tablaVariables"><div className={` ${!(user.audioFilesRequired - user.audioFilesActually) <= 0? "estadoInactivo " : 'estadoActivo'}`}></div></td>
                                                            <td><button onClick={(e) => {
                                                                e.preventDefault();
                                                                this.verUsuario(user.idDB)
                                                            }}><VisibilityRoundedIcon /></button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </>
        )
    }
}
