import React, { Component } from 'react'
import './UserTable.css'


export default class UserTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMore: false,
            totalDisplayed: 5
        }
        this.props.allUsers.map(user => {
            console.log(user)
        })
    }
    handleClick() {
        this.setState({ showMore: true, totalDisplayed: this.state.totalDisplayed + 5 })
    }
    render() {
        console.log("State: ", this.state)
        return (
            <div>
                <div className="table-users">
                    <div className="table-header">Listado de Usuarios</div>

                    <table cellSpacing="0">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Nombre y apellido</th>
                                <th>Mail</th>
                                <th>Sector</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.props.allUsers &&
                                this.props.allUsers.slice(0, this.state.totalDisplayed).map((user, index) =>
                                    (
                                        <tr key={index}>
                                            <td>{user.id}</td>
                                            <td>{user.name} {user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.equipoEspecifico}</td>
                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <div className="flex-button">
                    <button onClick={() => this.handleClick()} className="ver-mas">Ver más</button>
                </div>

            </div>
        )
    }
}
