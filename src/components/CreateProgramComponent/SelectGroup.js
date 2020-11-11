import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import {HELPER_FUNCTIONS} from '../../helpers/Helpers'

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

                this.state.groupSelect.map(value => {
                    if (value.value === v) {
                        groupData.push(value)
                    }
                    return true;
                })
                return true;
            })


            return groupData
        } else {
            return {
                label: "Seleccionar grupo...",
                value: ""
            }
        }


    }

    componentDidMount() {
        let groupSelect = []
        axios.get(Global.frontUtilities)
            .then(response => {
                this.setState({
                    groups: response.data.Data.groups
                })

                this.state.groups.map(group => {
                    let temp = {
                        value: group.id,
                        label: group.group
                    }
                    groupSelect.push(temp)
                    return true;
                })

                this.setState({
                    groupSelect: groupSelect
                })
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar el usuario", "error");
                }
                console.log("Error: ", e)
            })
    }

    render() {
        let options = this.state.groupSelect
        this.props.getValue(this.state.groupsToSend)
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
