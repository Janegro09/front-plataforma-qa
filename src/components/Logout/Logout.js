import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import ListItemText from '@material-ui/core/ListItemText';


export default class Logout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }
    
    logout = () => {
        sessionStorage.setItem("userData", '')
        sessionStorage.setItem("token", '')
        sessionStorage.clear()
        this.setState({ redirect: true })
    }
    
    componentDidMount() {
        if (sessionStorage.getItem("userData")) {
            // console.log("Datos almacenados")
        } else {
            this.setState({ redirect: true })
        }
    }
    
    render() {
        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }
        return (
            <div>
                <Link to="/" onClick={this.logout} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                    <ListItemText primary={"salir"} />
                </Link>
            </div>
        )
    }
}
