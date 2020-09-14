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
        data: null,
        responses: []
    }

    changeSelection = (e) => {
        e.preventDefault();
        const { name, value, parentNode } = e.target;
        let { responses } = this.state;
        const { question, section, parent } = e.target.dataset;

        const changeValue = ({id, value, parent}, object) => {
            // Buscar en object el padre y le agregamos un child
            if(object.id === parent) {
                object.child = {
                    id,
                    data: value
                }
                return object;
            } else if(object.child) {
                return changeValue({ id, value, parent }, object.child);
            } else{
                return false;
            }
        }

        if(!value && value !== '') return true;
        console.log(question, section, parent);

        let respIndex = responses.findIndex(elem => elem.section === section && elem.question === question);
        let q = false;
        if(respIndex !== -1) {
            q = responses[respIndex];
        }

        if(!q) {
            // Creamos la respuesta
            q = {
                section,
                question,
                response: {}
            }
        }

        if(!parent) {
            // Entonces significa que estamos respondiendo una pregunta padre
            q.response = { 
                data: value,
                id: name
            }
        } else if(respIndex !== -1) {
            // Entonces estamos contestando una pregunta hija

            let c = changeValue({ id: name, value, parent }, q.response);


            console.log('ccccc', c);
        } else return false;

        
        if(respIndex !== -1){
            responses[respIndex] = q;
        } else {
            responses.push(q);
        }
        this.setState({ responses });


        // question
        // let child = false;
        // let childsOfParentNode = parentNode.childNodes;
        // for(let c of childsOfParentNode) {
        //     const { classList, localName } = c;
        //     if(localName === 'div' && classList.contains('conditionalCF')){
        //         child = c;
        //     }
        // }

        // let rsp = responses.find(elem => elem.section === section && elem.question === question);

        // // Si cfid y question estan definidos entonces estamos hablando de la primera pregunta, si solo esta definido el cfid entonces estamos hblando de algun child
        // if(question && cfid) {
        //     // Entonces estamos hablando del response padre
        //     console.log('pregunta padre');
        //     if(!rsp) {
        //         rsp = {
        //             section,
        //             question,
        //             response: {
        //                 data: value
        //             }
        //         }
        //     } else {
        //         rsp.response = { data: value }
        //     }
        // }

        // console.log(question, section, cfid, value);
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

    getDefaultValue = (id, question, section) => {
        const { responses } = this.state;
        let q = responses.find(elem => elem.question === question && elem.section === section);

        const getById = (id, values) => {
            if(!values) return "";
            let valrtn = "";
            if(values.id && values.id === id) {
                valrtn = values.data
            } else if(values.child) {
                valrtn = getById(id, values.child);
            }

            return valrtn;
        }

        return getById(id, q?.response)
    }


    getCustomField = (value, sectionId) => {
        let index = (Date.now() * Math.random()).toString();

        let defaultValue = this.getDefaultValue(value.id ,value.questionId, sectionId);
        let childs = []
        return (
            <article key={index}>
                <p>{value.question || value.name}</p>
                
                {value.type === 'select' &&
                
                    <>
                        <select 
                            data-question={value.questionId} 
                            data-parent={value.parentId} 
                            data-section={sectionId} 
                            value={defaultValue}
                            name={value.id}
                            onChange={this.changeSelection}
                        >
                            <option>Selecciona...</option>
                            {value.values.map((cf, ind) => {
                                if(cf.customFieldsSync) {
                                    childs.push(cf.customFieldsSync[0])
                                }
                                
                                return (<option value={cf.value} key={ind}>{cf.value}</option>)


                            })


                            }
                        </select>
                        {childs.length > 0 &&
                            childs.map((cf, ind) => {
                                return (
                                    <div className="conditionalCF">
                                    {
                                        this.getCustomField({
                                            ...cf,
                                            questionId: value.questionId,
                                            parentId: value.id
                                            }, sectionId)
                                    }
                                    </div>)
                            } )

                        }
                    </>
                }

                {value.type === 'text' &&
                    <>      
                    <span>
                        <label>{value.name}</label>
                        <input 
                            type="text" 
                            placeholder={value.name}
                            data-section={sectionId} 
                            data-question={value.questionId} 
                            data-parent={value.parentId} 
                            onBlur={this.changeSelection}
                            name={value.id} 
                            defaultValue={defaultValue}
                            />
                    </span>
                    </>
                }

                {value.type === 'area' &&
                    <>
                        <span>
                            <label>{value.name}</label>
                            <textarea 
                                data-section={sectionId} 
                                data-question={value.questionId} 
                                data-parent={value.parentId} 
                                onBlur={this.changeSelection}
                                name={value.id} 
                                defaultValue={defaultValue}
                            >

                            </textarea>
                        </span>
                    </>
                }
                
                {value.type === 'radio' &&
                    <>
                        {value.values.map((cf, ind) => {
                            return (
                               <span>
                                    <label>{cf.value}</label>

                                    <input 
                                        type="radio" 
                                        checked={cf.value === defaultValue}
                                        value={cf.value} 
                                        name={value.id} 
                                        data-section={sectionId} 
                                        data-question={value.questionId} 
                                        data-parent={value.parentId} 
                                        onChange={this.changeSelection}
                                    />

                                    {cf.customFieldsSync &&
                                        <div className="conditionalCF">
                                            {
                                                this.getCustomField({
                                                    ...cf.customFieldsSync[0],
                                                    questionId: value.questionId,
                                                    parentId: value.id
                                                    }, sectionId)
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
                    <>
                        {value.values.map((cf, ind) => {
                            return (
                            <span>
                                    <label>{cf.value}</label>

                                    <input 
                                        type="checkbox" 
                                        checked={cf.value === defaultValue}
                                        value={cf.value} 
                                        name={value.id} 
                                        data-section={sectionId} 
                                        data-question={value.questionId} 
                                        data-parent={value.parentId} 
                                        onChange={this.changeSelection}
                                    />

                                    {cf.customFieldsSync &&
                                        <div className="conditionalCF">
                                            {
                                                this.getCustomField({
                                                    ...cf.customFieldsSync[0],
                                                    questionId: value.questionId,
                                                    parentId: value.id
                                                    }, sectionId)
                                            }
                                        </div>
                                    }
                            </ span> 
                            )
                        })

                        }
                    </>
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
                                                    return this.getCustomField(val, v.id);
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
