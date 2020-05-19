import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Logout extends Component {
    constructor(props) {
        super(props)
        localStorage.removeItem("token")
    }
    render() {
        return (
            <div>
                <h1>Te deslogueaste animaaaaal!!!</h1>
                <Link to="/">Logueate de nuevo</Link>
            </div>
        )
    }
}
