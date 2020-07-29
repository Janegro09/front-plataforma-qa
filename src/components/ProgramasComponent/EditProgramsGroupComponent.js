import React, { Component } from 'react'
import SelectGroup from './SelectGroup'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import axios from 'axios'
import swal from 'sweetalert'

export default class EditProgramsGroupComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            specific: [],
            loading: false,
            editProgramGroup: true
        }
    }
    
    addUser = (event) => {
        event.preventDefault()
        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = {
            name: this.name.value,
            description: this.description.value,
            usersAssign: this.usersAssign
        }

        this.setState({
            loading: true
        })
        let id = this.props.edit.id
        axios.put(
            Global.getAllProgramsGroups + '/' + id,
            bodyParameters,
            config
        ).then(response => {
            sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
            this.setState({
                loading: false
            })
            swal("Grupo de programas editado!", "Ya se encuentra registrado", "success")
                .then((value) => {
                    if (value) {
                        window.location.reload(window.location.href)
                    }
                });
        }).catch(e => {
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                this.setState({
                    loading: false
                })
                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                swal("Error!", "Hubo un problema", "error");
            }
            console.log("Error: ", e)
        });


    }

    componentDidMount() {
        const id = this.props.edit.id
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        this.setState({
            loading: true
        })

        axios.get(Global.getAllProgramsGroups + '/' + id, { headers: { Authorization: bearer } }).then(response => {
            if (response.data.Data[0].assignedUsers.length > 0) {
                this.setState({
                    loading: false,
                    specific: response.data.Data[0].assignedUsers
                })
            } else {
                this.setState({ loading: false });
            }
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    this.setState({
                        error: true,
                        redirect: true,
                        loading: false
                    })
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }
    render() {
        const { edit } = this.props
        const { specific, editProgramGroup } = this.state

        if (!editProgramGroup) {
            window.location.reload(window.location.href);
        }

        return (
            <div>
                {this.state.loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                {HELPER_FUNCTIONS.checkPermission("GET|programs/groups/:id") &&
                    <div className="table-parent-edit">
                        <form onSubmit={this.addUser} className="inputsEditUser addUserPadding">
                            <span className="Label">Nombre</span>
                            <input className="form-control" type="text" placeholder="" ref={(c) => this.name = c} defaultValue={edit.name ? edit.name : ''} />
                            <span className="Label">Descripción</span>
                            <input className="form-control" type="text" placeholder="" ref={(c) => this.description = c} defaultValue={edit.description ? edit.description : ''} />
                            <span className="Label">Usuarios asignados</span>
                            {/* enviar defaultValue={user.group ? user.group : ''}  */}
                            <SelectGroup getValue={(c) => this.usersAssign = c} defaultValue={specific ? specific : ''} idGroup={edit.id} />
                            <button className="btn btn-block btn-info ripple-effect confirmar" type="submit" name="Submit" alt="sign in">Editar Grupo de Programas</button>
                        </form>
                        <button
                            onClick={() => {
                                this.setState({
                                    editProgramGroup: false
                                })
                            }}
                        >Cancelar</button>
                    </div>
                }

            </div>
        )
    }
}
