import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator'
import './Login.css';
import Global from '../../Global'
import Logo from './qa_logos.png';

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
                {/* <div className="center">
                    <h1 className="titulo">Iniciar sesión</h1>
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
                </div> */}

                <div id="login" class="signin-card">


                    <div class="logo-image">
                        <img src={Logo} alt="Logo" title="Logo" class="Logo" />
                    </div>


                    <form onSubmit={this.login}>
                            <div id="form-login-username" class="form-group">
                                <input id="username" onChange={this.onChange} class="form-control" name="username" type="text" size="18" alt="login" required />
                                <div className="error">
                                    {
                                        this.validator.message('title', this.state.username, 'required')
                                    }
                                 </div>
                                 
                                <span class="form-highlight"></span>
                                <span class="form-bar"></span>
                              <label for="username" class="float-label">login</label>
                            </div>

                            <div id="form-login-password" class="form-group">
                              <input id="passwd" onChange={this.onChange} class="form-control" name="password" type="password" size="18" alt="password" required />
                               
                                <div className="error">
                                    {
                                        this.validator.message('title', this.state.password, 'required')
                                    }
                                </div>

                                <span class="form-highlight"></span>
                                <span class="form-bar"></span>
                              <label for="password" class="float-label">password</label>
                            </div> 

                            <div id="form-login-remember" class="form-group">
                                <div class="checkbox checkbox-default">       
                                    <input id="remember" type="checkbox" value="yes" alt="Remember me" class="" />
                                    <label for="remember">Remember me</label>      
                                </div>
                            </div> 

                        <div>
                          <button class="btn btn-block btn-info ripple-effect" type="submit" name="Submit" alt="sign in">Sign in</button>  
	                    </div>
                    </form>
                </div>

            </div>
        )
    }
}
