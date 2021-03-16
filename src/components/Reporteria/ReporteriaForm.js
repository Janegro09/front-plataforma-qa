import axios from 'axios';
import React, { Component } from 'react'
import swal from 'sweetalert';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import './Reporteria.css';
import moment from 'moment';
export default class ReporteriaForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            partitures: [],
            clusters: [],
            instances: [],
            buscadorPartitura: null,
            dataToSend: {
                partitureId: "",
                clusters: [],
                instances: []
            },
            search_params: { limit: 10, offset: 0, q: "" }
        }
    }

    get_partitures = (search_params = false) => {
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        let url_with_params = Global.getAllPartitures;

        for(let p in search_params) {
            if(!search_params[p]) continue;
            url_with_params += url_with_params.includes('?') ? "&" : "?";
            url_with_params += `${p}=${search_params[p]}`
        }

        axios.get(url_with_params, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            const partitures = response.data?.Data || [];

            this.setState({
                partitures,
                buscadorPartitura: search_params.q,
                loading: false
            })

        }).catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false,
                        allPartitures: [],
                        buscadorPartitura: false
                    })
                }
                console.log("Error: ", e)
            });
    }

    componentDidMount () {
        HELPER_FUNCTIONS.set_page_title('Reporting');
    }

    searchPartiture = (e) => {
        let val = e.target.value;
        let { search_params } = this.state
        search_params.q = val;
        search_params.offset = 0;
        localStorage.setItem('searchPartiture', JSON.stringify(val));
        this.get_partitures(search_params);
        this.setState({ search_params });
    }

    handleChange = (e) => {
        const { id, value } = e.target;
        let { dataToSend } = this.state;


        if(value === "SeleccionarTodos"){
            if(id === "instances"){
                dataToSend[id] = [];
                dataToSend[id] = this.state.instances.map(v=> v.id);
            }else{
                dataToSend[id] = this.state[id];
            }
        }else if(value === "DeseleccionarTodos"){
            dataToSend[id] = [];
        }else{
            if(!dataToSend[id].includes(value)){
                dataToSend[id].push(value)
            }
        }


        this.setState({ dataToSend })
    }

    remove_object = (e) => {
        e.preventDefault();
        const { dataset, name } = e.target;
        let { dataToSend } = this.state;

        let id = false;
        if(dataset) {
            id = dataset.id;
        }
        
        if(dataToSend[name].length === 1 && id) {
            dataToSend[name] = [];
        } else if(dataToSend[name].length > 1 && id) {
            dataToSend[name] = dataToSend[name].filter(elem => elem !== id);
        }

        this.setState({ dataToSend });
        
    }

    agregarPartitura = (p) => {
        let { buscadorPartitura, dataToSend, clusters, instances } = this.state;

        if(!p) return false; 

        buscadorPartitura = "";
        dataToSend.partitureId = p;

        // Inicializamos variables
        dataToSend.instances = [];
        dataToSend.clusters = [];

        // Buscamos la data sobre esa partitura
        this.setState({ loading: true });
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures + '/dataReporting/' + p.id, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            if(response.data.Data) {
                clusters = response.data.Data.clusters || [];
                instances = response.data.Data.instances || [];
            }
            this.setState({
                loading: false,
                buscadorPartitura,
                dataToSend,
                clusters,
                instances
            })

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", `${e.response.data.Message}`, "error");
                }
                console.log("Error: ", e)
            });

    }

    getReport = (e) => {
        e.preventDefault();

        let { dataToSend } = this.state;

        dataToSend.partitureId = dataToSend.partitureId.id;

        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        this.setState({ loading: true });

        axios.post(Global.reporteria + '?s=analytics', dataToSend, config).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            })

            let p = response.data.Data || false;

            if (p.tempId) {
                let win = window.open(Global.download + '/' + p.tempId, '_blank');
                win.focus();
            }

        }).catch((e) => {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                this.setState({
                    loading: false
                })
                swal("Error!", `${e.response.data.Message}`, "error");
            }
            console.log("Error: ", e)
        });
    }

    render() {
        const { loading, buscadorPartitura, partitures, dataToSend, clusters, instances } = this.state;
        return (


            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                <form id="reporteria" onSubmit={this.getReport}>
                    <h4>Reportería</h4>
                    {/* <div className="form-group">
                        <label htmlFor="partitureId">Partitura: *</label>
                        <select className="form-control" id="partitureId">
                            <option>Selecciona ...</option>
                        </select>
                    </div> */}

                    <div>
                        <br />
                        <input
                            type="text"
                            placeholder="Buscar partitura"
                            onBlur={this.searchPartiture}
                            defaultValue={buscadorPartitura}
                            className="form-control margin-bottom-10"
                        />
                        {!buscadorPartitura && dataToSend.partitureId &&
                            <small>
                                Partitura Seleccionada: <strong>{dataToSend.partitureId.name}</strong>
                            </small>
                        }

                        {partitures.length > 0 && !!buscadorPartitura &&
                            <table className="tablaBuscarUsuarios">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                    </tr>
                                </thead>
                                {partitures.map(p => {
                                    return (
                                        <tbody key={p.id}
                                            onClick={(e) => { e.preventDefault(); this.agregarPartitura(p); }}
                                        >
                                        <tr>
                                            <td>{p.name} - {p.cuartiles.map(e => e + ' ')} - Created: {moment(p.dates.createdAt).format('D/M/Y')}</td>
                                        </tr>
                                        </tbody>
                                    )
                                })}
                            </table>
                        }


                    </div>

                    {!buscadorPartitura && dataToSend.partitureId &&
                        <>
                        {/* Clusters */}
                        <div className="form-group">
                            <label htmlFor="clusters">Clusters: *</label>
                            <br />
                            <select value="" className="form-control" id="clusters" onChange={this.handleChange}>
                                <option>Selecciona ...</option>
                                <option value="SeleccionarTodos">Seleccionar Todos</option>
                                <option value="DeseleccionarTodos">Deseleccionar Todos</option>
                                {clusters &&
                                    clusters.map(v => {
                                    return <option value={v}>{v}</option>
                                    })
                                }
                            </select>
                            <div className="programasSeleccionados">
                                {dataToSend.clusters &&
                                    dataToSend.clusters.map(v => {
                                        return (<span key={v}>{v}
                                            <button  type="button"  name="clusters" data-id={v} onClick={this.remove_object}>X</button>

                                        </span>)

                                    })
                                }
                            </div>
                        </div>

                        <hr/>
                        {/* Instances */}
                        <div className="form-group">
                            <label htmlFor="instances">Instances: *</label>
                            <br />
                            <select value="" className="form-control" id="instances" onChange={this.handleChange}>
                                <option value="">Selecciona ...</option>
                                <option value="SeleccionarTodos">Seleccionar Todos</option>
                                <option value="DeseleccionarTodos">Deseleccionar Todos</option>
                                {instances &&
                                    instances.map(v => {
                                        return <option value={v.id}>{v.name}</option>
                                    })
                                }
                            </select>
                            <div className="programasSeleccionados">
                                {dataToSend.instances &&
                                    dataToSend.instances.map(v => {
                                        // Buscamos la instancia
                                        let i = instances.find(inst => inst.id === v);
                                        return (<span key={v}>{i.name}
                                            <button type="button" name="instances" data-id={v} onClick={this.remove_object}>X</button>

                                        </span>)

                                    })
                                }
                            </div>
                        </div>

                        <hr/>

                        <button type="submit" className="btnSecundario floatRight">Descargar</button>
                        </>
                    }


                </form>
            </>
        )
    }
}
