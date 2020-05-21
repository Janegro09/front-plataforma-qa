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
            console.log("Call user feed")
        } else {
            this.setState({redirect: true})
        }
    }

    logout() {
        localStorage.setItem("userData",'')
        localStorage.clear()
        this.setState({redirect: true})
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }

        return (
            <div>
                <h1>Bienvenido !!</h1>
                <Link to="/" onClick={this.logout}>Cerrar sesión</Link>
            </div>
        )
    }
}
