import React, { Component } from 'react'
import './Formulario.css'
import swal from 'sweetalert';
import axios from 'axios';
import Global from '../../../Global';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

export default class Formulario extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id: null,
            name: 'Nombre de la plantilla',
            instances: []
        }
    }

    changeStepRequiredMonitorings = (instanceId, stepId, requiredMonitorings) => {
        let { instances } = this.state;

        for (let x of instances) {
            if (x.id === instanceId) {
                for (let j of x.steps) {
                    if (j.id === stepId) {
                        j.requiredMonitorings = parseInt(requiredMonitorings);
                    }
                }
            }
        }

        this.setState({
            instances
        })
    }

    changeStepName = (instanceId, stepId, newName) => {
        let { instances } = this.state;

        for (let x of instances) {
            if (x.id === instanceId) {
                for (let j of x.steps) {
                    if (j.id === stepId) {
                        j.name = newName;
                    }
                }
            }
        }

        this.setState({
            instances
        })
    }

    eliminarStep = (instanceId, stepId) => {
        let { instances } = this.state;

        let dataReturn = [];
        for (let x of instances) {
            let tempD = x;
            if (tempD.id === instanceId) {
                let steps = [];
                for (let j of x.steps) {
                    if (j.id === stepId) continue;
                    steps.push(j);
                }
                tempD.steps = steps;
            }
            dataReturn.push(tempD);
        }

        this.setState({
            instances: dataReturn
        })
    }

    enviarPlantilla = () => {
        // Preparamos el objeto para enviar!
        const { name, instances, id } = this.state;

        if (!name || name === 'Nombre de la plantilla' || instances.length === 0) {
            swal("Error!", "Debe ingresar valores para enviarlos", "error");
            return false;
        }

        let sendData = {
            name,
            instances: []
        }

        for (let instance of instances) {
            if (instance.name.includes('Nueva instancia')) {
                swal("Error", "Debe cambiar el nombre de la instancia", "Error");
                return false;
            }
            let tempData = {
                name: instance.name,
                steps: []
            }
            for (let step of instance.steps) {
                let s = {
                    name: step.name,
                    requiredMonitorings: step.requiredMonitorings
                }
                tempData.steps.push(s);
            }
            sendData.instances.push(tempData);
        }

        let token = JSON.parse(localStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = sendData
        if (id) {
            // entonces editamos
            axios.put(Global.getPartitureModels + "/" + id, bodyParameters, config)
                .then(response => {
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    if (response.data.Success) {
                        swal("Felicidades!", "Se ha modificado la plantilla de partitura correctamente", "success");
                        window.location.reload(window.location.href);
                    }

                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        swal("Atención", "No se ha agregado el grupo", "info");
                        this.setState({
                            redirect: true
                        })
                    }
                    console.log("Error: ", e)
                })
        } else {
            axios.post(Global.getPartitureModels + "/new", bodyParameters, config)
                .then(response => {
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    if (response.data.Success) {
                        swal("Felicidades!", "Se ha creado la plantilla de partitura correctamente", "success");
                        window.location.reload(window.location.href);
                    }

                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        swal("Atención", "No se ha agregado el grupo", "info");
                        this.setState({
                            redirect: true
                        })
                    }
                    console.log("Error: ", e)
                })
        }

    }

    eliminarInstance = (id) => {
        let { instances } = this.state;

        let dataReturn = []
        for (let x of instances) {
            if (x.id === id) continue;
            dataReturn.push(x);
        }

        this.setState({
            instances: dataReturn
        })

    }

    changeInstanceName = (id, newName) => {
        let { instances } = this.state;

        for (let x of instances) {
            if (x.id === id) {
                x.name = newName;
            }
        }

        this.setState({
            instances
        })
    }

    nuevaInstancia = (instanceObject = false) => {
        let { instances } = this.state;
        let steps = [];
        if (instanceObject !== false) {
            for (let st of instanceObject.steps) {
                steps.push({
                    id: parseInt(Date.now() * Math.random()),
                    name: st.name,
                    requiredMonitorings: parseInt(st.requiredMonitorings)
                })
            }
        }
        let tempData = {
            id: parseInt(Date.now() * Math.random()),
            name: instanceObject === false ? `Nueva instancia ${instances.length + 1}` : instanceObject.name,
            steps
        }

        this.setState({
            instances: [...instances, tempData]
        })
    }

    agregarPaso = (id) => {
        let { instances } = this.state;

        for (let i of instances) {
            if (i.id === id) {
                i.steps.push({
                    id: parseInt(Date.now() * Math.random()),
                    name: `Nuevo paso ${i.steps.length + 1}`,
                    requiredMonitorings: 0
                })
            }
        }

        this.setState({ instances });
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    componentDidMount = () => {
        const { idModificate } = this.props
        if (idModificate) {

            let token = JSON.parse(localStorage.getItem('token'))
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            axios.get(Global.getPartitureModels + "/" + idModificate, config)
                .then(response => {
                    localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    const respuesta = response.data.Data[0];
                    if (respuesta) {
                        for (let i of respuesta.instances) {
                            this.nuevaInstancia(i);
                        }
                        this.setState({
                            id: idModificate,
                            name: respuesta.name
                        })
                    }
                })
                .catch(e => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token));
                        this.setState({
                            redirect: true
                        })
                    }
                    console.log("Error: ", e)
                })
        }
    }

    render() {
        let { instances } = this.state;

        return (
            <div className="modal" id="modal-casero">
                <div className="hijo">
                    <div className="btnCloseModalTres">
                        <button
                            onClick={
                                (e) => {
                                    e.preventDefault()
                                    this.cerrarModal()
                                }
                            }>x</button>
                    </div>
                    <div className="partituresModels">
                        <div className="mainButtons">
                            <input className="form-control" type="text" value={this.state.name} onChange={(e) => {
                                this.setState({ name: e.target.value })
                            }} />

                            <button className="morph" onClick={(e) => {
                                e.preventDefault();
                                this.nuevaInstancia()
                            }}><AddIcon className="svgAddButton" style={{ fontSize: 33 }} /></button>




                            <button className="addItem morph" onClick={(e) => {
                                e.preventDefault()
                                this.enviarPlantilla();
                            }}><SaveIcon className="svgAddButton" style={{ fontSize: 33 }} /></button>

                        </div>

                        {instances &&
                            <div className="AllInstances">
                                {instances.map((instance, key) => {
                                    return (
                                        <div className="instance">
                                            <div className="mainButtons">
                                                <input className="form-control" type="text" value={instance.name} onChange={(e) => {
                                                    this.changeInstanceName(instance.id, e.target.value);
                                                }} />

                                                <button onClick={(e) => {
                                                    e.preventDefault();
                                                    this.agregarPaso(instance.id)
                                                }}><AddIcon  style={{ fontSize: 25 }} /></button>
                                                {/* <button onClick={(e) => {
                                                    e.preventDefault();
                                                    this.agregarPaso(instance.id)
                                                }}>Agregar paso</button> */}



                                                <button onClick={(e) => {
                                                    e.preventDefault();
                                                    this.eliminarInstance(instance.id)
                                                }}><DeleteIcon /></button>
                                            </div>
                                            <div className="AllSteps">
                                                {instance.steps &&
                                                    instance.steps.map((step, key) => {
                                                        return (
                                                            <div key={key} className="step">
                                                                <input className="form-control" type="text" value={step.name} onChange={(e) => {
                                                                    this.changeStepName(instance.id, step.id, e.target.value);
                                                                }} />
                                                                <input className="form-control" type="number" value={step.requiredMonitorings} onChange={(e) => {
                                                                    this.changeStepRequiredMonitorings(instance.id, step.id, e.target.value);
                                                                }} />
                                                                <button onClick={(e) => {
                                                                    e.preventDefault();
                                                                    this.eliminarStep(instance.id, step.id);
                                                                }}><DeleteIcon /></button>

                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
