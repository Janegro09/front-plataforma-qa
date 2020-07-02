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
        /**Aca es donde se arma el array a enviar */
        this.setState({
            groupsToSend: value
        })
    };

    componentDidMount() {
        /**Acá se cargan las opciones */
        const { defaultValue } = this.props
        console.log("Default: ", defaultValue)
        let usuarios = []
        defaultValue.map(value => {
            let temp = {
                value: value.id,
                label: `${value.id} - ${value.name}`
            }
            usuarios.push(temp)
            console.log(value)
            return true;
        })

        this.setState({
            groupSelect: usuarios
        })
    }

    render() {
        let options = this.state.groupSelect
        this.props.getValue(this.state.groupsToSend)
        return (
            <Select
                // isMulti
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
