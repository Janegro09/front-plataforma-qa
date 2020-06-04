import React, { Component } from 'react'
import './UserTable.css'
import { Redirect } from 'react-router-dom'
import Global from '../../Global'
import axios from 'axios'


export default class UserTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            term: '',
            encontrado: null,
            editUser: false,
            addUser: false,
            deleteUser: false,
            userSelected: null,
            allUsers: null,
            searched: false,
            error: false,
            redirect: false,
            changePassword: false
        }

        this.buscar = this.buscar.bind(this)
        this.editUser = this.editUser.bind(this)
        this.addUser = this.addUser.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.logout = this.logout.bind(this)
    }

    buscar(event) {
        event.preventDefault()
        this.setState({
            searched: true
        })

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
                this.setState({
                    error: true,
                    redirect: true
                })
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

    addUser(event) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        this.setState({
            addUser: true
        })
    }

    changePassword(event) {
        event.preventDefault()
        this.setState({
            changePassword: true
        })
    }

    logout() {
        localStorage.setItem("userData", '')
        localStorage.setItem("token", '')
        localStorage.clear()
        this.setState({ redirect: true })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/home'} />
        }
        // Si se selecciono editar usuario lo envío a la página editUser con los datos del usuario
        if (this.state.editUser) {
            return <Redirect to={{
                pathname: '/editUser',
                state: { userSelected: this.state.userSelected }
            }}
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (this.state.addUser) {
            return <Redirect to="/addUser"
            />
        }

        // Si se selecciono borrar usuario lo envío a la página deleteUser con los datos del usuario
        if (this.state.changePassword) {
            return <Redirect to="/changePassword"
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
                {/* Buscador */}
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

                <button onClick={e => this.addUser(e)}>Crear usuario</button>

                {this.state.searched && this.state.encontrado === null && !this.state.error &&
                    <div className="sk-fading-circle">
                        <div className="sk-circle1 sk-circle"></div>
                        <div className="sk-circle2 sk-circle"></div>
                        <div className="sk-circle3 sk-circle"></div>
                        <div className="sk-circle4 sk-circle"></div>
                        <div className="sk-circle5 sk-circle"></div>
                        <div className="sk-circle6 sk-circle"></div>
                        <div className="sk-circle7 sk-circle"></div>
                        <div className="sk-circle8 sk-circle"></div>
                        <div className="sk-circle9 sk-circle"></div>
                        <div className="sk-circle10 sk-circle"></div>
                        <div className="sk-circle11 sk-circle"></div>
                        <div className="sk-circle12 sk-circle"></div>
                    </div>
                }

                {this.state.error &&
                    <h1>Hubo un error en la búsqueda, inténtalo más tarde</h1>
                }

                {this.state.encontrado &&
                    <div className="table-users">

                        <div className="table-header">Datos de {this.state.encontrado.name} {this.state.encontrado.lastName} </div>

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
                        </table>
                    </div>
                }
            </div>
        )
    }
}
