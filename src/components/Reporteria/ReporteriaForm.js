import axios from 'axios';
import React, { Component } from 'react'
import swal from 'sweetalert';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import './Reporteria.css';

export default class ReporteriaForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            partitures: [],
            clusters: [],
            instances: [],
            partituresFiltred: [],
            buscadorPartitura: null,
            dataToSend: {
                partitureId: "",
                clusters: [],
                instances: []
            }
        }
    }


    componentDidMount () {
        HELPER_FUNCTIONS.set_page_title('Reporting');
        this.setState({ loading: true });
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                partitures: response.data.Data,
                loading: false,
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

    searchPartiture = (e) => {
        let buscado = e.target.value.toUpperCase();
        const { partitures } = this.state;

        let encontrado = partitures.filter(p => p.name.includes(buscado));

        this.setState({ partituresFiltred: encontrado, buscadorPartitura: buscado });

    }

    handleChange = (e) => {
        const { id, value } = e.target;
        let { dataToSend } = this.state;

        if(!dataToSend[id].includes(value)){
            dataToSend[id].push(value)
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
        const { loading, buscadorPartitura, partituresFiltred, dataToSend, clusters, instances } = this.state;
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
                            onChange={this.searchPartiture}
                            value={buscadorPartitura}
                            className="form-control margin-bottom-10"
                        />
                        {!buscadorPartitura && dataToSend.partitureId &&
                            <small>
                                Partitura Seleccionada: <strong>{dataToSend.partitureId.name}</strong>
                            </small>
                        }

                        {partituresFiltred && buscadorPartitura &&
                            <table className="tablaBuscarUsuarios">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                    </tr>
                                </thead>
                                {partituresFiltred?.slice(0, 10).map(p => {
                                    return (
                                        <tbody key={p.id}
                                            onClick={(e) => { e.preventDefault(); this.agregarPartitura(p); }}
                                        >
                                            <tr>
                                                <td>{p.name}</td>
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
