import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button';


export default class Logout extends Component {
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
                <Link to="/" onClick={this.logout} style={{ color: 'inherit', textDecoration: 'inherit'}}>
                    <Button variant="contained" color="primary" disableElevation>
                        SALIR
                </Button>
                </Link>
            </div>
        )
    }
}
