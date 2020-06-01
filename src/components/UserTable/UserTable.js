import React, { Component } from 'react'
import './UserTable.css'


export default class UserTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: false,
            totalDisplayed: 5,
            term: '',
            encontrado: null
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
        this.props.allUsers.map(user => {
            if (user.id === title) {
                this.setState({ encontrado: user })
            }
            return true;
        })
    }

    editUser(event, userInfo) {
        event.preventDefault()
        console.log("Editar Usuario")
        console.log(userInfo)
    }

    deleteUser(event, userInfo) {
        event.preventDefault()
        console.log("Borrar Usuario")
        console.log(userInfo)
    }

    render() {
        return (
            <div>
                <form onSubmit={this.buscar}>
                    <input type="text"
                        ref={(c) => {
                            this.title = c
                        }}
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
