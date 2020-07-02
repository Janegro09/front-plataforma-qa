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
            groupsToSend: "",
            especifico: null
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
        if (this.state.groupSelect.length > 0 && this.props.defaultValue && this.state.groupsToSend === '' && this.props.data) {
            this.state.groupSelect.map(value => {
                console.log("value: ", value)
                console.log("la prop: ", this.props.defaultValue)
                if (value.value === this.props.defaultValue.id) {
                    groupData.push(value)
                }
                return true;
            })

            // Acá tengo que meter el especifico, debo lograr este resultado (conviene mandarlo como prop?)
            // groupData.push({
            //     label: "test",
            //     value: "5efd75db4c5dc9339f273a28"
            // });

            if (this.state.especifico) {
                groupData.push({
                    label: this.state.especifico.label,
                    value: this.state.especifico.value
                });
            }

            return groupData
        } else if (this.state.groupsToSend) {
            let temp
            console.log("el que viene: ", this.state.groupsToSend)
            console.log("El error: ", this.state.groupSelect)

            this.state.groupSelect.map(value => {
                console.log("value: ", value)
                if (value.value === this.state.groupsToSend.value) {
                    groupData.push(value)
                }
                return true;
            })

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


        if (this.props.data) {
            // Request para especifico
            let tokenUser = JSON.parse(sessionStorage.getItem("token"))
            let token = tokenUser
            let bearer = `Bearer ${token}`
    
            console.log("EL QUE TENGOOO: ", this.props.data)
            
            axios.get(Global.getAllPrograms+'/'+this.props.data.programParent, { headers: { Authorization: bearer } }).then(response => {
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                console.log("ESPECIFICOOOO: ", response.data.Data)
                // this.setState({
                //     allPrograms: response.data.Data,
                //     ok: true
                // })
                // groupData.push({
                //     label: "test",
                //     value: "5efd75db4c5dc9339f273a28"
                // });
    
                this.setState({
                    especifico: {
                        label: response.data.Data[0].name,
                        value: response.data.Data[0].id
                    }
                })
            })
                .catch((e) => {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    // this.setState({
                    //     allPrograms: [],
                    //     ok: true
                    // })
                    console.log("Error: ", e)
                });
        }
    }

    render() {
        /**En options debo listar todos los programas
         * 
         * en searchdefault debo buscar el especifico
         */
        let options = this.state.groupSelect
        console.log("Options: ", this.state)
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
