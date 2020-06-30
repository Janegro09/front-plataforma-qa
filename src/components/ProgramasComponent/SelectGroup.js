import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

class SelectGroup extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.defaultValue)
        this.state = {
            value: "",
            groups: null,
            groupSelect: [],
            groupsToSend: ""
        };
    }

    handleInputChange = (value) => {
        let contacatenada = ""

        if (value !== null) {
            value.map(v => {
                if (contacatenada === "") {
                    contacatenada += v.value
                } else {
                    contacatenada += `|${v.value}`
                }
                return true;
            })
        }

        this.setState({
            groupsToSend: contacatenada
        })
    };

    searchDefault() {
        let groupData = []
        if (this.state.groupSelect.length > 0 && this.props.defaultValue && this.state.groupsToSend === '') {
            this.props.defaultValue.map(v => {
                this.state.groupSelect.map(value => {
                    if (value.value === v.id) {
                        groupData.push(value)
                    }
                    return true;
                })
                return true;
            })
            return groupData
        } else if (this.state.groupsToSend) {
            let temp
            temp = this.state.groupsToSend.split("|")
            temp.map(v => {
                console.log(temp)
                this.state.groupSelect.map(value => {
                    if (value.value === v) {
                        groupData.push(value)
                    }
                    return true;
                })
                return true;
            })
            console.log("dasdadsa: ", groupData);

            return groupData
        } else {
            return {
                label: "Seleccionar usuarios...",
                value: ""
            }
        }


    }

    componentDidMount() {
        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getUsers, { headers: { Authorization: bearer } }).then(response => {
            let usuarios = []
            response.data.Data.map(user => {
                // console.log(user)
                let temp = {
                    value: user.idDB,
                    label: `${user.id} - ${user.name} ${user.lastName}`
                }
                usuarios.push(temp)
                return true;
            })

            console.log(usuarios)
            this.setState({
                groupSelect: usuarios
            })
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
        })
            .catch((e) => {
                console.log(e)
                // Si hay algún error en el request lo deslogueamos
                this.setState({
                    error: true,
                    redirect: true
                })
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {
        let options = this.state.groupSelect
        console.log("groups to send: ", this.state.groupsToSend.split('|'))
        this.props.getValue(this.state.groupsToSend.split('|'))
        return (
            <Select
                isMulti
                name="colors"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                closeMenuOnSelect={false}
                onChange={this.handleInputChange}
                inputValue={this.state.value}
                value={this.searchDefault()}
            />
        );
    }
}
export default SelectGroup;
