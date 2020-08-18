import React, { Component } from 'react'
import SideBarLeft from '../SidebarLeft/SiderbarLeft'
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import axios from 'axios';
import Global from '../../Global'
import './PerfilamientosComponent.css'
import { Redirect } from 'react-router-dom';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const placeholder = document.createElement("div");
placeholder.className = "placeholder";
placeholder.className = "grupoPerfilamiento";

export default class PerfilaminetosComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: "",
            allUsers: [],
            assignedUsers: [],
            cuartiles: [],
            grupos: [],
            redirect: false,
            redirectCuartiles: false,
            loading: false
        }
    }

    onDrop = (e, groupName) => {
        e.preventDefault();
        let data = e.dataTransfer.getData('data');
        if (data && groupName) {
            data = data.split('|');
            let QName = data[0];
            let level = data[1];
            this.assignCuartil(QName, level, groupName);
        }
    }


    assignCuartil = (QName, level, groupName) => {
        if (QName && groupName && level) {
            let { cuartiles, assignedUsers, grupos } = this.state;
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
                                return true;
                            })
                        }
                        return true;
                    })

                    if (!exists) {
                        for (let u = 0; u < users.length; u++) {
                            // Buscamos si tambien existe en los otros cuartiles
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
                            return true;

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
                this.reasignUsers();
                return true;
            })
        }
    }

    onDragStart = (e) => {
        // Buscar los usuarios segun ese cuartil
        e.dataTransfer.setData('data', e.target.id)

    }

    eliminarGrupo = (id) => {
        // Eliminamos el grupo del array
        let { grupos, assignedUsers } = this.state;
        let returnData = []
        for (let i = 0; i < grupos.length; i++) {
            const g = grupos[i];
            if (g.id !== id) {
                returnData.push(grupos[i])
            } else {
                grupos[i].users.map(g => {
                    assignedUsers.splice(assignedUsers.indexOf(g), 1)
                    return true;
                })
            }
        }

        this.setState({
            grupos: returnData,
            assignedUsers
        })
    }

    eliminarCuartil = (nameGroup, nameCuartil, levelCuartil) => {
        let { grupos } = this.state
        let gruposReturn = []

        for (let i = 0; i < grupos.length; i++) {
            const g = grupos[i]
            let temp = g;
            if (g.name === nameGroup) {
                let cuartiles = g.cuartiles;
                let cuartilesReturn = []
                for (let j = 0; j < cuartiles.length; j++) {
                    const c = cuartiles[j];
                    if (!(c.name === nameCuartil && c.level === levelCuartil)) {
                        cuartilesReturn.push(c)
                    }
                }

                temp.cuartiles = cuartilesReturn;
            }
            gruposReturn.push(temp)

        }

        this.setState({
            grupos: gruposReturn
        })

        this.reasignUsers();
    }

    agregarGrupo = (dataNew = {}) => {
        const { grupos } = this.state
        let tempGroup = {
            id: parseInt(Date.now() * Math.random()),
            name: `Nuevo grupo ${grupos.length + 1}`,
            applyAllUsers: false,
            cluster: "Convergente",
            users: [],
            cuartiles: []
        }


        for (let i in tempGroup) {
            if (dataNew[i]) {
                tempGroup[i] = dataNew[i]
            }
        }

        this.setState({
            grupos: [...grupos, tempGroup]
        })


    }

    changeSelect = (id) => {
        const { grupos } = this.state
        let dataReturn = []
        grupos.map(v => {
            let tempData = v;
            if (v.id === id) {
                tempData.cluster = this.select.value
            }
            dataReturn.push(tempData)
            return true;
        })
        this.setState({
            grupos: dataReturn
        })
    }


    changeName = (id) => {
        let newName = document.getElementById(id).value;
        const { grupos } = this.state
        let dataReturn = []

        // Buscamos el array a modificar
        grupos.map(v => {
            let tempData = v;
            if (v.id === id) {
                tempData.name = newName
            }
            dataReturn.push(tempData)
            return true;
        })

        this.setState({
            grupos: dataReturn
        })
    }

    updateAssign = (id) => {
        let { grupos } = this.state
        for (let i = 0; i < grupos.length; i++) {
            const v = grupos[i];
            if (v.id === id) {
                v.applyAllUsers = this.assignAllUsers.checked
            }
        }

        this.setState({
            grupos
        })

        this.reasignUsers();
    }

    cuartiles = (id) => {
        this.setState({
            redirectCuartiles: true
        })
    }

    matchInAllCuartiles = (cuartiles, userId) => {
        let necessaryMatch = cuartiles.length;
        let matchs = 0;

        for (let c of cuartiles) {
            if (c.users.includes(userId)) {
                matchs++
            }
        }

        return necessaryMatch === matchs
    }

    reasignUsers = () => {
        // Reasignamos todos los cuartiles
        const { grupos, cuartiles } = this.state
        let newAssign = {
            assignedUsers: [],
            grupos: []
        }


        for (let r = 0; r < grupos.length; r++) {
            const oldGroup = grupos[r];
            let tempGroup = {
                id: oldGroup.id,
                name: oldGroup.name,
                applyAllUsers: oldGroup.applyAllUsers,
                cluster: oldGroup.cluster,
                users: [],
                cuartiles: []
            }
            let cuartilesWithUsers = [];

            for (let crt of oldGroup.cuartiles) {
                let tempData = {
                    name: crt.name,
                    users: []
                }
                cuartiles.map(v => {
                    if (v.name === crt.name) {
                        tempData.users = v.users[crt.level];
                    }
                    return true;
                })
                cuartilesWithUsers.push(tempData);
            }

            // Reasignamos los usuarios
            oldGroup.cuartiles.map(cuartil => {
                // Buscamos el cuartil con los usuarios originales
                let cuartilUsers = [];
                cuartiles.map(v => {
                    if (v.name === cuartil.name) {
                        cuartilUsers = v.users[cuartil.level];
                    }
                    return true;
                })

                let tempCuartil = {
                    name: cuartil.name,
                    level: cuartil.level,
                    usersToAssign: []
                }

                // Reasignamos los usuarios
                cuartilUsers.map(dni => {
                    let match = this.matchInAllCuartiles(cuartilesWithUsers, dni);
                    if (!newAssign.assignedUsers.includes(dni) && !oldGroup.applyAllUsers && match) {
                        newAssign.assignedUsers.push(dni)
                        tempCuartil.usersToAssign.push(dni)
                        tempGroup.users.push(dni)
                    } else if (oldGroup.applyAllUsers) {
                        tempCuartil.usersToAssign.push(dni)
                        if (!tempGroup.users.includes(dni)) {
                            tempGroup.users.push(dni)
                        }
                    }
                    return true;
                })

                tempGroup.cuartiles.push(tempCuartil);
                return true;
            })
            newAssign.grupos.push(tempGroup);

        }

        this.setState({
            grupos: newAssign.grupos,
            assignedUsers: newAssign.assignedUsers
        })

    }

    dragStartG = (e) => {
        this.drag_el = e.currentTarget

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.drag_el);
    }

    dragOverG = (e) => {
        e.preventDefault();
        if (this.drag_el) {
            const { target } = e;

            this.drag_el.style.display = "none";
            this.over = target;
            if (target.parentNode.className === 'grupos') {
                target.parentNode.insertBefore(placeholder, target);
            }
        }

    }

    dragEndG = () => {
        if (this.drag_el) {
            this.drag_el.style.display = 'block';
            try {
                this.drag_el.parentNode.removeChild(placeholder);

                let { grupos } = this.state

                const from = Number(this.drag_el.id);
                let to = Number(this.over.id);
                if (from < to) to--;
                grupos.splice(to, 0, grupos.splice(from, 1)[0]);

                this.setState({
                    grupos
                });
                this.reasignUsers()
                this.drag_el = null
            } catch (e) {
                this.drag_el = null
                console.log('No se puede pegar un grupo fuera del componente')
            }
        }
    }

    enviarModificacion = (e) => {
        e.preventDefault();
        const { grupos, id } = this.state;
        let dataSend = []
        // Preparamos el array para enviar con un for para enviarlos ordenados
        for (let i = 0; i < grupos.length; i++) {
            const group = grupos[i];
            let tempData = {
                name: group.name.trim(),
                AssignAllUsers: group.applyAllUsers,
                cluster: group.cluster,
                cuartilAssign: []
            }



            group.cuartiles.map(v => {
                let Q = parseInt(v.level[1])
                tempData.cuartilAssign.push({
                    cuartil: v.name.trim(),
                    Q
                })

                return true;
            })
            let data = dataSend.find(element => (element.name === tempData.name))
            if (data) {
                swal("Error", "No pueden existir dos grupos con el mismo nombre", "error");
                return;
            } else {
                dataSend.push(tempData)
            }
        }

        // console.log(dataSend);
        // debugger;


        swal(`¿Esta seguro que desea modificar el perfilamiento?: `)
            .then(() => {
                let token = JSON.parse(sessionStorage.getItem('token'))
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // PARAMETROS REQUERIDOS, SOLO PASSWORD
                const bodyParameters = dataSend

                axios.post(Global.getAllFiles + '/' + id + '/perfilamiento', bodyParameters, config)
                    .then(response => {
                        sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                        if (response.data.Success) {
                            swal("Felicidades!", "Perfilamiento modificado!", "success").then(() => {
                                this.setState({
                                    redirect: true
                                })
                            })
                        } else {
                            swal("Error!", "Hubo un error al modificar el perfilamiento!", "error").then(() => {
                                this.setState({
                                    redirect: true
                                })
                            })
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
            });
    }

    componentDidMount() {
        const { cuartilSeleccionado } = this.props.location;
        if (!cuartilSeleccionado) {
            this.setState({
                redirect: true
            })
            return;
        }
        let id = cuartilSeleccionado;
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`

        this.setState({ loading: true });

        axios.get(Global.getAllFiles + '/' + id + '/cuartiles?getUsers=true', { headers: { Authorization: bearer } }).then(response => {

            token = response.data.loggedUser.token
            bearer = `Bearer ${token}`
            let respuesta = response.data.Data
            const allUsers = respuesta.usuariosTotal
            const cuartiles = respuesta.cuartiles;

            axios.get(Global.getAllFiles + '/' + id + '/perfilamiento', { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                let respuesta = response.data.Data;

                this.setState({
                    allUsers,
                    cuartiles,
                    id,
                    loading: false
                });

                if (respuesta) {
                    // Creamos los grupos existentes en orden
                    for (let i = 0; i < respuesta.length; i++) {
                        const r = respuesta[i]
                        let cuartiles = []

                        r.cuartilAssign.map(c => {
                            cuartiles.push({
                                name: c.cuartil,
                                level: `Q${c.Q}`,
                                usersToAssign: []
                            })
                            return true;
                        })

                        this.agregarGrupo({
                            id: parseInt(Date.now() * Math.random()),
                            name: r.name,
                            applyAllUsers: r.AssignAllUsers,
                            cluster: r.cluster,
                            cuartiles
                        })

                    }


                    this.reasignUsers();
                }


            })
        })
    }

    render() {
        let { cuartiles, grupos, allUsers, assignedUsers, redirect, id, redirectCuartiles, loading } = this.state;
        let { nameCuartilSelected } = this.props.location;

        if (redirect) {
            return <Redirect to="/perfilamiento" />
        }

        if (redirectCuartiles) {
            return <Redirect
                to={{
                    pathname: '/perfilamiento/cuartiles',
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
                    {nameCuartilSelected &&
                        <div className="alert alert-primary">{nameCuartilSelected}</div>
                    }
                    <h6 className="titulo-seccion">Grupos</h6>
                    <div className="headerResultados">
                        {cuartiles.length > 0 &&
                            <p>Usuarios sin asignar: {allUsers.length - assignedUsers.length} - {Math.ceil(100 - ((assignedUsers.length / allUsers.length) * 100))}%</p>
                        }
                        <span>
                            {cuartiles.length > 0 &&
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    this.agregarGrupo();
                                }} className="addItem morph"> <AddIcon className="svgAddButton" style={{ fontSize: 33 }} /></button>
                            }
                            <button onClick={(e) => {
                                e.preventDefault();
                                this.cuartiles(id)
                            }} className="buttonSiguiente cuartiles-boton"><AssessmentIcon />Cuartiles</button>
                            {grupos.length > 0 &&
                                <button onClick={this.enviarModificacion} className="buttonSiguiente">Guardar cambios</button>
                            }
                        </span>
                    </div>

                    <div className="grupos">
                        {grupos &&
                            grupos.map((v, key) => {
                                console.log(v)
                                return (
                                    <div className="grupoPerfilamiento" id={key} key={key} draggable onDragStart={this.dragStartG} onDragOver={this.dragOverG} onDragEnd={this.dragEndG}>
                                        <p>Usuarios asignados: {v.users.length} - {Math.ceil((v.users.length / allUsers.length) * 100)}%</p>
                                        <div className="acciones">
                                            <input className="form-control" type="text" value={v.name} onChange={(e) => this.changeName(v.id)} id={v.id} />
                                            <label>Aplicar al 100% de los usuarios.
                                                <input type="checkbox" id="aplicarall" onChange={() => {
                                                    this.updateAssign(v.id)
                                                }} ref={e => this.assignAllUsers = e} defaultChecked={v.applyAllUsers} />
                                            </label>

                                            <select
                                                ref={e => this.select = e}
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    this.changeSelect(v.id)
                                                }}
                                                value={v.cluster}
                                            >
                                                <option value="Convergente">Convergente</option>
                                                <option value="Mantenimiento">Mantenimiento</option>
                                                <option value="Benchmark">Benchmark</option>
                                                <option value="Comportamental">Comportamental</option>
                                                <option value="Sustentable">Sustentable</option>
                                                <option value="Desarrollo">Desarrollo</option>
                                            </select>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                this.eliminarGrupo(v.id)
                                            }}> <DeleteIcon /></button>
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
                                                        default:
                                                            claseColor = 'gray';
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
                                        <h6>{v.name}</h6>
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
