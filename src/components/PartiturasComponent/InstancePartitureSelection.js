import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import './FormularioEspecial.css'
import moment from 'moment'
import DeleteIcon from '@material-ui/icons/Delete';

export default class InstancePartitureSelection extends Component {

    state = {
        loading: false,
        AllPartituresModel: null,
        partitureModelSelected: null,
    }

    agregarPaso = (idInstancia) => {
        let { partitureModelSelected } = this.state;

        for (let i = 0; i < partitureModelSelected.length; i++) {
            const instance = partitureModelSelected[i];

            if (instance.id === idInstancia) {
                let td = {
                    id: new Date() * Math.random(),
                    name: "Nuevo paso " + (instance.steps.length + 1),
                    requiredMonitorings: 0
                }

                instance.steps.push(td);
            }
        }

        this.setState({
            partitureModelSelected
        })
    }

    eliminarPaso = (idInstancia, idStep) => {
        let { partitureModelSelected } = this.state;

        for (let i = 0; i < partitureModelSelected.length; i++) {
            const instance = partitureModelSelected[i];

            if (instance.id === idInstancia) {
                let c = instance.steps.findIndex(e => e.id === idStep);
                if (c && instance.steps.length > 1) {
                    instance.steps.splice(c, 1);
                } else if (instance.steps.length === 1) {
                    instance.steps = []
                }
            }
        }

        this.setState({
            partitureModelSelected
        })
    }

    eliminarInstancia = (id) => {
        let { partitureModelSelected } = this.state;

        let c = partitureModelSelected.findIndex(e => e.id === id);

        if (c && partitureModelSelected.length > 1) {
            partitureModelSelected.splice(c, 1);
        } else if (partitureModelSelected.length === 1) {
            partitureModelSelected = []
        }

        this.setState({ partitureModelSelected });

    }

    agregarInstancia = () => {
        let { partitureModelSelected } = this.state;

        let instance = {
            id: new Date() * Math.random(),
            name: 'Nuevo nombre ' + (partitureModelSelected.length + 1),
            expirationDate: "",
            steps: []
        }

        this.setState(prevState => ({
            partitureModelSelected: [...prevState.partitureModelSelected, instance]
        }))

    }

    cambiarNombreInstancia = (id, e) => {
        let { partitureModelSelected } = this.state;
        const name = e.target.value;

        for (let i = 0; i < partitureModelSelected.length; i++) {
            const instance = partitureModelSelected[i];

            if (instance.id === id) {
                instance.name = name;
            }
        }

        this.setState({
            partitureModelSelected
        })
    }

    cambiarNombrePaso = (idInstancia, idPaso, e) => {
        let { partitureModelSelected } = this.state;
        const name = e.target.value;

        for (let i = 0; i < partitureModelSelected.length; i++) {
            const instance = partitureModelSelected[i];

            if (instance.id === idInstancia) {
                for (let j = 0; j < instance.steps.length; j++) {
                    const step = instance.steps[j];

                    if (step.id === idPaso) {
                        step.name = name;
                    }
                }
            }
        }

        this.setState({
            partitureModelSelected
        })

    }

    modificarRequiredMonitorings = (idInstancia, idPaso, e) => {
        let { partitureModelSelected } = this.state;
        const name = e.target.value;

        for (let i = 0; i < partitureModelSelected.length; i++) {
            const instance = partitureModelSelected[i];

            if (instance.id === idInstancia) {
                for (let j = 0; j < instance.steps.length; j++) {
                    const step = instance.steps[j];

                    if (step.id === idPaso) {
                        step.requiredMonitorings = parseInt(name);
                    }
                }
            }
        }

        this.setState({
            partitureModelSelected
        })
    }

    modificarVencimiento = (idInstancia, e) => {
        let date = moment(e.target.value).format("MM/DD/YYYY");

        let { partitureModelSelected } = this.state;

        for (let i = 0; i < partitureModelSelected.length; i++) {
            const instance = partitureModelSelected[i];

            if (instance.id === idInstancia) {
                instance.expirationDate = date;
            }
        }

        this.setState({
            partitureModelSelected
        })
    }

    seleccionar = (event) => {
        const id = event.target.value;
        let partitureModel = this.state.AllPartituresModel.find(e => e.id === id);
        let partitureModelSelected = []

        for (let p of partitureModel.instances) {
            let tempData = {
                id: new Date() * Math.random(),
                name: p.name,
                expirationDate: '',
                steps: []
            }

            for (let st of p.steps) {
                let td = {
                    id: new Date() * Math.random(),
                    name: st.name,
                    requiredMonitorings: st.requiredMonitorings,
                }

                tempData.steps.push(td);
            }

            partitureModelSelected.push(tempData);


        }

        this.setState({
            partitureModelSelected
        })
    }


    async componentDidMount() {
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        try {
            let response = await axios.get(Global.getAllPartituresModel, { headers: { Authorization: bearer } })
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            this.setState({
                AllPartituresModel: response.data.Data,
                loading: false
            })
        } catch (e) {
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
        }
    }

    render() {
        let { loading, AllPartituresModel, partitureModelSelected } = this.state;
        return (
            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                {AllPartituresModel &&
                    <select value={this.state.value} onChange={this.seleccionar}>
                        <option value="-">Selecciona...</option>
                        {AllPartituresModel.map(partitureModel => {
                            return <option value={partitureModel.id} key={partitureModel.id}>{partitureModel.name}</option>
                        })}
                    </select>
                }
                {partitureModelSelected &&
                    <div className="partituresModels">
                        <button onClick={(e) => {
                            e.preventDefault();
                            this.agregarInstancia();
                        }}>Agregar instancia</button>
                        <div className="AllInstances">

                            {partitureModelSelected.map(instance => {
                                return (
                                    <div className="instance" key={instance.id}>
                                        <div className="mainButtons">
                                            <input type="text" value={instance.name} onChange={(e) => {
                                                this.cambiarNombreInstancia(instance.id, e);
                                            }} />
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                this.agregarPaso(instance.id);
                                            }}>Agregar paso</button>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                this.eliminarInstancia(instance.id);
                                            }}><DeleteIcon /></button>
                                            <input className="form-control" type="date" format="mm/dd/AAAA" onChange={(e) => {
                                                this.modificarVencimiento(instance.id, e)
                                            }} />
                                        </div>
                                        <div className="AllSteps">
                                            {instance.steps.map(step => {
                                                return (
                                                    <div className="step" key={step.id}>
                                                        <input type="text" defaultValue={step.name} onChange={(e) => {
                                                            this.cambiarNombrePaso(instance.id, step.id, e)
                                                        }} />
                                                        <input type="number" value={step.requiredMonitorings} onChange={(e) => {
                                                            this.modificarRequiredMonitorings(instance.id, step.id, e)
                                                        }} />

                                                        <button onClick={(e) => {
                                                            e.preventDefault();
                                                            this.eliminarPaso(instance.id, step.id);
                                                        }}><DeleteIcon /></button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })

                            }
                        </div>
                    </div>
                }

                <button className="buttonSiguiente"
                    onClick={(e) => {
                        e.preventDefault();
                        this.props.getData(partitureModelSelected);
                    }}
                >
                    Enviar
                </button>
            </>
        )
    }
}
