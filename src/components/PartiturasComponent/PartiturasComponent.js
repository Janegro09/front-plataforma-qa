import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import Modal from './Modal'
import axios from 'axios';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import swal from 'sweetalert';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import ImportExportRoundedIcon from '@material-ui/icons/ImportExportRounded';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import CheckIcon from '@material-ui/icons/Check';
import TimerIcon from '@material-ui/icons/Timer';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


export default class PartiturasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allPartitures: null,
            specific: false,
            idSpecific: '',
            modalAgregar: false,
            filtredData: null
        }
    }

    buscar = (e) => {
        let val = e.target.value;
        let { filtredData, allPartitures } = this.state;
        filtredData = [];
        if(val){
            for(let p of allPartitures) {
                let name = p.name.toLowerCase();
                val = val.toLowerCase();
                if(name === val) {
                    filtredData.push(p)
                } else {
                    let actualPartitureName = name.split(' ');
                    let busquedaActual = val.split(' ');
                    let coincide = 0;

                    for(let x = 0; x < actualPartitureName.length; x++) {
                        for(let j = 0; j < busquedaActual.length; j++){
                            if(actualPartitureName[x].indexOf(busquedaActual[j]) >= 0) {
                                coincide++;
                            }
                        }
                    }

                    if(coincide === busquedaActual.length){
                        filtredData.push(p);
                    }

                }
            }
        } else {
            filtredData = allPartitures;
        }

        this.setState({ filtredData });

    }

    verPartitura = (id) => {
        // Hacer rekest
        this.setState({
            specific: true,
            idSpecific: id
        });
    }

    crearPartitura = () => {
        this.setState({ modalAgregar: true });
    }

    eliminarPartitura = (id) => {
        let token = JSON.parse(sessionStorage.getItem('token'))
        this.setState({
            loading: true
        })
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.delete(Global.getAllPartitures + '/' + id, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token));
                this.setState({
                    loading: false
                })
                if (response.data.Success) {
                    swal("Partitura eliminada correctamente", {
                        icon: "success",
                    }).then(() => {
                        window.location.reload(window.location.href);
                    })
                }
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al intentar borrar el rol", "error");
                    this.setState({
                        loading: false,
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })
    }

    componentDidMount() {
        // Hacer rekest
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                allPartitures: response.data.Data,
                filtredData: response.data.Data,
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
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });

    }

    render() {
        let { allPartitures, loading, specific, idSpecific, modalAgregar, filtredData } = this.state;

        if (specific) {
            return <Redirect to={`/partituras/${idSpecific}`} />
        }

        return (
            <div>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                {modalAgregar &&
                    <Modal />
                }

                <div className="section-content">
                <h4>PARTITURAS</h4>
                    {HELPER_FUNCTIONS.checkPermission('POST|analytics/partitures/new') &&
                        <button
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    this.crearPartitura();
                                }
                            }
                        >
                            Crear partitura
                        </button>
                    }



                    <input onChange={this.buscar} className="form-control" placeholder="Buscar por nombre de archivo"/>
                    {allPartitures !== null &&
                        
                        <table>
                            <thead>
                                <tr>
                                    <th>Fechas</th>
                                    <th>Nombre</th>
                                    <th className="tableIcons">Estado</th>
                                    <th className="tableIcons">Archivos</th>
                                    <th className="tableIcons">Ver</th>
                                    <th className="tableIcons">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtredData.map((partiture, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{moment(partiture.dates.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                            <td>{partiture.name}</td>
                                            <td className="tableIcons">{(partiture.partitureStatus === 'pending' ? <TimerIcon className="clockIcon"/>:(partiture.partitureStatus === 'finished' ? <CheckIcon />:<PlayArrowRoundedIcon />))}</td>
                                            <td className="tableIcons">{partiture.fileId.length.toString()}</td>
                                            <td className="tableIcons">
                                                <button
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            this.verPartitura(partiture.id);
                                                        }
                                                    }
                                                >
                                                    <VisibilityRoundedIcon className="verIcon"/>
                                                </button>
                                            </td>
                                            <td className="tableIcons">
                                                {HELPER_FUNCTIONS.checkPermission('DELETE|analytics/partitures/:id') &&
                                                    <button
                                                        onClick={
                                                            (e) => {
                                                                e.preventDefault();
                                                                this.eliminarPartitura(partiture.id);
                                                            }
                                                        }
                                                    >
                                                        Eliminar
                                                    </button>
                                                }
                                                {!HELPER_FUNCTIONS.checkPermission('DELETE|analytics/partitures/:id') &&
                                                    <button
                                                    disabled
                                                    >
                                                        Eliminar
                                                    </button>
                                                }
                                            </td>

                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                    }
                </div>
                <div className="footer"></div>
            </div>
        )
    }
}
