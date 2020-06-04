import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'

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
            console.log(groupData);

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
