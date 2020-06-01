import React, { Component } from 'react'
import Global from '../../Global'
import axios from 'axios'
import UserTable from '../UserTable/UserTable'
import { Redirect } from 'react-router-dom'

export default class TableOfUsers extends Component {
    constructor() {
        super()
        this.state = {
            allUsers: null,
            redirect: false
        }
        this.logout = this.logout.bind(this)
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
                // Si hay algún error en el request lo deslogueamos
                console.log('error ' + error);
                this.logout()
            });
    }

    logout() {
        localStorage.setItem("userData", '')
        localStorage.setItem("token", '')
        localStorage.clear()
        this.setState({ redirect: true })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }

        return (
            <div>
                {this.state.allUsers === null &&
                    <h1>Buscando info en la api del soga...</h1>
                }

                {this.state.allUsers != null &&
                    <UserTable allUsers={this.state.allUsers} />
                }

            </div>
        )
    }
}

