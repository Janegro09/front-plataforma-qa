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
            cuartiles: []
        }
    }

    onDragStart = (e, id) => {
        console.log(e, id);
        // Buscar los usuarios segun ese cuartil
        const { cuartiles } = this.state;

        id = id.split('|');
        let QName = id[0];
        let level = id[1];

        let usersArray = [];
        cuartiles.map(v => {
            if(v.name === QName){
                let users = v.users[level];
                console.log(users);
            }
            return true;
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
        let { cuartiles } = this.state;
        return (
            <div>
                <SideBarLeft />

                <div className="section-content">
                    <div className="headerResultados">
                        <p>Usuarios sin asignar: 100 - 100%</p>
                        <span>
                            <button>Cuartiles</button>
                            <button>Modificar</button>
                        </span>
                    </div>

                    <div className="grupos">
                        <div className="grupoPerfilamiento">
                            <div className="acciones">
                                <input type="text" defaultValue="Nuevo grupo 1" />
                                <label>Aplicar al 100% de los usuarios.
                                    <input type="checkbox" id="aplicarall" />
                                </label>
                                <button>Eliminar</button>
                            </div>
                            <div className="cuartilesAsignados">
                                <span className="green">
                                    <p>Cuartil 1 - Q1</p>
                                    <button>x</button>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="cuartiles">
                        {/* Cuartil */}
                        {cuartiles &&
                            cuartiles.map((v, key) => {
                                return (
                                    <div key={key} className="cuartil">
                                        <h5>{v.name}</h5>
                                        <div className="buttonsContain">
                                            <button id={`${v.name}|Q1`} className="green" draggable onDragStart={e => this.onDragStart(e, `${v.name}|Q1`)}>Q1</button>
                                            <button id={`${v.name}|Q2`} className="yellow" draggable onDragStart={e => this.onDragStart(e, `${v.name}|Q2`)}>Q2</button>
                                            <button id={`${v.name}|Q3`} className="orange" draggable onDragStart={e => this.onDragStart(e, `${v.name}|Q3`)}>Q3</button>
                                            <button id={`${v.name}|Q4`} className="red" draggable onDragStart={e => this.onDragStart(e, `${v.name}|Q4`)}>Q4</button>
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
