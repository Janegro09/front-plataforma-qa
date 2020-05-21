import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }

        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        if (localStorage.getItem("userData")) {
            console.log("Datos almacenados")
        } else {
            this.setState({ redirect: true })
        }
    }

    logout() {
        localStorage.setItem("userData", '')
        localStorage.clear()
        this.setState({ redirect: true })
    }

    render() {
        const userInfo = JSON.parse(localStorage.getItem("userData"));
        console.log(userInfo)
        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }

        return (
            <div>
                <h1>Bienvenido {userInfo.name} {userInfo.lastName} !!</h1>
                <ul>
                    <li>Tu email es: {userInfo.email}</li>
                    <li>Tu id es: {userInfo.id}</li>
                </ul>
                <Link to="/" onClick={this.logout}>Cerrar sesión</Link>
            </div>
        )
    }
}
