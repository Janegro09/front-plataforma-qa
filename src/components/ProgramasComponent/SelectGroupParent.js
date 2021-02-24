import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'

class SelectGroupParent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            groups: null,
            groupSelect: [],
            groupsToSend: "",
            especifico: null,
            modificado: null,
        };
    }

    handleInputChange = (value) => {
        
        /**Aca es donde se arma el array a enviar */
        this.props.getValue(value)
        this.setState({
            modificado: value
        })
    };


    searchDefault = (value = undefined) => {
        /**Acá es donde se arma la lógica de los preseleccionados del select en caso de 
         * querer editar
         */
        let returnData = {
            label: "Selecciona...",
            value: ''
        }
        if (this.state.especifico && !this.state.modificado) {
            this.state.especifico.map(e => {
                if (e.value === this.props.defaultValue) {
                    returnData = e
                }
                return true;
            })
        } else if (this.state.modificado) {
            returnData = this.state.modificado
        }
        return returnData

    }

    componentWillUnmount() {
        window.location.href = document.location.href;
    }

    componentDidMount() {
        /**Acá se cargan las opciones */
        let tokenUser = JSON.parse(localStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`

        axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

            let arrayData = []
            response.data.Data.map(value => {
                let temp = {
                    label: value.name,
                    value: value.id
                }
                arrayData.push(temp)
                return true;
            })

            this.setState({
                especifico: arrayData
            })
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
    }

    render() {
        /**En options debo listar todos los programas
         * 
         * en searchdefault debo buscar el especifico
         */
        let options = this.state.especifico

        // this.props.getValue(this.state.groupsToSend)
        return (
            <Select
                // isMulti
                name="colors"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                closeMenuOnSelect={true}
                onChange={this.handleInputChange}
                value={this.searchDefault()}
            />
        );
    }
}
export default SelectGroupParent;
