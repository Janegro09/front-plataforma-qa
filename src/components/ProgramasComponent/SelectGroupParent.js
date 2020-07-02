import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

class SelectGroupParent extends Component {
    constructor(props) {
        super(props);
        console.log("Default: ", this.props)
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

    searchDefault() {
        /**Acá es donde se arma la lógica de los preseleccionados del select en caso de 
         * querer editar
         */
        let groupData = []
        if (this.state.groupSelect.length > 0 && this.props.defaultValue && this.state.groupsToSend === '') {
            this.state.groupSelect.map(value => {
                if (value.value === this.props.defaultValue.id) {
                    groupData.push(value)
                }
                return true;
            })
            return groupData
        } else if (this.state.groupsToSend) {
            let temp
            console.log("el que viene: ", this.state.groupsToSend)
            console.log("El error: ", this.state.groupSelect)

            this.state.groupSelect.map(value => {
                if (value.value === this.state.groupsToSend.value) {
                    groupData.push(value)
                }
                return true;
            })
            // temp = this.state.groupsToSend.split("|")
            // temp.map(v => {
            //     console.log(temp)
            //     this.state.groupSelect.map(value => {
            //         if (value.value === v) {
            //             groupData.push(value)
            //         }
            //         return true;
            //     })
            //     return true;
            // })
            // console.log("dasdadsa: ", groupData);

            return groupData
        } else {
            return {
                label: "Seleccionar usuarios...",
                value: ""
            }
        }


    }

    componentDidMount() {
        /**Acá se cargan las opciones */
        const { defaultValue } = this.props
        console.log("Default: ", defaultValue)
        let usuarios = []

        if (defaultValue.length) {
            defaultValue.map(value => {
                let temp = {
                    value: value.id,
                    label: `${value.name}`
                }
                usuarios.push(temp)
                console.log(value)
                return true;
            })
        } else {
            let temp = {
                value: defaultValue.id,
                label: `${defaultValue.name}`
            }
            usuarios.push(temp)
        }

        this.setState({
            groupSelect: usuarios
        })
    }

    render() {
        let options = this.state.groupSelect
        console.log("Options: ", options)
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
                value={this.searchDefault()}
            />
        );
    }
}
export default SelectGroupParent;
