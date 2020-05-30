import React, { Component } from 'react'
import Global from '../../Global'
import axios from 'axios'
import UserTable from '../UserTable/UserTable'

export default class TableOfUsers extends Component {
    constructor() {
        super()
        this.state = {
            allUsers: null
        }
    }
    componentDidMount() {
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getUsers, { headers: { Authorization: bearer } }).then(response => {
            /* se actualiza el token */
            this.setState({
                allUsers: response.data.Data
            })
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
        })
            .catch((error) => {
                console.log('error ' + error);
            });
    }
    render() {
        return (
            <div>
                {this.state.allUsers === null &&
                    <h1>Cargando...</h1>
                }

                {this.state.allUsers != null &&
                    <UserTable allUsers={this.state.allUsers} />
                }

            </div>
        )
    }
}

