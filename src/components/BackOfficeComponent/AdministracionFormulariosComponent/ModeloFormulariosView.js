import React, { Component } from 'react';
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader';
import Global from '../../../Global';
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import swal from 'sweetalert';
import './Modal.css';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import './formularios.css';


export default class componentName extends Component {
    state = {
        loading: false,
        redirect: false,
        data: null
    }

    changeSelection = (e) => {
        const { name, parentNode } = e.target;


        let child = false;
        let childsOfParentNode = parentNode.childNodes;
        for(let c of childsOfParentNode) {
            const { classList, localName } = c;
            if(localName === 'div' && classList.contains('conditionalCF')){
                child = c;
            }
        }


        


        console.log(name, parentNode);
        console.log(child)
    }

    componentDidMount = () => {
        const { id } = this.props.match.params;

        // Hacemos el request para ver el formmulario

        this.setState({
            loading: true
        })

        let tokenUser = JSON.parse(sessionStorage.getItem("token"));
        let token = tokenUser;
        let bearer = `Bearer ${token}`;

        
        axios.get(Global.newFormModel + '/' + id, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            // ACÁ VAN A QUEDAR LAS DE M
            if(response.data.Data.length === 0) {
                this.setState({ redirect: '/administracion-formularios/modelo-formularios' })
            } else {

                console.log(response.data.Data[0]);
                this.setState({
                    loading: false,
                    data: response.data.Data[0]
                })
            }

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    getCustomField = (value, index) => {
        return (
            <article key={index}>
                <p>{value.question || value.name}</p>
                
                {value.type === 'select' &&
                    <>
                        <select name={value.questionId}>
                            <option>Selecciona...</option>
                            {value.values.map((cf, ind) => {
                                return (<option value={cf.value}>{cf.value}</option>)
                            })

                            }
                        </select>
                    </>
                }

                {value.type === 'text' &&
                    <>
                        <input type="text" name={value.questionId} placeholder={value.name}/>
                    </>
                }

                {value.type === 'area' &&
                    <>
                        <textarea name={value.questionId}>

                        </textarea>
                    </>
                }
                
                {value.type === 'radio' &&
                    <>
                        {value.values.map((cf, ind) => {
                            return (
                               <span>
                                <label>{cf.value}</label>
                                <input type="radio" name={value.questionId} onChange={this.changeSelection}/>
                                {cf.customFieldsSync &&
                                    <div className="conditionalCF" data-parent={value.questionId}>
                                        {
                                            this.getCustomField(cf.customFieldsSync[0], 1)
                                        }
                                    </div>
                                }
                               </ span> 
                            )
                        })

                        }
                    </>
                }

                {value.type === 'checkbox' &&
                    <span>
                        <input type="checkbox" name={value.questionId}/>
                    </span>
                }
            </article>
        )
    }

    render() {
        const { loading, redirect, data } = this.state;
        if(redirect) {
            return <Redirect to={redirect} />
        }
        return (
            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                } 

                <div className="header">
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                <div className="container">

                {data &&
                    <>
                        <div className="margin-top-70">
                            <small>{data.id}</small>
                            <h4>Modelo de formulario: {data.name}</h4>
                            <h6>{data.description}</h6>
                        </div>

                        <div className="formsOfMonitorings">
                            {data.parts &&
                                data.parts.map((v, i) => {
                                    return (
                                        <section key={i}>
                                            <h6>{v.name}</h6>
                                            {v.customFields &&
                                                v.customFields.map((val, index) => {
                                                    return this.getCustomField(val, index);
                                                })
                                            }
                                        </section>
                                    )
                                })
                            }
                        </div>
                    </>
                }
                </div>
            </>
        )
    }
}
