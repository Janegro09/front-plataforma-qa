import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'

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

        this.props.getValue(contacatenada)
    };

    componentDidMount() {
            let usuarios = []
            let tokenUser = JSON.parse(localStorage.getItem("token"))
            let token = tokenUser
            let bearer = `Bearer ${token}`
            axios.get(Global.getAllProgramsGroups, { headers: { Authorization: bearer } }).then(response => {
                localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                const { Data } = response.data
                Data.map(grupo => {
                    let temp = {
                        value: grupo.id,
                        label: `${grupo.id} - ${grupo.name}`
                    }
                    usuarios.push(temp)
                    return true;
                })
    
                this.props.end()
    
            })
                .catch((e) => {
                    if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                        HELPER_FUNCTIONS.logout()
                    } else {
                        localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        // swal("Error!", "Hubo un problema", "error");
                        swal("Error!", `${e.response.data.Message}`, "error");
                    }
                    console.log("Error: ", e)
                });
                this.setState({
                    groupSelect: usuarios
                })

    }

    render() {
        let options = this.state.groupSelect
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
            />
        );
    }
}
export default SelectGroup;
