import React, { Component } from 'react'
import SideBarLeft from '../../SidebarLeft/SiderbarLeft'
import axios from 'axios';
import Global from '../../../Global';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';


export default class ModeloCuartilesComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombreColumnas: null,
            result: [],
            dataFiltered: [],
            id: null,
            loading: false,
            values: '',
            modelsOfCuartiles: [],
            modelSelected: {},
            nameModelSelected: '',
            used: [],
            idOnline:22,
            cuartilamientoOnline:false
        }
    }

    buscar = () => {
        const { result } = this.state
        let searched = this.searched.value.toLowerCase()
        if (searched) {
            const searchResults = result.filter(word => word.QName.toLowerCase().includes(searched));
            this.setState({
                dataFiltered: searchResults
            })
        } else {
            let dataFiltered = result.filter(el => el.selected === true);
            this.setState({
                dataFiltered
            })
        }

    }


    enviar = (e) => {
        e.preventDefault();
        const { id, result, nameModelSelected } = this.state;
        
        let modelSend = {
            name: nameModelSelected,
            values: JSON.stringify(result)
        }

        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // PARAMETROS REQUERIDOS, SOLO PASSWORD

        axios.put(Global.newModel + '/' + id, modelSend, config)
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                if (response.data.Success) {
                    swal("¡Felicidades!", "¡Modelo de Cuartiles modificado!", "success").then(() => {
                        window.location.reload(window.location.href);
                    })
                } else {
                    swal("Error!", "Hubo un error al modificar el modelo de cuartiles", "error");
                }

            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención", "No has cambiado nada", "info");
                }
                console.log("Error: ", e)
            })
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({ id, loading: true });

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        axios.get(Global.newModel, { headers: { Authorization: bearer } }).then(response => {
            const { Data: modelos  } = response.data; 

            let result = [];
            let nameModelSelected = '';
            let dataFiltered = [];
            
            let modelSelected = modelos.find(element => element._id === id);
            if (modelSelected) { 
                nameModelSelected = modelSelected.name;
                let model = JSON.parse(modelSelected.values);
                result = model;
            }     
            dataFiltered = result.filter(element => element.selected === true);

            this.setState({
                nameModelSelected,
                dataFiltered,
                result,
                loading: false,
            }); 
        }).catch((e) => {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                // swal("Error!", "Hubo un problema", "error");
                swal("Error!", `${e.response.data.Message}`, "error");
            }
            console.log("Error: ", e)
        });
    }

    selectRow = async(e) => {
        e.preventDefault();
        const { id, name } = e.target;
        let { result } = this.state;
        let index = result.findIndex(elem => elem.QName === id);
        if(index !== -1) {
            if(name === 'edited'){
                result[index].edited = !result[index].edited;
            } else {
                result[index].selected = !result[index].selected;
            }
        } else return false;

        this.setState({ result })
    }

    deleteRow = (id) => {
        let { result } = this.state;
        let index = result.findIndex(elem => elem.QName === id);
        if(index !== -1) {
            result.splice(index, 1);
        } else return false;

        this.setState({ result })
    }

    changeValues = e => {
        const  { dataset, value, name } = e.target;
        const { id } = dataset;
        let { result } = this.state;
        
        let index = result.findIndex(elem => elem.QName === id);
        if(value !== undefined && index !== -1) {
            switch(name) {
                case "Q1VMax": 
                    result[index].Q1.VMax = (value)
                break;
                case "Q2VMax": 
                    result[index].Q2.VMax = (value);
                break;
                case "Q3VMin": 
                    result[index].Q3.VMax = (value)
                break;
                default:
                    result[index][name] = value
            }
            this.setState({ result });
        } else return false;

    }

    render() {

        const { dataFiltered, loading, nameModelSelected } = this.state;

        return (
            <div>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                <SideBarLeft />

                <div className="section-content">
                <h4>MODELO DE CUARTILES</h4>
                    <hr />
                    <br />
                    <div className="alert alert-secondary">{nameModelSelected}</div>
                   
                    <button onClick={this.enviar} className="buttonSiguiente">Guardar</button>
                    <input className="form-control flex-input-add" type="text" placeholder="Buscar" ref={(c) => this.searched = c} onChange={this.buscar} />
                    {dataFiltered &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Orden</th>
                                    <th>Q1 VMax</th>
                                    <th>Q2 VMax</th>
                                    <th>Q3 VMax</th>
                                    <th className="tableIcons">Cuartilizar Automáticamente</th>
                                    <th className="tableIcons">Seleccionar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataFiltered.map(columna => {
                                        return (
                                            <tr key={columna.QName}>
                                                <td>{columna.QName}</td>
                                                <td>
                                                    <select
                                                        className="selectOrden"
                                                        data-id={columna.QName}
                                                        onChange={this.changeValues}
                                                        name="Qorder"
                                                        value={columna.Qorder}
                                                        >
                                                        <option value="DESC">DESC</option>
                                                        <option value="ASC">ASC</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input className="form-control"
                                                        data-id={columna.QName}
                                                        name="Q1VMax"
                                                        type="text"
                                                        placeholder="Q1VMin"
                                                        onChange={this.changeValues}
                                                        value={columna.Q1.VMax}
                                                    />
                                                </td>

                                                <td>
                                                    <input className="form-control"
                                                        data-id={columna.QName}
                                                        name="Q2VMax"
                                                        type="text"
                                                        placeholder="Q2VMax"
                                                        onChange={this.changeValues}
                                                        value={columna.Q2.VMax}
                                                    />
                                                </td>

                                                <td>
                                                    <input className="form-control"
                                                        data-id={columna.QName}
                                                        name="Q3VMax"
                                                        type="text"
                                                        placeholder="Q3VMax"
                                                        onChange={this.changeValues}
                                                        value={columna.Q3.VMax}
                                                    />
                                                </td>

                                                <td>
                                                    <Checkbox
                                                        name="edited"
                                                        checked={!columna.edited}
                                                        id={columna.QName}
                                                        onChange={this.selectRow}
                                                    /> 
                                                    {/*<button onClick={(e) => {
                                                        e.preventDefault();
                                                        this.deleteRow(columna.QName);
                                                    }} className="celdaBtnHover"> <DeleteIcon style={{ fontSize: 15 }} /> </button>*/}
                                                </td>
                                                <td>
                                                    <Checkbox
                                                        name="selected"
                                                        checked={columna.selected}
                                                        id={columna.QName}
                                                        onChange={this.selectRow}
                                                    /> 
                                                </td>
                                            </tr>
                                        )
                                })}
                            </tbody>
                        </table>
                    }
                </div>

            </div>
        )
    }
}
