import React, { Component } from 'react'
import './Formulario.css'

export default class Formulario extends Component {


    constructor(props) {
        super(props);
        this.state = {
            name: 'Nombre de la plantilla',
            instances: []
        }
    }

    changeStepName = (instanceId, stepId, newName) => {
        let { instances } = this.state;

        for(let x of instances){
            if(x.id === instanceId){
                for(let j of x.steps){
                    if(j.id === stepId){
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
        for(let x of instances) {
            let tempD = x;
            if(tempD.id === instanceId){
                let steps = [];
                for(let j of x.steps){
                    if(j.id === stepId) continue;
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

    eliminarInstance = (id) => {
        let { instances } = this.state;

        let dataReturn = []
        for(let x of instances){
            if(x.id === id) continue;
            dataReturn.push(x);
        }

        this.setState({
            instances: dataReturn
        })
        
    }

    changeInstanceName = (id, newName) => {
        let { instances } = this.state;

        for(let x of instances){
            if(x.id === id){
                x.name = newName;
            }
        }

        this.setState({
            instances
        })
    }

    nuevaInstancia = () => {
        let { instances } = this.state;
        let tempData = {
            id: parseInt(Date.now() * Math.random()),
            name: `Nueva instancia ${instances.length + 1}`,
            steps: []
        }

        this.setState({
            instances: [...instances, tempData]
        })
    }

    agregarPaso = (id) => {
        console.log(id);
        let { instances } = this.state;
        // let instanciasReturn = [];
        // let selected = instances.find(element => element.id === id);

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

    render() {
        let { name, instances } = this.state;

        console.log("Name: ", name);
        console.log("Instances: ", instances);
        return (
            <div className="modal" id="modal-casero">
                <div className="hijo">
                    <div className="boton-cerrar">
                        <button onClick={
                            (e) => {
                                e.preventDefault()
                                this.cerrarModal()
                            }
                        }>x</button>
                    </div>
                    <div className="partituresModels">
                        <div className="mainButtons">
                            <input type="text" value={this.state.name} onChange={(e) => {
                                this.setState({ name: e.target.value })
                            }} />
                            <button onClick={(e) => {
                                e.preventDefault();
                                this.nuevaInstancia()
                            }}>Nueva instancia</button>
                            <button>Guardar Plantilla</button>

                        </div>

                        {instances &&
                            <div className="AllInstances">
                                {instances.map((instance, key) => {
                                    return (
                                        <div className="instance">
                                            <div className="mainButtons">
                                                <input type="text" value={instance.name} onChange={(e) => {
                                                    this.changeInstanceName(instance.id, e.target.value);
                                                }}/>
                                                <button onClick={(e) => {
                                                    e.preventDefault();
                                                    this.agregarPaso(instance.id)
                                                }}>Agregar paso</button>
                                                <button onClick={(e) => {
                                                    e.preventDefault();
                                                    this.eliminarInstance(instance.id)
                                                }}>Eliminar instancia</button>
                                            </div>
                                            <div className="AllSteps">
                                                {instance.steps &&
                                                    instance.steps.map((step, key) => {
                                                        return (
                                                            <div key={key} className="step">
                                                                <input type="text" value={step.name} onChange={(e) => {
                                                                    this.changeStepName(instance.id, step.id, e.target.value);
                                                                }} />
                                                                <button onClick={(e) => {
                                                                    e.preventDefault();
                                                                    this.eliminarStep(instance.id, step.id);
                                                                }}>Eliminar paso</button>

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
