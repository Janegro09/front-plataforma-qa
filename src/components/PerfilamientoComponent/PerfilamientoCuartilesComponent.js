import React, { Component } from 'react'
import SideBarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios';
import Global from '../../Global';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import { Redirect } from 'react-router-dom';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import Checkbox from '@material-ui/core/Checkbox';
import { ModalPerfilamientoOnline } from './Modal/ModalPerfilamientoOnline';
import { Row } from 'react-bootstrap';

function calcular_modelo(valor_minimo, valor_maximo) {

    if(valor_minimo === undefined || valor_maximo === undefined) return false;

    this.valor_minimo = parseFloat(valor_minimo);
    this.valor_maximo = parseFloat(valor_maximo);

    this.diferencia_valores = this.valor_maximo - this.valor_minimo;

    this.abs_to_rel = (valor_absoluto) => ((parseFloat(valor_absoluto) - this.valor_minimo) / this.diferencia_valores);

    this.rel_to_abs = (valor_relativo) => ((parseFloat(valor_relativo) * this.diferencia_valores) + this.valor_minimo);

    return this;

}

export default class PerfilamientoCuartilesComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombreColumnas: null,
            result: [],
            dataFiltered: [],
            redirect: false,
            id: null,
            redirectPerfilamientos: false,
            loading: false,
            name: '',
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
        const { nombreColumnas } = this.state
        let searched = this.searched.value.toLowerCase()

        if (searched) {
            const result = nombreColumnas.filter(word => word.columnName.toLowerCase().includes(searched));
            this.setState({
                dataFiltered: result
            })
        } else {
            this.setState({
                dataFiltered: nombreColumnas
            })
        }


    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target]: target
        });
    }

    guardarModel = () => {
        let { modelSelected, result, nombreColumnas } = this.state;
        console.log(result);
        let modelName = document.getElementById('model-name').value;

        if (modelName.trim() === '') {
            swal("Atención", "No se puede enviar un nombre vacío", "info").then(() => {
                this.componentDidMount();
            })
        } else {
            //Se modifica para cuartilización agil y se puedan guardar los valores seleccionados y no seleccionados 14-04-2021
            result = result.filter(elem => elem.selected === true);

            let relativeValues = [];

            for (const row of result) {
                let relValues = new calcular_modelo(row.Q1.VMin, row.Q4.VMax);
                let aux=row;
                aux.edited=false;
                let objectToCompare = nombreColumnas.find(element => element.QName === row.QName);
                
                if(objectToCompare){
                    if(
                        (objectToCompare.Q1.VMax!=row.Q1.VMax ||
                        objectToCompare.Q2.VMax!=row.Q2.VMax ||
                        objectToCompare.Q3.VMax!=row.Q3.VMax)
                        ){
                            aux.edited=true;
                        } 
                }

                aux.Q1.VMax= relValues.abs_to_rel(row.Q1.VMax);
                aux.Q2.VMax=relValues.abs_to_rel(row.Q2.VMax);
                aux.Q3.VMax=relValues.abs_to_rel(row.Q3.VMax);
                aux.Q4.VMax=relValues.abs_to_rel(row.Q4.VMax);

                aux.Q1.VMin=relValues.abs_to_rel(row.Q1.VMin);
                aux.Q2.VMin=aux.Q1.VMax;
                aux.Q3.VMin=aux.Q2.VMax;
                aux.Q4.VMin=aux.Q3.VMax;

                relativeValues.push(aux);
            }

            console.log(relativeValues);

            relativeValues = JSON.stringify(relativeValues);
            let token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const bodyParameters = {
                name: modelName,
                values: relativeValues
            }

            if (Object.keys(modelSelected).length > 0) {
                axios.put(Global.newModel + '/' + modelSelected._id, bodyParameters, config)
                    .then(response => {
                        localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                        if (response.data.Success) {
                            swal("Felicidades!", "Se ha modificado el modelo correctamente", "success").then(() => {
                                this.componentDidMount();
                            })
                        }

                    })
                    .catch(e => {
                        if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                            HELPER_FUNCTIONS.logout()
                        } else {
                            localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                            swal("Atención", "No se ha creado el modelo", "info");
                            this.setState({
                                redirect: true
                            })
                        }
                        console.log("Error: ", e)
                    })
            } else {
                axios.post(Global.newModel, bodyParameters, config)
                    .then(response => {
                        localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                        if (response.data.Success) {
                            swal("Felicidades!", "Se ha creado el modelo correctamente", "success").then(() => {
                                this.componentDidMount();
                            })
                        }

                    })
                    .catch(e => {
                        if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                            HELPER_FUNCTIONS.logout()
                        } else {
                            localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                            swal("Atención", "No se ha creado el modelo", "info");
                            this.setState({
                                redirect: true
                            })
                        }
                        console.log("Error: ", e)
                    })
            }


        }

    }

    selectModels = (e) => {
        let { modelSelected, modelsOfCuartiles, result } = this.state;
        let idModelSelected = e.target.value;
        
        
        if (idModelSelected.trim()) {
            modelSelected = modelsOfCuartiles.find(element => element._id === idModelSelected);
            if (modelSelected) {
                let model = JSON.parse(modelSelected.values);
                for(let r = 0; r < result.length; r++){
                    let relValues = new calcular_modelo(result[r].Q1.VMin, result[r].Q4.VMax);
                    let f = model.find(elem => elem.QName === result[r].QName);
                    if(f) {
                        // result[r] = f;
                        result[r].Q1.VMax = relValues.rel_to_abs(f.Q1.VMax);
                        result[r].Q2.VMax = relValues.rel_to_abs(f.Q2.VMax);
                        result[r].Q3.VMax = relValues.rel_to_abs(f.Q3.VMax);

                        result[r].Q2.VMin = relValues.rel_to_abs(f.Q2.VMin);
                        result[r].Q3.VMin = relValues.rel_to_abs(f.Q3.VMin);
                        result[r].Q4.VMin = relValues.rel_to_abs(f.Q4.VMin);

                        result[r].selected = true;
                        console.log(result[r]);
                    } else {
                        result[r].selected = false;
                    }
                }


                this.setState({
                    result,
                    modelSelected,
                    nameModelSelected: modelSelected.name
                })
            }
        } else {

            for(let r = 0; r < result.length; r++){
                result[r].selected = false;
            }

            this.setState({
                result,
                modelSelected: {},
                nameModelSelected: ''
            })
        }

    }

    enviar = (e) => {
        e.preventDefault();
        const { id, result } = this.state;

        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // PARAMETROS REQUERIDOS, SOLO PASSWORD
        const bodyParameters = result.filter(e => e.selected === true);

        axios.post(Global.reasignProgram + '/' + id + '/cuartiles', bodyParameters, config)
            .then(response => {
                localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
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
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
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
        this.setState({ id, loading: true });
        this.setState({
            idOnline:id
        })

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        axios.get(Global.reasignProgram + '/' + id + '/columns', { headers: { Authorization: bearer } }).then(response => {
            const { Data: nombreColumnas  } = response.data; 

            let token2 = response.data.loggedUser.token
            axios.get(Global.reasignProgram + '/' + id + '/cuartiles', { headers: { Authorization: `Bearer ${token2}` } }).then(response => {
                let token3 = response.data.loggedUser.token
                let result = [];

                let { cuartiles } = response.data.Data;
                for(let c of nombreColumnas) {
                    let temp = {
                        QName: c.columnName,
                        Qorder: "DESC",
                        selected: false,
                        Q1: c.DefaultValues.Q1,
                        Q2: c.DefaultValues.Q2,
                        Q3: c.DefaultValues.Q3,
                        Q4: c.DefaultValues.Q4
                    }
                    let find = cuartiles.find(elem => elem.name === temp.QName);
                    if(find) {
                        temp.Qorder     = find.order;
                        temp.Q1         = find.Q1
                        temp.Q2         = find.Q2
                        temp.Q3         = find.Q3
                        temp.Q4         = find.Q4
                        temp.selected   = true;
                    }
                    
                    result.push(temp);
                }




                axios.get(Global.newModel, { headers: { Authorization: `Bearer ${token3}` } }).then(response => {
                    localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                    this.setState({
                        nombreColumnas,
                        dataFiltered: nombreColumnas,
                        result,
                        loading: false,
                        modelsOfCuartiles: response.data.Data || [],
                    })
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

    get_media = async (media_object) => {
        if(!media_object) return;
        const { id } = this.state;

        this.setState({ loading: true });
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        try{
            let response = await axios.post(Global.reasignProgram + '/' + id + '/mediana', media_object ,{ headers: { Authorization: bearer } });
            this.setState({ loading: false });
            return response.data.Data || false;
        } catch(e) {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                // swal("Error!", "Hubo un problema", "error");
                swal("Error!", `${e.response.data.Message}`, "error");
            }
            console.log("Error: ", e)
        }   
    }

    selectRow = async(e) => {
        e.preventDefault();
        const { id } = e.target;
        let { result } = this.state;

        let index = result.findIndex(elem => elem.QName === id);
        if(index !== -1) {
            result[index].selected = !result[index].selected;
        } else return false;

        if(result[index].selected) {
            // Enviamos el objeto para traer la media
            const media = await this.get_media(result[index]);
            if(media !== false && media.Q2 !== undefined) {
                result[index].Q2 = media.Q2;
            }
        }
        this.setState({ result })
    }

    changeValues = e => {
        const  { dataset, value, name } = e.target;
        const { id } = dataset;
        let { result } = this.state;
        
        let index = result.findIndex(elem => elem.QName === id);
        if(value !== undefined && index !== -1) {
            switch(name) {
                case "VMin": 
                    result[index].Q1.VMax = (value);
                    result[index].cuartilEditado = true;
                break;
                case "VMax": 
                    result[index].Q3.VMax = (value);
                    result[index].cuartilEditado = true;
                break;
                default:
                    result[index][name] = value
            }
            this.setState({ result });
            console.log(result[index])
        } else return false;

    }

    guardarValores = (valoresModal) => {
        if(valoresModal){
            valoresModal.cuartilEditado=true;
            this.setState({
                cuartilamientoOnline:valoresModal
            })
        }
    }

    render() {

        const { nombreColumnas, dataFiltered, redirect, result, id, redirectPerfilamientos, loading, modelsOfCuartiles, nameModelSelected } = this.state;
        let { nameCuartilSelected } = this.props.location;

        if (redirect) {
            return <Redirect to="/perfilamiento" />
        }

        if (redirectPerfilamientos) {
            return <Redirect
                to={{
                    pathname: '/perfilamiento/perfilamientos',
                    cuartilSeleccionado: id,
                    nameCuartilSelected: nameCuartilSelected
                }} />
        }

        return (
            <div>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                <SideBarLeft />

                <div className="section-content">
                <h4>CUARTILES</h4>
                    <hr />
                    <br />
                    <div className="alert alert-secondary">{nameCuartilSelected}</div>
                    <div className="flexAlign">
                    {nameCuartilSelected &&
                        <>
                            {modelsOfCuartiles &&
                                <select className="contextoSelect" onChange={this.selectModels}>
                                    <option value="">Selecciona...</option>
                                    {modelsOfCuartiles.map(cuartil => {
                                        return (
                                            <option value={cuartil._id} key={cuartil._id}>
                                                {cuartil.name}
                                            </option>
                                        )
                                    })
                                    }
                                </select>
                            }
                            <input className="form-control" id="model-name" type="text" placeholder="Nombre del modelo" defaultValue={nameModelSelected} />
                            <button
                                className="guardarSecundario"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        this.guardarModel();
                                    }
                                }
                            >
                                Guardar modelo
                            </button>
                            
                            <br></br>
                           
                        </>
                    }</div>
                    <button onClick={this.enviar} className="buttonSiguiente">Guardar</button>
                    <button onClick={(e) => {
                        e.preventDefault();
                        this.perfilamientos()
                    }} className="buttonSiguiente perfilamientos"> <RecentActorsIcon /> Perfilamientos</button>
                    <input className="form-control flex-input-add" type="text" placeholder="Buscar" ref={(c) => this.searched = c} onChange={this.buscar} />
                    {nombreColumnas &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Rango [MIN-MAX]</th>
                                    <th>Orden</th>
                                    <th>Objetivo VMin</th>
                                    <th>Objetivo VMax</th>
                                    <th className="tableIcons">Seleccionar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataFiltered.map(columna => {
                                        const { idOnline } = this.state;
                                        let def;
                                        // if(cuartilamientoOnline){
                                        //     def=cuartilamientoOnline;
                                        // } else {
                                        //     def = result.find(e => e.QName === columna.columnName);
                                            
                                        // }
                                        def = result.find(e => e.QName === columna.columnName);
                                        def.codigo = idOnline;
                                        return (
                                            <tr key={columna.columnName}>
                                                <td>{columna.columnName}</td>
                                                <td>{`[${columna.VMin} - ${columna.VMax}]`}</td>
                                                <td>
                                                    <select
                                                        className="selectOrden"
                                                        data-id={columna.columnName}
                                                        onChange={this.changeValues}
                                                        name="Qorder"
                                                        disabled={def.selected}
                                                        value={def.Qorder}
                                                        >
                                                        <option value="DESC">DESC</option>
                                                        <option value="ASC">ASC</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input className="form-control"
                                                        data-id={columna.columnName}
                                                        name="VMin"
                                                        type="text"
                                                        placeholder="VMin"
                                                        onChange={this.changeValues}
                                                        value={def.Q1.VMax}
                                                        disabled={def.selected}
                                                    />
                                                </td>

                                                <td>
                                                    <input className="form-control"
                                                        data-id={columna.columnName}
                                                        name="VMax"
                                                        type="text"
                                                        placeholder="VMax"
                                                        onChange={this.changeValues}
                                                        value={def.Q3.VMax}
                                                        disabled={def.selected}
                                                    />
                                                </td>

                                                <td>
                                                    <Checkbox
                                                        checked={def.selected}
                                                        id={columna.columnName}
                                                        onChange={this.selectRow}
                                                    />{
                                                        def.selected &&
                                                        (def.Q1.VMax !=  def.Q4.VMax) &&
                                                        <ModalPerfilamientoOnline
                                                        key={columna.columnName}
                                                        guardar={
                                                                this.guardarValores
                                                            }
                                                        valor={def}
                                                        />
                                                    }

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
