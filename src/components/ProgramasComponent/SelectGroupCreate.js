import React, { Component } from "react";
import Select from "react-select";

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
        /**Acá se cargan las opciones */
        const { defaultValue } = this.props
        let usuarios = []
        defaultValue.map(value => {
            let temp = {
                value: value.id,
                label: `${value.id} - ${value.name}`
            }
            usuarios.push(temp)
            return true;
        })

        this.setState({
            groupSelect: usuarios
        })
    }

    render() {
        let options = this.state.groupSelect;
        this.props.getValue(this.state.groupsToSend);
        
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
