import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from "../../helpers/Helpers";
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
        let permissions = []
        if (value !== null) {
            value.map(v => {
                if (v.value !== '') {
                    if (v.value === "addAll") {
                        this.state.groups.map(g => {
                            permissions.push(g._id)
                            return true
                        })
                    } else {
                        permissions.push(v.value)
                    }
                }
                return true;
            })
        }

        this.setState({
            groupsToSend: permissions
        })
    };

    searchDefault() {
        let groupData = []
        if (this.state.groupSelect.length > 0 && this.props.defaultValue && !this.state.groupsToSend) {
            let ids = []
            this.props.defaultValue.map(v => {
                ids.push(v._id)
                return true
            })
            ids.map(v => {
                this.state.groupSelect.map(value => {
                    if (value.value === v) {
                        groupData.push(value)
                    }
                    return true;
                })
                return true;
            })
            return groupData
        } else if (this.state.groupsToSend) {
            let temp
            temp = this.state.groupsToSend
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
                label: "Seleccionar permisos...",
                value: ""
            }
        }


    }

    componentDidMount() {
        let groupSelect = []
        axios.get(Global.permissions)
            .then(response => {
                this.setState({
                    groups: response.data.Data
                })

                groupSelect.push({
                    value: "addAll",
                    label: "Agregar todos"
                })

                this.state.groups.map(group => {
                    let temp = {
                        value: group._id,
                        label: HELPER_FUNCTIONS.namePermission(group.name)
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
                }
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
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
