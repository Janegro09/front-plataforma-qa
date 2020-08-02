import React, { Component } from 'react'
import SideBarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios';
import Global from '../../Global';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import { Redirect } from 'react-router-dom';
import RecentActorsIcon from '@material-ui/icons/RecentActors';


export default class PerfilamientoCuartilesComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombreColumnas: null,
            result: [],
            dataFiltered: null,
            redirect: false,
            id: null,
            redirectPerfilamientos: false,
            loading: false
        }
    }

    buscar = () => {
        const { nombreColumnas } = this.state
        let searched = this.searched.value.toLowerCase()
        const result = nombreColumnas.filter(word => word.columnName.toLowerCase().includes(searched));

        this.setState({
            dataFiltered: result
        })
    }

    seleccionarFila = (fila, orden, obj = {}) => {
        let { result } = this.state;

        let temp = {
            "QName": fila.columnName,
            "Qorder": orden,
            "Q1": {
                "VMin": fila.VMin
            },
            "Q4": {
                "VMax": fila.VMax
            }
        }

        if (obj.VMax && obj.VMin) {
            if (obj.VMax < fila.VMax && obj.VMax > obj.VMin) {
                temp.Q3 = {
                    VMax: obj.VMax
                };
            }

            if (obj.VMin > fila.VMin && obj.VMin < obj.VMax && temp.Q3) {
                temp.Q1.VMax = obj.VMin;
            }

            if (temp.Q3 && temp.Q1.VMax) {
                temp.Q2 = {
                    VMax: (temp.Q3.VMax - temp.Q1.VMax) / 2
                }
            }
        }

        let indice = -1
        for (let i = 0; i < result.length; i++) {
            if (result[i].QName === fila.columnName) {
                indice = i;
                break;
            }
        }

        if (indice === -1) {
            this.setState({
                result: [...result, temp]
            })
        } else {
            result.splice(indice, 1);
            this.setState({
                result
            })
        }

    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target]: target
        });
    }

    enviar = (e) => {
        e.preventDefault();
        const { id, result } = this.state;

        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // PARAMETROS REQUERIDOS, SOLO PASSWORD
        const bodyParameters = result

        axios.post(Global.reasignProgram + '/' + id + '/cuartiles', bodyParameters, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                if (response.data.Success) {
                    swal("Felicidades!", "Cuartiles modificados!", "success").then(() => {
                        window.location.reload(window.location.href);
                    })
                } else {
                    swal("Error!", "Hubo un error al modificar cuartiles!", "error");
                }

            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No has cambiado nada", "info");
                }
                console.log("Error: ", e)
            })
    }

    perfilamientos = () => {
        this.setState({
            redirectPerfilamientos: true
        })
    }

    componentDidMount() {
        const { cuartilSeleccionado } = this.props.location;
        if (cuartilSeleccionado === undefined) {
            this.setState({
                redirect: true
            })
            return;
        }
        let id = cuartilSeleccionado;
        this.setState({ id, loading: true })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        axios.get(Global.reasignProgram + '/' + id + '/columns', { headers: { Authorization: bearer } }).then(response => {
            // sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            const { Data } = response.data;
            this.setState({ nombreColumnas: Data, dataFiltered: Data });
            let token2 = response.data.loggedUser.token
            axios.get(Global.reasignProgram + '/' + id + '/cuartiles', { headers: { Authorization: `Bearer ${token2}` } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                let final = [];
                let result = response.data.Data.cuartiles
                for (let index = 0; index < result.length; index++) {
                    let element = result[index];
                    let temp = {
                        "QName": element.name,
                        "Qorder": element.order,
                        "Q1": {
                            "VMin": element.Q1.VMin,
                            "VMax": element.Q1.VMax
                        },
                        "Q2": {
                            "VMax": element.Q2.VMax
                        },
                        "Q3": {
                            "VMax": element.Q3.VMax
                        },
                        "Q4": {
                            "VMax": element.Q4.VMax
                        }
                    }
                    final.push(temp)
                }
                this.setState({
                    result: final,
                    loading: false
                })
            })
        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }


    render() {

        const { nombreColumnas, dataFiltered, redirect, result, id, redirectPerfilamientos, loading } = this.state;

        if (redirect) {
            return <Redirect to="/perfilamiento" />
        }

        if (redirectPerfilamientos) {
            return <Redirect
                to={{
                    pathname: '/perfilamiento/perfilamientos',
                    cuartilSeleccionado: id
                }} />
        }


        return (
            <div>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                <SideBarLeft />

                <div className="section-content">
                    <button onClick={this.enviar} className="buttonSiguiente">Guardar</button>
                    <button onClick={(e) => {
                        e.preventDefault();
                        this.perfilamientos()
                    }} className="buttonSiguiente perfilamientos"> <RecentActorsIcon /> Perfilamientos</button>
                    <input className="form-control" type="text" placeholder="Buscar" ref={(c) => this.searched = c} onChange={this.buscar} />
                    {nombreColumnas &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Rango [MIN-MAX]</th>
                                    <th>Orden</th>
                                    <th>Objetivo VMin</th>
                                    <th>Objetivo VMax</th>
                                    <th>Seleccionar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataFiltered.map((columna, key) => {
                                    let orden = 'DESC';
                                    let obj = {

                                    }

                                    if (columna.VMax !== 0) {
                                        let exists = '';
                                        result.map(v => {
                                            if (v.QName === columna.columnName) {
                                                orden = v.Qorder
                                                exists = v
                                            }

                                            return true;
                                        })

                                        return (
                                            <tr key={key}>
                                                <td>{columna.columnName}</td>
                                                <td>{`[${columna.VMin} - ${columna.VMax}]`}</td>
                                                <td>
                                                    <select
                                                        id={key}
                                                        onChange={
                                                            (e) => {
                                                                e.preventDefault();
                                                                let element = document.getElementById(key);
                                                                orden = element.value;
                                                            }
                                                        }
                                                        disabled={exists !== ''}
                                                    // defaultValue={exists.Qorder ? 'ASC' : 'DESC'}
                                                    >
                                                        <option value="DESC">DESC</option>
                                                        <option value="ASC" selected={exists.Qorder && exists.Qorder === 'ASC'}>ASC</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input className="form-control"
                                                        id={"VMin" + key}
                                                        type="text"
                                                        placeholder="VMin"
                                                        onChange={(e) => {
                                                            e.preventDefault()
                                                            let element = document.getElementById("VMin" + key);
                                                            obj.VMin = parseFloat(element.value)
                                                        }}
                                                        defaultValue={exists !== '' ? exists.Q1.VMax : ''}
                                                        disabled={exists !== ''}
                                                    />
                                                </td>

                                                <td>
                                                    {exists.Q3 &&

                                                        <input className="form-control"
                                                            id={"VMax" + key}
                                                            type="text"
                                                            placeholder="VMax"
                                                            onChange={(e) => {
                                                                e.preventDefault()
                                                                let element = document.getElementById("VMax" + key);
                                                                obj.VMax = parseFloat(element.value)
                                                            }}
                                                            defaultValue={exists !== '' ? exists.Q3.VMax : ''}
                                                            disabled={exists !== ''}
                                                        />
                                                    }
                                                    {exists.Q3 === undefined &&

                                                        <input className="form-control"
                                                            id={"VMax" + key}
                                                            type="text"
                                                            placeholder="VMax"
                                                            onChange={(e) => {
                                                                e.preventDefault()
                                                                let element = document.getElementById("VMax" + key);
                                                                obj.VMax = parseFloat(element.value)
                                                            }}
                                                            disabled={exists !== ''}
                                                        />
                                                    }
                                                </td>

                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={exists !== ''}
                                                        onChange={() => {
                                                            if (document.getElementById(key).disabled) {
                                                                document.getElementById("VMin" + key).disabled = false;
                                                                document.getElementById("VMax" + key).disabled = false;
                                                                document.getElementById(key).disabled = false;
                                                            } else {
                                                                document.getElementById("VMin" + key).disabled = true;
                                                                document.getElementById("VMax" + key).disabled = true;
                                                                document.getElementById(key).disabled = true;
                                                            }
                                                            this.seleccionarFila(columna, orden, obj);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    } else {
                                        return true;
                                    }
                                })}
                            </tbody>
                        </table>
                    }
                </div>

            </div>
        )
    }
}
