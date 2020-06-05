import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'

class SelectRoles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            groups: null,
            groupSelect: [],
            rolesToSend: this.props.defaultValue || ''
        };
    }

    handleInputChange = (value) => {

        this.setState({
            rolesToSend: value.value
        })
    };

    searchDefault() {
        if (this.state.groupSelect.length > 0 && this.props.defaultValue && this.state.rolesToSend === '') {
            let data = this.state.groupSelect.filter(value => {
                return value.value === this.props.defaultValue
            })
            return data
        } else if (this.state.rolesToSend) {
            let data = this.state.groupSelect.filter(value => {
                return value.value === this.state.rolesToSend
            })
            return data
        } else {
            return {
                label: "Seleccionar rol...",
                value: ""
            }
        }
    }

    componentDidMount() {
        let groupSelect = []
        axios.get(Global.frontUtilities)
            .then(response => {
                this.setState({
                    groups: response.data.Data.roles
                })

                this.state.groups.map(group => {
                    let temp = {
                        value: group.id,
                        label: group.role
                    }
                    groupSelect.push(temp)
                    return true;
                })

                this.setState({
                    groupSelect: groupSelect
                })
            })
            .catch(e => {
                console.log("Error: ", e)
            })
    }

    render() {
        let options = this.state.groupSelect
        this.props.getValue(this.state.rolesToSend)
        return (
            <Select
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
export default SelectRoles;
