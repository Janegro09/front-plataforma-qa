import React, { Component } from 'react'
import './UserTable.css'
import { Redirect } from 'react-router-dom'
import Global from '../../Global'
import axios from 'axios'


export default class UserTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: false,
            totalDisplayed: 10,
            term: '',
            encontrado: null,
            editUser: false,
            deleteUser: false,
            userSelected: null,
            allUsers: null
        }

        this.buscar = this.buscar.bind(this)
        this.editUser = this.editUser.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
    }
    handleClick() {
        this.setState({ showMore: true, totalDisplayed: this.state.totalDisplayed + 5 })
    }

    buscar(event) {
        event.preventDefault()
        let title = this.title.value;
        if (title === '') {
            this.setState({ encontrado: null })
        }

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getUsers, { headers: { Authorization: bearer } }).then(response => {
            console.log("response.data", response.data)
            /* se actualiza el token */
            this.setState({
                allUsers: response.data.Data
            })
            
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            this.state.allUsers.map(user => {
                if (user.id === title) {
                    this.setState({ encontrado: user })
                }
                return true;
            })
        })
            .catch((error) => {
                // Si hay algún error en el request lo deslogueamos
                console.log('error ' + error);
                this.logout()
            });
        
            

    }

    editUser(event, userInfo) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        this.setState({
            editUser: true,
            userSelected: userInfo
        })

    }

    deleteUser(event, userInfo) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        this.setState({
            deleteUser: true,
            userSelected: userInfo
        })

    }

    render() {
        // Si se selecciono editar usuario lo envío a la página editUser con los datos del usuario
        if (this.state.editUser) {
            return <Redirect to={{
                pathname: '/editUser',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (this.state.deleteUser) {
            return <Redirect to={{
                pathname: '/deleteUser',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        return (
            <div>
                <form onSubmit={this.buscar} className="buscador">
                    <input
                        type="text"
                        ref={(c) => {
                            this.title = c
                        }}
                        placeholder="Ingrese el número de id"
                    />
                    <input type="submit" value="Buscar" />
                </form>
                <div className="table-users">
                    <div className="table-header">Listado de Usuarios</div>

                    <table cellSpacing="0">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Nombre y apellido</th>
                                <th>Mail</th>
                                <th>Sector</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>


                        {this.props.allUsers && this.state.encontrado === null &&
                            this.props.allUsers.slice(0, this.state.totalDisplayed).map((user, index) =>
                                (<tbody key={index}>
                                    <tr>
                                        <td>{user.id}</td>
                                        <td>{user.name} {user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.equipoEspecifico}</td>
                                        <td onClick={e => this.editUser(e, user)}>icono-edit</td>
                                        <td onClick={e => this.deleteUser(e, user)}>icono-delete</td>
                                    </tr>
                                </tbody>
                                )
                            )
                        }

                        {this.state.encontrado &&
                            <tbody key={this.state.encontrado.id}>
                                <tr>
                                    <td>{this.state.encontrado.id}</td>
                                    <td>{this.state.encontrado.name} {this.state.encontrado.lastName}</td>
                                    <td>{this.state.encontrado.email}</td>
                                    <td>{this.state.encontrado.equipoEspecifico}</td>
                                    <td onClick={e => this.editUser(e, this.state.encontrado)}>icono-edit</td>
                                    <td onClick={e => this.deleteUser(e, this.state.encontrado)}>icono-delete</td>
                                </tr>
                            </tbody>
                        }

                    </table>
                </div>
                {this.state.encontrado === null &&
                    <div className="flex-button">
                        <button onClick={() => this.handleClick()} className="ver-mas">Ver más</button>
                    </div>
                }
            </div>
        )
    }
}
