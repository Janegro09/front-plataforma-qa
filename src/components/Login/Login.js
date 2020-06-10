import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator'
import './Login.css';
import Global from '../../Global'
import Logo from './qa_logos.png';
import ReCAPTCHA from "react-google-recaptcha";




export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            redirect: false,
            wrongValidations: false,
            'g-recaptcha-response': null,
            errorMessage: ''
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
        this.captcha.reset()
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
                password: password,
                'g-recaptcha-response': this.state["g-recaptcha-response"]
            }
            )
                .then(response => {


                    if (response.data.Success) {
                        console.log("El que se va a loguear: ", response.data.loggedUser)
                        sessionStorage.setItem('userData', JSON.stringify(response.data.loggedUser))
                        sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                        this.setState({ redirect: true })

                    } else {
                        console.log("Login error")
                        sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                    }
                })
                .catch(err => {
                    this.setState({
                        username: '',
                        password: '',
                        wrongValidations: true,
                        errorMessage: err.response.data.Message
                    })
                    console.warn(err)
                });
        }
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={'/home'} />
        }

        if (sessionStorage.getItem("userData")) {
            return <Redirect to={'/home'} />
        }
        return (
            <div className="container">
                <div id="login" className="signin-card">
                    <div className="logo-image">
                        <img src={Logo} alt="Logo" title="Logo" className="Logo" />
                    </div>
                    <form onSubmit={this.login}>
                        <div id="form-login-username" className="form-group">
                            <input id="username" onChange={this.onChange} className="form-control loginForm" name="username" type="text" size="18" alt="login" value={this.state.username} required />
                            <div className="error">
                                {
                                    this.validator.message('title', this.state.username, 'required')
                                }
                            </div>

                            <span className="form-highlight"></span>
                            <span className="form-bar"></span>
                            <label htmlFor="username" className="float-label">login</label>
                        </div>

                        <div id="form-login-password" className="form-group">
                            <input id="passwd" onChange={this.onChange} className="form-control loginForm" name="password" type="password" size="18" alt="password" value={this.state.password} required />

                            <div className="error">
                                {
                                    this.validator.message('title', this.state.password, 'required')
                                }
                            </div>

                            <span className="form-highlight"></span>
                            <span className="form-bar"></span>
                            <label htmlFor="password" className="float-label">password</label>
                        </div>

                        <ReCAPTCHA

                            ref={e => (this.captcha = e)}
                            sitekey="6Lc_kQEVAAAAALDdMw8duPQhADuwZTxBPElW-UYe"
                            onChange={(e) => {
                                this.setState({
                                    'g-recaptcha-response': e
                                })
                            }}
                        />
                        <div>
                            <button disabled={!this.state["g-recaptcha-response"]} className="btn btn-block btn-info ripple-effect" type="submit" name="Submit" alt="sign in">Sign in</button>
                        </div>
                    </form>
                    {this.state.errorMessage !== '' &&
                        <div className="alert alert-danger" role="alert">
                            {this.state.errorMessage}
                        </div>
                    }

                </div>



            </div>
        )
    }
}
