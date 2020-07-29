import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import axios from 'axios';
import Global from '../../Global';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import CheckIcon from '@material-ui/icons/Check';
import TimerIcon from '@material-ui/icons/Timer';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default class PartiturasEspecificComponent extends Component {

    state = {
        id: null,
        loading: false,
        data: null,
        idUsuario: null,
        goBack: false,
        filtredData: null
    }

    buscar = (e) => {
        const val = e.target.value;
        let { data, filtredData } = this.state;
        const users = data[0].users;
        if(val) {
            filtredData = [];
            
            for(let u of users) {
                let nameLastName = `${u.name} ${u.lastName}`
                if(u.id.indexOf(val) >= 0) {
                    filtredData.push(u)
                } else if(nameLastName.indexOf(val) >= 0) {
                    filtredData.push(u)
                } else {
                    let nameDividido        = nameLastName.split(' ');
                    let busquedaDividida    = val.split(' ');
                    let coincide = 0;
                    for (let x = 0; x < nameDividido.length; x++) {
                        for (let y = 0; y < busquedaDividida.length; y++) {
                            if (nameDividido[x].indexOf(busquedaDividida[y]) >= 0) {
                                coincide++;
                            }
                        }
                    }
                    if (coincide === busquedaDividida.length) {
                        filtredData.push(u);
                    }

                }
            }   
        } else {
            filtredData = users;
        }

        this.setState({ filtredData });

        console.log(val);
    }

    descargarArchivos = async (fileIds) => {
        for(let f of fileIds) {
            let win = window.open(Global.download + '/' + f + '?urltemp=false', '_blank');
            win.focus();
        }
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
                data: response.data.Data,
                filtredData: response.data.Data[0].users || null
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
        let { loading, data, idUsuario, goBack, filtredData } = this.state;
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
                                    <th className="tableIcons">Estado</th>
                                    <th className="tableIcons">Archivos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{moment(data.dates.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                    <td>{data.name}</td>
                                    <td>
                                    {(data.partitureStatus === 'pending' ? <TimerIcon />:(data.partitureStatus === 'finished' ? <CheckIcon />:<PlayArrowRoundedIcon />))}
                                    </td>

                                    <td>{data.fileId.length}</td>

                                    <td>
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            this.descargarArchivos(data.fileId);
                                        }}>
                                            Descargar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <h2>Usuarios</h2>
                        <input onChange={this.buscar} className="form-control" placeholder="Buscar por usuario | Nombre o DNI"/>
                        <table>
                            <thead>
                                <tr>
                                    
                                    <th>DNI</th>
                                    <th>Nombre</th>
                                    <th>Canal</th>
                                    <th>Última actualización</th>
                                    <th>Cluster</th>
                                    <th>Responsable</th>
                                    <th className="tableIcons">Estado</th>
                                    <th className="tableIcons">Improvment</th>
                                    <th className="tableIcons">Audios</th>
                                    <th className="tableIcons">Ver</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtredData &&
                                    filtredData.map(user => {
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
                                                <td className="tableIcons">{(user.partitureStatus === 'pending' ? <TimerIcon className="timerIcon"/>:(user.partitureStatus === 'finished' ? <CheckIcon className="CheckIcon" />:<PlayArrowRoundedIcon className="PlayArrowRoundedIcon"/>))}</td>

                                                <td className="tableIcons">{(user.improvment === "+" ? 
                                                <ExpandLessIcon className="arrowUp"/>: (user.improvment === "+-" ? 
                                                <ExpandMoreIcon className="arrowDown"/>:<ImportExportRoundedIcon />))}</td>
                                                <td className="tablaVariables tableIcons"><div className={` ${!(user.audioFilesRequired - user.audioFilesActually) <= 0? "estadoInactivo " : 'estadoActivo'}`}></div></td>
                                                            <td><button onClick={(e) => {
                                                                e.preventDefault();
                                                                this.verUsuario(user.idDB)
                                                            }}><VisibilityRoundedIcon className="verIcon"/></button></td>
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
