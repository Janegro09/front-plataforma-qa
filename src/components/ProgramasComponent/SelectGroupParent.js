import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

class SelectGroupParent extends Component {
    constructor(props) {
        super(props);
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

    searchDefault = (value = undefined) => {
        /**Acá es donde se arma la lógica de los preseleccionados del select en caso de 
         * querer editar
         */
        console.log("El value: ", value)
        let returnData = {
            label: "Selecciona...",
            value: ''
        }
        
        if (this.state.especifico) {
            this.state.especifico.map(e => {
                if (e.value === this.props.defaultValue) {
                    returnData = e
                }
            })
        }

        if (value) {
            this.props.getData(value);
        }

        return returnData

    }

    componentDidMount() {
        /**Acá se cargan las opciones */
        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        
        axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            let arrayData = []
            response.data.Data.map(value => {
                let temp = {
                    label: value.name,
                    value: value.id
                }
                arrayData.push(temp)
            })

            this.setState({
                especifico: arrayData
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

    render() {
        /**En options debo listar todos los programas
         * 
         * en searchdefault debo buscar el especifico
         */
        let options = this.state.especifico
        console.log("LAS PROPS: ", this.props.defaultValue.programParent)
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
