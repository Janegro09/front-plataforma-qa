import React, { Component } from 'react'
import './Formulario.css'

export default class Formulario extends Component {


    constructor(props) {
        super(props);
        this.state = {
            name: null,
            instances: []
        }
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
                    <div>
                        <input type="text" placeholder="Nombre de la planilla" onChange={(e) => {
                            this.setState({ name: e.target.value })
                        }} />
                        <button onClick={(e) => {
                            e.preventDefault();
                            this.nuevaInstancia()
                        }}>Nueva instancia</button>

                        {instances &&
                            <div>
                                {instances.map((instance, key) => {
                                    return (
                                        <div>
                                            <input type="text" value={instance.name} />
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                this.agregarPaso(instance.id)
                                            }}>Agregar paso</button>
                                            <button>Eliminar instancia</button>
                                            <div>
                                                {instance.steps &&
                                                    instance.steps.map(step => {
                                                        return (
                                                            <h1>{step.name}</h1>
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
