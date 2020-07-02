import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

class SelectGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            groups: null,
            groupSelect: [],
            groupsToSend: ""
        };
    }

    handleInputChange = (value) => {
        /**Aca es donde se arma el array a enviar */
        let contacatenada = []

        if (value !== null) {
            value.map(v => {
                contacatenada.push(v.value)
                return true;
            })
        }

        this.setState({
            groupsToSend: contacatenada
        })
    };

    componentDidMount() {
            let usuarios = []
            let tokenUser = JSON.parse(sessionStorage.getItem("token"))
            let token = tokenUser
            let bearer = `Bearer ${token}`
            axios.get(Global.getAllProgramsGroups, { headers: { Authorization: bearer } }).then(response => {
                const { Data } = response.data
                Data.map(grupo => {
                    let temp = {
                        value: grupo.id,
                        label: `${grupo.id} - ${grupo.name}`
                    }
                    usuarios.push(temp)
                    return true;
                })
                HELPER_FUNCTIONS.backgroundLoading()
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                
            })
                .catch((e) => {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    console.log("Error: ", e)
                });

                this.setState({
                    groupSelect: usuarios
                })
    }

    render() {
        let options = this.state.groupSelect
        this.props.end()
        // this.props.getValue(this.state.groupsToSend)
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
                />
        );
    }
}
export default SelectGroup;
