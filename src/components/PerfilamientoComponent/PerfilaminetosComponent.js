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
            assignedUsers: [],
            cuartiles: [],
            grupos: []
        }
    }

    onDrop = (e, groupName) => {
        e.preventDefault();
        let data = e.dataTransfer.getData('data');
        if (data && groupName) {
            let { cuartiles, assignedUsers, grupos } = this.state;
            data = data.split('|');
            let QName = data[0];
            let level = data[1];
            cuartiles.map(v => {
                if (v.name === QName) {
                    let users = v.users[level];
                    let usersToAssign = [];

                    // validar si existe el grupo asignado
                    let exists = false;
                    let assignedToAllUsers;
                    grupos.map(value => {
                        if (value.name === groupName) {
                            assignedToAllUsers = value.applyAllUsers;
                            value.cuartiles.map(c => {
                                if (c.name === QName && c.level === level) {
                                    exists = true;
                                }
                            })
                        }
                    })

                    if (!exists) {
                        for (let u = 0; u < users.length; u++) {
                            const us = users[u];
                            if (assignedUsers.includes(us) && !assignedToAllUsers) continue;
                            usersToAssign.push(us)

                        }

                        let gruposReturn = [];
                        grupos.map(d => {
                            let tempData = d;
                            if (tempData.name === groupName) {
                                tempData.users = tempData.users.concat(usersToAssign);

                                tempData.cuartiles = [...tempData.cuartiles, {
                                    name: QName,
                                    level,
                                    usersToAssign
                                }]
                            }
                            gruposReturn.push(tempData);

                        })

                        if (assignedToAllUsers) {
                            this.setState({
                                grupos: gruposReturn
                            })
                        } else {
                            this.setState({
                                grupos: gruposReturn,
                                assignedUsers: assignedUsers.concat(usersToAssign)
                            })
                        }
                    }
                }
                return true;
            })
        }
    }

    onDragStart = (e) => {
        // Buscar los usuarios segun ese cuartil
        e.dataTransfer.setData('data', e.target.id)

    }

    eliminarGrupo = (name) => {
        // Eliminamos el grupo del array
        let { grupos, assignedUsers } = this.state;
        let returnData = []
        for (let i = 0; i < grupos.length; i++) {
            const g = grupos[i];

            if (g.name !== name) {
                returnData.push(grupos[i])
            } else {
                grupos[i].users.map(g => {
                    assignedUsers.splice(assignedUsers.indexOf(g), 1)
                })
                // console.log("g: ", grupos[i])
            }
        }

        this.setState({
            grupos: returnData,
            assignedUsers
        })
    }

    eliminarCuartil = (nameGroup, nameCuartil, levelCuartil) => {
        let { grupos, assignedUsers } = this.state
        let gruposReturn = []
        grupos.forEach(g => {
            let temp = g
            if (g.name === nameGroup) {
                let cuartiles = g.cuartiles;
                let cuartilesReturn = []

                cuartiles.forEach(c => {
                    if (c.name === nameCuartil && c.level === levelCuartil) {
                        c.usersToAssign.forEach(u => {
                            assignedUsers.splice(assignedUsers.indexOf(u), 1)
                            g.users.splice(g.users.indexOf(u), 1)
                        })
                    } else {
                        cuartilesReturn.push(c)
                    }

                })

                temp.cuartiles = cuartilesReturn;
            }

            gruposReturn.push(temp)
        })

        this.setState({
            assignedUsers
        })
    }

    agregarGrupo = (e) => {
        const { grupos } = this.state
        e.preventDefault();
        let tempGroup = {
            order: grupos.length,
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
        const { grupos } = this.state
        let dataReturn = []
        let exists = false
        grupos.map(v => {
            if (v.name === newName) {
                console.log(v)
                exists = true;
            }
            return true;
        })

        if (exists) {
            swal("Error!", "No se puede poner el mismo nombre que otro grupo", "error")
        } else {
            // Buscamos el array a modificar
            grupos.map(v => {
                let tempData = v;
                if (v.name === oldName) {
                    tempData.name = newName
                }
                dataReturn.push(tempData)
                return true;
            })

            this.setState({
                grupos: dataReturn
            })
        }

    }

    updateAssign = (groupName) => {
        let { grupos } = this.state
        for(let i = 0; i < grupos.length; i++){
            const v = grupos[i];
            if(v.name === groupName){
                v.applyAllUsers = this.assignAllUsers.checked
            }
        }

        this.setState({
            grupos
        })
    }

    reasignCuartiles = (groupName, ArrayCuartilesAsignados) => {
        // Recibimos el nombre del grupo y los cuartiles que hay que reasignar
        
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
        let { cuartiles, grupos, allUsers, assignedUsers } = this.state;
        return (
            <div>
                <SideBarLeft />

                <div className="section-content">
                    <div className="headerResultados">
                        <p>Usuarios sin asignar: {allUsers.length - assignedUsers.length} - {Math.ceil(100 - ((assignedUsers.length / allUsers.length) * 100))}%</p>
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
                                    <div className="grupoPerfilamiento" key={key}>
                                        <p>Usuarios asignados: {v.users.length} - {Math.ceil((v.users.length / allUsers.length) * 100)}%</p>
                                        <div className="acciones">
                                            <input type="text" defaultValue={v.name} onBlur={(e) => this.changeName(v.name)} ref={e => this.name = e} />
                                            <label>Aplicar al 100% de los usuarios.
                                                <input type="checkbox" id="aplicarall" defaultChecked={v.applyAllUsers} onChange={() => {
                                                    this.updateAssign(v.name)
                                                }} ref={e => this.assignAllUsers = e} />
                                            </label>
                                            <select>
                                                <option>Seleccionar...</option>
                                            </select>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                this.eliminarGrupo(v.name)
                                            }}>Eliminar</button>
                                        </div>
                                        <div className="cuartilesAsignados" onDrop={(e) => this.onDrop(e, v.name)} onDragOver={(e) => e.preventDefault()}>
                                            {v.cuartiles &&
                                                v.cuartiles.map((value, key) => {
                                                    let claseColor = ""
                                                    switch (value.level) {
                                                        case 'Q1':
                                                            claseColor = 'green';
                                                            break;
                                                        case 'Q2':
                                                            claseColor = 'yellow';
                                                            break;
                                                        case 'Q3':
                                                            claseColor = 'orange';
                                                            break;
                                                        case 'Q4':
                                                            claseColor = 'red';
                                                            break;
                                                    }
                                                    return (
                                                        <span className={claseColor} key={key}>
                                                            <p>{`${value.name} - ${value.level}`}</p>
                                                            <button onClick={(e) => { e.preventDefault(); this.eliminarCuartil(v.name, value.name, value.level) }}>x</button>
                                                        </span>
                                                    )
                                                })

                                            }
                                            {/* 
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
                                            <button id={`${v.name}|Q1`} className="green" draggable onDragStart={this.onDragStart}>Q1 ({v.users.Q1.length})</button>
                                            <button id={`${v.name}|Q2`} className="yellow" draggable onDragStart={this.onDragStart}>Q2 ({v.users.Q2.length})</button>
                                            <button id={`${v.name}|Q3`} className="orange" draggable onDragStart={this.onDragStart}>Q3 ({v.users.Q3.length})</button>
                                            <button id={`${v.name}|Q4`} className="red" draggable onDragStart={this.onDragStart}>Q4 ({v.users.Q4.length})</button>
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
