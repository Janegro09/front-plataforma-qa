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
import GetAppIcon from '@material-ui/icons/GetApp';


export default class PartiturasEspecificComponent extends Component {

    state = {
        id: null,
        loading: false,
        data: null,
        idUsuario: null,
        filtredData: null,
        totalDisplayed: 20,
        redirect:null
    }

    volverAtras = (e) => {
        // console.log(e.preventDefault());
        e.preventDefault();
        this.setState({redirect: "/partituras"});
    }

    buscar = (e) => {
        const val = e.target.value.toUpperCase();
        let { data, filtredData } = this.state;
        const users = data[0].users;
        if (val) {
            filtredData = [];

            for (let u of users) {
                let nameLastName = `${u.name} ${u.lastName}`
                nameLastName = nameLastName.toUpperCase() 
                let lider = u.lider
                lider = lider.toUpperCase() 
                if (u.id.indexOf(val) >= 0) {
                    filtredData.push(u)
                } else if (nameLastName.indexOf(val) >= 0) {
                    filtredData.push(u)
                } else if (lider.indexOf(val) >= 0) {
                    filtredData.push(u)
                } else {
                    let nameDividido = nameLastName.split(' ');
                    let busquedaDividida = val.split(' ');
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

    }

    descargarArchivos = async (fileIds) => {
        for (let f of fileIds) {
            let win = window.open(Global.download + '/' + f + '?urltemp=false', '_blank');
            win.focus();
        }
    }

    verUsuario = (id) => {
        this.setState({
            idUsuario: id
        });
    }

    showMore = () => {
        let { totalDisplayed } = this.state;
        totalDisplayed += 10;
        this.setState({ totalDisplayed });
        document.getElementById('ver-mas-partituras').focus();
    }

    dynamicSort = (property) => {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return (a, b) => {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    ascDesc = (field) => {
        let { filtredData } = this.state
        let dataOrdenada = filtredData.sort(this.dynamicSort(field));
        this.setState({
            filtredData: dataOrdenada
        })
    }

    componentDidMount() {
        HELPER_FUNCTIONS.set_page_title('Partitures');
        let id = this.props.match.params.id;

        this.setState({
            loading: true
        });

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures + '/' + id, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false,
                data: response.data.Data,
                filtredData: response.data.Data[0].users || null
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
        let { loading, data, idUsuario, filtredData, totalDisplayed,redirect } = this.state;
        data = data ? data[0] : null;

        if (idUsuario) {
            let id = this.props.match.params.id;
            return <Redirect to={`/partituras/${id}/${idUsuario}`} />
        }
        
        if(redirect) {
            return <Redirect to={redirect} />
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
                                    <th className="tableIcons">Descargar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{moment(data.dates.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                    <td>{data.name}</td>
                                    <td className="tableIcons">
                                        {(data.partitureStatus === 'pending' ? <TimerIcon /> : (data.partitureStatus === 'finished' ? <CheckIcon /> : <PlayArrowRoundedIcon />))}
                                    </td >

                                    <td className="tableIcons">{data.fileId.length}</td>

                                    <td className="tableIcons">
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            this.descargarArchivos(data.fileId);
                                        }}>
                                            <GetAppIcon />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br></br>
                        <p>Usuarios</p>
                        <input onChange={this.buscar} className="form-control" placeholder="Buscar por usuario | Nombre o DNI" />
                        <br></br>
                        <table>
                            <thead>
                                <tr>

                                    <th>DNI</th>
                                    <th
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.ascDesc('name')
                                        }}
                                    >
                                        Nombre
                                    </th>
                                    <th
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.ascDesc('canal')
                                        }}
                                    >
                                        Canal
                                    </th>
                                    <th>??ltima actualizaci??n</th>
                                    <th
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.ascDesc('cluster')
                                        }}
                                    >
                                        Cluster
                                    </th>
                                    <th>Grupo asignado</th>
                                    <th
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.ascDesc('responsable')
                                        }}
                                    >
                                        Responsable
                                    </th>
                                    <th
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.ascDesc('lider')
                                        }}
                                    >
                                        Lider
                                    </th>
                                    <th className="tableIcons">Estado</th>
                                    <th className="tableIcons"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.ascDesc('improvment')
                                        }}
                                    >
                                        Improvment
                                    </th>
                                    <th className="tableIcons">Audios</th>
                                    <th className="tableIcons">Ver</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtredData &&
                                    filtredData.slice(0, totalDisplayed).map(user => {
                                        return (
                                            <tr key={user.idDB}>
                                                <td>{user.dni}</td>

                                                <td>{user.name} {user.lastName}</td>
                                                <td>{user.canal}</td>
                                                <td>{user.lastUpdate.map(data => {
                                                    return <p key={data.date}>{moment(data.date).format("DD/MM/YYYY")} - {data.section} - {data.user}<br /></p>
                                                })}</td>
                                                <td>{user.rowFromPartiture.Cluster}</td>
                                                <td>{user.rowFromPartiture['Grupos de cuartiles Asignados']}</td>
                                                <td>{user.responsable}</td>
                                                <td>{user.lider}</td>
                                                <td className="tableIcons">{(user.partitureStatus === 'pending' ? <TimerIcon className="timerIcon" /> : (user.partitureStatus === 'finished' ? <CheckIcon className="CheckIcon" /> : <PlayArrowRoundedIcon className="PlayArrowRoundedIcon" />))}</td>

                                                <td className="tableIcons">{(user.improvment === "+" ?
                                                    <ExpandLessIcon className="arrowUp" /> : (user.improvment === "+-" ?
                                                        <ImportExportRoundedIcon /> : <ExpandMoreIcon className="arrowDown" />))}</td>
                                                <td className="tablaVariables tableIcons"><div className={` ${!(user.audioFilesRequired - user.audioFilesActually) <= 0 ? "estadoInactivo " : 'estadoActivo'}`}></div></td>
                                                <td><button onClick={(e) => {
                                                    e.preventDefault();
                                                    this.verUsuario(user.idDB)
                                                }}><VisibilityRoundedIcon className="verIcon" /></button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        <div
                            id="ver-mas-partituras"
                            className="ver-mas"
                            onClick={() => this.showMore()}
                        >
                            <ExpandMoreIcon />
                        </div>
                    </div>

                }

                    <button
                        className="btnSecundario pasoAnterior"
                        
                            onClick={this.volverAtras}
                    >
                        Paso anterior
                    </button>
            </>
        )
    }
}
