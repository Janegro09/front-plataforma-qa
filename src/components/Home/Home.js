import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import { Redirect } from 'react-router-dom'
import './Home.css';
import Logo from '../Home/logo_background.png';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import axios from 'axios';
import swal from 'sweetalert';

export default class UsersComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: 'user',
            redirect: false,
            userData: null,
            loading: false
        }
    }

    componentDidMount() {
        HELPER_FUNCTIONS.set_page_title('Home')
        this.setState({ loading: true })

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.dashboard, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            this.setState({
                userData: response.data.loggedUser,
                loading: false
            })

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {

        const { loading } = this.state;

        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }
        // Protección de rutas
        const tokenUser = JSON.parse(localStorage.getItem("token"))

        if (tokenUser === null) {
            return <Redirect to={'/'} />
        }

        // const { userData } = this.state;


        return (
            <div>

                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div>
                    <SidebarLeft />
                </div>

                <div className="logoBackground">
                    <img src={Logo} alt="" title="" className="Logo2" />
                </div>

                {/* {HELPER_FUNCTIONS.checkPermission("POST|users/passchange/:id") && userData && */}
                <UserAdminHeader />
                {/* } */}

                {/* <div className="dashboard">
                    {userData &&
                        <section>
                            <h2>Mis datos</h2>
                            <article>
                                <h6>ID</h6>
                                <span>{userData.id}</span>
                            </article>
                            <article>
                                <h6>EMAIL</h6>
                                <span>{userData.email}</span>
                            </article>
                            <article>
                                <h6>NAME & LASTNAME</h6>
                                <span>{`${userData.name} ${userData.lastName}`}</span>
                            </article>
                            <article>
                                <h6>Grupos</h6>
                                <div className="multispan">
                                    {userData.group.map(v => {
                                        return <span>{v.name}</span>
                                    })

                                    }
                                </div>
                            </article>
                            <article>
                                <h6>ROL</h6>
                                <span>{userData.role.role}</span>
                            </article>
                            
                        </section>

                    }
                    
                </div> */}


            </div>

        )
    }
}