import React, { Component } from 'react';
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader';
import Global from '../../../Global';
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers';
import swal from 'sweetalert';
import './Modal.css';
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
        const { value } = e.target;
        let { responses } = this.state;
        const { question, section, parent, id } = e.target.dataset;

        const changeValue = ({ id, value, parent }, object) => {
            // Buscar en object el padre y le agregamos un child
            if (object.id === parent) {
                object.child = {
                    id,
                    data: value
                }
                return object;
            } else if (object.child) {
                return changeValue({ id, value, parent }, object.child);
            } else {
                return false;
            }
        }

        if (!value && value !== '') return true;

        let respIndex = responses.findIndex(elem => elem.section === section && elem.question === question);
        let q = false;
        if (respIndex !== -1) {
            q = responses[respIndex];
        }

        if (!q) {
            // Creamos la respuesta
            q = {
                section,
                question,
                response: {}
            }
        }

        if (!parent) {
            // Entonces significa que estamos respondiendo una pregunta padre
            q.response = {
                data: value,
                id
            }
        } else if (respIndex !== -1) {
            // Entonces estamos contestando una pregunta hija
            changeValue({ id, value, parent }, q.response);

        } else return false;


        if (respIndex !== -1) {
            responses[respIndex] = q;
        } else {
            responses.push(q);
        }
        this.setState({ responses });
    }

    componentDidMount = () => {
        const { id } = this.props.match.params;

        // Hacemos el request para ver el formmulario

        this.setState({
            loading: true
        })

        let tokenUser = JSON.parse(localStorage.getItem("token"));
        let token = tokenUser;
        let bearer = `Bearer ${token}`;


        axios.get(Global.newFormModel + '/' + id, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            // ACÁ VAN A QUEDAR LAS DE M
            if (response.data.Data.length === 0) {
                this.setState({ redirect: '/administracion-formularios/modelo-formularios' })
            } else {
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
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
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
            if (!values) return "";
            let valrtn = "";
            if (values.id && values.id === id) {
                valrtn = values.data
            } else if (values.child) {
                valrtn = getById(id, values.child);
            }

            return valrtn;
        }

        return getById(id, q?.response)
    }


    getCustomField = (value, sectionId) => {
        let index = (Date.now() * Math.random()).toString();

        let defaultValue = this.getDefaultValue(value.id, value.questionId, sectionId);
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
                            data-id={value.id}
                            onChange={this.changeSelection}
                        >
                            <option>Selecciona...</option>
                            {value.values.map((cf, ind) => {
                                if (cf.customFieldsSync) {
                                    childs.push({...cf.customFieldsSync[0], parentValue: cf.value})
                                }

                                return (<option value={cf.value} key={ind}>{cf.value}</option>)


                            })


                            }
                        </select>
                        {childs.length > 0 &&
                            childs.map((cf, ind) => {
                                return (
                                    <div className={cf.parentValue === defaultValue ? "conditionalCF active" : "conditionalCF"}>
                                        {
                                            this.getCustomField({
                                                ...cf,
                                                questionId: value.questionId,
                                                parentId: value.id
                                            }, sectionId)
                                        }
                                    </div>)
                            })

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
                                data-id={value.id}
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
                                data-id={value.id}
                                defaultValue={defaultValue}
                            >

                            </textarea>
                        </span>
                    </>
                }

                {value.type === 'radio' &&
                    <>
                        {value.values.map(cf => {
                            return (
                                <span key={cf.value}>
                                    <label>

                                    <input
                                        type="radio"
                                        checked={cf.value === defaultValue}
                                        value={cf.value}
                                        name={sectionId+value.questionId+value.id+index}
                                        data-section={sectionId}
                                        data-id={value.id}
                                        data-question={value.questionId}
                                        data-parent={value.parentId}
                                        onChange={this.changeSelection}
                                    />
                                    {cf.value}</label>

                                    {cf.customFieldsSync &&
                                        <div className={cf.value === defaultValue ? "conditionalCF active" : "conditionalCF"}>
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
                        {value.values.map(cf => {
                            return (
                                <span key={cf.value}>
                                    <label>
                                    <input
                                        type="checkbox"
                                        checked={cf.value === defaultValue}
                                        value={cf.value}
                                        name={sectionId+value.questionId+value.id+index}
                                        data-section={sectionId}
                                        data-id={value.id}
                                        data-question={value.questionId}
                                        data-parent={value.parentId}
                                        onChange={this.changeSelection}
                                    />
                                    {cf.value}</label>

                                    {cf.customFieldsSync &&
                                        <div className={cf.value === defaultValue ? "conditionalCF active" : "conditionalCF"}>
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
        if (redirect) {
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
