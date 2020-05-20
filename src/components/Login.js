import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import './Login.css';

export default class Login extends Component {
    constructor(props) {
        super(props)
        const token = localStorage.getItem("token")

        let loggedIn = true
        if (token == null) {
            loggedIn = false
        }
        this.state = {
            username: '',
            password: '',
            loggedIn
        }

        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submitForm(e) {
        e.preventDefault();
        const { username, password } = this.state;
        // VALIDO EL NOMBRE DE USUARIO Y EL PASSWORD
        if (username === "admin" && password === "admin") {
            localStorage.setItem("token", "faslfhasopfjaposf");
            this.setState({
                loggedIn: true
            })
        }
    }

    render() {
        // VERIFICO SI EL USUARIO SE LOGUEO CORRECTAMENTE Y REDIRIJO AL PANEL DE ADMIN
        if (this.state.loggedIn) {
            return <Redirect to={{
                pathname: '/admin',
                state: this.state
            }} />
        }
        return (
            <div className="center">
                <h1>Iniciar sesión</h1>
                <form onSubmit={this.submitForm}>
                    <div className="txt_field">
                        <input type="text" name="username" value={this.state.username} onChange={this.onChange} required />
                        <span></span>
                        <label>Nombre de usuario</label>
                    </div>
                    <div className="txt_field">
                        <input type="password" name="password" value={this.state.password} onChange={this.onChange} required />
                        <span></span>
                        <label>Contraseña</label>
                    </div>
                    <div className="pass">Olvidaste tu contraseña?</div>
                    <button type="submit">Iniciar sesión</button>
                    <div className="signup_link">
                        <p>No tienes una cuenta? <a href="/#">Registrarse</a></p>
                    </div>
                </form>
            </div>
        )
    }
}
