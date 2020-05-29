import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator'
import './Login.css';
import Global from '../../Global'

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            redirect: false
        }

        this.validator = new SimpleReactValidator({
            messages: {
                required: 'Completá este campo'
            }
        });

        this.login = this.login.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    login(e) {
        e.preventDefault()
        const { username, password } = this.state;
        if (this.validator.allValid()) {
            this.loginUser(username, password);
        } else {
            this.setState({
                redirect: false
            })
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    loginUser(username, password) {
        if (username && password) {
            axios.post(Global.login, {
                user: username,
                password: password
            }
            )
                .then(response => {
                    console.log(response.data)
                    if (response.data.Success) {
                        console.log("El que se va a loguear: ", response.data.loggedUser)
                        localStorage.setItem('userData', JSON.stringify(response.data.loggedUser))
                        localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                        this.setState({ redirect: true })
                    } else {
                        console.log("Login error")
                    }
                })
                .catch(err => console.warn(err));
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/home'} />
        }

        if (localStorage.getItem("userData")) {
            return <Redirect to={'/home'} />
        }
        return (
            <div className="container">
                <div className="center">
                    <h1>Iniciar sesión</h1>
                    <form onSubmit={this.login}>
                        <div className="txt_field">
                            <input type="text" name="username" onChange={this.onChange} />
                            <div className="error">
                                {
                                    this.validator.message('title', this.state.username, 'required')
                                }
                            </div>
                            <span></span>
                            <label>Nombre de usuario</label>
                        </div>
                        <div className="txt_field">
                            <input type="password" name="password" onChange={this.onChange} />
                            <div className="error">
                                {
                                    this.validator.message('title', this.state.password, 'required')
                                }
                            </div>
                            <span></span>
                            <label>Contraseña</label>
                        </div>
                        <div className="pass">Olvidaste tu contraseña?</div>
                        <button type="submit">Iniciar sesión</button>
                    </form>
                </div>
            </div>
        )
    }
}
