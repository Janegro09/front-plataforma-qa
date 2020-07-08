import React, { Component } from 'react'
import SideBarLeft from '../SidebarLeft/SiderbarLeft'
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import axios from 'axios';
import Global from '../../Global'
import './PerfilamientosComponent.css'

export default class PerfilaminetosComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allUsers: [],
            cuartiles: [],
            grupos: []
        }
    }

    onDrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('data');
        console.log(data);
    }

    onDragStart = (e) => {
        // Buscar los usuarios segun ese cuartil
        e.dataTransfer.setData('data', e.target.id)
        // const { cuartiles } = this.state;

        // id = id.split('|');
        // let QName = id[0];
        // let level = id[1];

        // cuartiles.map(v => {
        //     if(v.name === QName){
        //         let users = v.users[level];
        //         e.dataTransfer.setData('users',users);
        //         e.dataTransfer.setData('name',id);
        //     }
        //     return true;
        // })

    }
    eliminarGrupo = (name) => {
        // Eliminamos el grupo del array
        const grupos = this.state;
        let returnData = []

        for(let i = 0; i < grupos.length; i++){
            const g = grupos[i];

            if(g.name !== name) {
                returnData.push(g)
            }
        }

        this.setState({
            grupos: returnData
        })
    }

    agregarGrupo = (e) => {
        const { grupos } = this.state
        e.preventDefault();
        let tempGroup = {
            order: 0,
            name: `Nuevo grupo ${grupos.length + 1}`,
            applyAllUsers: false,
            cluster: "",
            users: [],
            cuartiles: []
        }

        this.setState({
            grupos: [...grupos, tempGroup]
        })
    }

    changeName = (oldName) => {
        const newName = this.name.value
        const {grupos} = this.state
        let dataReturn = []
        // Buscamos el array a modificar
        grupos.map(v => {
            let tempData = v;
            if(v.name === oldName){
                tempData.name = newName
            }
            dataReturn.push(tempData)
        })

        this.setState({
            grupos: dataReturn
        })
    }

    componentDidMount() {
        console.log("Componente lanzado!");
        const { cuartilSeleccionado } = this.props.location;
        let id = cuartilSeleccionado.id;


        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllFiles + '/' + id + '/cuartiles?getUsers=true', { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let respuesta = response.data.Data

            const allUsers = respuesta.usuariosTotal
            const cuartiles = respuesta.cuartiles;
            this.setState({
                allUsers,
                cuartiles
            })
            console.log("LA RESPONSE: ", respuesta);
            // let win = window.open(Global.download + '/' + respuesta.idTemp, '_blank');
            // win.focus();

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
        let { cuartiles, grupos } = this.state;
        return (
            <div>
                <SideBarLeft />

                <div className="section-content">
                    <div className="headerResultados">
                        <p>Usuarios sin asignar: 100 - 100%</p>
                        <span>
                            <button>Cuartiles</button>
                            <button>Modificar</button>
                            <button onClick={this.agregarGrupo}>Agregar grupo</button>
                        </span>
                    </div>

                    <div className="grupos">
                        {/*  */}
                        {grupos &&
                            grupos.map((v, key) => {
                                return (
                                    <div className="grupoPerfilamiento" key={key} id={`grupo_${key}`}>
                                        <div className="acciones">
                                            <input type="text" defaultValue={v.name} onChange={(e) => this.changeName(v.name)} ref={e => this.name = e}/>
                                            <label>Aplicar al 100% de los usuarios.
                                                <input type="checkbox" id="aplicarall" defaultChecked={v.applyAllUsers}/>
                                            </label>
                                            <select>
                                                <option>Seleccionar...</option>
                                            </select>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                this.eliminarGrupo(v.name)
                                            }}>Eliminar</button>
                                        </div>
                                        <div className="cuartilesAsignados" onDrop={this.onDrop} onDragOver={(e) => e.preventDefault()}>
                                            {/* <span className="green">
                                                <p>Cuartil 1 - Q1</p>
                                                <button>x</button>
                                            </span> */}
                                        </div>
                                    </div>
                                )
                            })

                        }
                    </div>

                    <div className="cuartiles">
                        {/* Cuartil */}
                        {cuartiles &&
                            cuartiles.map((v, key) => {
                                return (
                                    <div key={key} className="cuartil">
                                        <h5>{v.name}</h5>
                                        <div className="buttonsContain">
                                            <button id={`${v.name}|Q1`} className="green" draggable onDragStart={this.onDragStart}>Q1</button>
                                            <button id={`${v.name}|Q2`} className="yellow" draggable onDragStart={this.onDragStart}>Q2</button>
                                            <button id={`${v.name}|Q3`} className="orange" draggable onDragStart={this.onDragStart}>Q3</button>
                                            <button id={`${v.name}|Q4`} className="red" draggable onDragStart={this.onDragStart}>Q4</button>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </div>
        )
    }
}
