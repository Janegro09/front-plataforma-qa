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
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import CheckIcon from '@material-ui/icons/Check';
import TimerIcon from '@material-ui/icons/Timer';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
export default class PartiturasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            allPartitures: [],
            specific: false,
            idSpecific: '',
            modalAgregar: false,
            filtredData: null,
            orderedData: null,
            withoutPartitures: false,
            grupoAssigned: null,
            search_params: { limit: 10, offset: 0, q: "" }
        }
    }

    buscar = (e) => {
        let val = e.target.value;
        let { search_params } = this.state
        search_params.q = val;
        search_params.offset = 0;
        localStorage.setItem('searchPartiture', JSON.stringify(val));
        this.get_partitures(search_params);
        this.setState({ search_params });
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
        let token = JSON.parse(localStorage.getItem('token'))
        this.setState({
            loading: true
        })
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.delete(Global.getAllPartitures + '/' + id, config)
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token));
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
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al intentar borrar el rol", "error");
                    this.setState({
                        loading: false,
                        redirect: true
                    })
                }
                console.log("Error: ", e)
            })
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
        let { allPartitures } = this.state
        let dataOrdenada = allPartitures.sort(this.dynamicSort(field));
        this.setState({
            orderedData: dataOrdenada
        })
    }

    get_partitures = (search_params = false) => {
        this.setState({
            loading: true
        })

        const searchPartiture = JSON.parse(localStorage.getItem("searchPartiture"))
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        let url_with_params = Global.getAllPartitures;

        // Ponemos un codicional, por si el usuario buscó entonces renovamos el array
        let renovar_array = false;

        if(searchPartiture!=''){
            this.state.search_params.q=searchPartiture;
        } 

        if(!search_params) {
            search_params = this.state.search_params
        } else {
            renovar_array = true;
        }



        for(let p in search_params) {
            if(!search_params[p]) continue;
            url_with_params += url_with_params.includes('?') ? "&" : "?";
            url_with_params += `${p}=${search_params[p]}`
        }

        axios.get(url_with_params, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            const data = response.data?.Data || [];
            const array_to_insert = renovar_array ? data : [ ...this.state.allPartitures, ...data ];
            search_params.offset = array_to_insert.length;

            this.setState(
                {
                allPartitures: array_to_insert,
                loading: false,
                search_params
            })

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false,
                        withoutPartitures: true,
                        allPartitures: renovar_array ? [] : this.state.allPartitures
                    })
                }
                console.log("Error: ", e)
            });
    }

    componentDidMount() {
        HELPER_FUNCTIONS.set_page_title('Partitures');
        // Hacer rekest
        this.get_partitures();
    }

    verMas = () => { this.get_partitures(); }

    render() {
        let { allPartitures, loading, specific, idSpecific, modalAgregar, filtredData, withoutPartitures } = this.state;

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


                    <>
                        <h4>PARTITURAS</h4>
                        <hr />
                        <br />
                        <div className="flex-input-add">
                            < input onBlur={this.buscar} className="form-control" placeholder="Buscar por nombre de archivo" />
                            {HELPER_FUNCTIONS.checkPermission('POST|analytics/partitures/new') &&
                                <button className="addItem morph"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            this.crearPartitura();
                                        }
                                    }
                                >
                                    <AddIcon className="svgAddButton" style={{ fontSize: 33 }} />

                                </button>
                            }
                        </div>
                    </>


                    {withoutPartitures &&
                        <div className="alert alert-warning">No hay partituras para mostrar</div>
                    }
                    {allPartitures !== null &&
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        Fechas
                                    </th>
                                    <th
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log("Clickeaste");
                                            this.ascDesc('name')
                                        }}
                                    >
                                        Nombre
                                    </th>
                                    <th className="tableIcons">Clusters</th>
                                    <th className="tableIcons">Estado</th>
                                    <th className="tableIcons">Archivos</th>
                                    <th className="tableIcons">Ver</th>
                                    <th className="tableIcons">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPartitures.map((partiture, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{moment(partiture.dates.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                            <td>{partiture.name}</td>
                                            <td>{partiture.cuartiles.map(e => `${e} `)}</td>
                                            <td className="tableIcons">{(partiture.partitureStatus === 'pending' ? <TimerIcon className="clockIcon" /> : (partiture.partitureStatus === 'finished' ? <CheckIcon /> : <PlayArrowRoundedIcon />))}</td>
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
                                                    <VisibilityRoundedIcon className="verIcon" />
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
                                                        <DeleteIcon style={{ fontSize: 15 }} />
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
                    <div
                        id="ver-mas"
                        className="ver-mas"
                        onClick={
                            (e) => {
                                e.preventDefault();
                                this.verMas();
                            }
                        }
                    >
                        <ExpandMoreIcon />
                    </div>
                </div>
            </div >
        )
    }
}
