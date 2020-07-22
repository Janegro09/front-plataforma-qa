import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'

export default class InstancePartitureSelection extends Component {

    state = {
        loading: false,
        AllPartituresModel: null
    }

    async componentDidMount() {
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        try {
            let response = await axios.get(Global.getAllPartituresModel, { headers: { Authorization: bearer } })
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            console.log(response.data.Data);
            this.setState({
                AllPartituresModel: response.data.Data,
                loading: false
            })
        } catch (e) {
            // Si hay algún error en el request lo deslogueamos
            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                HELPER_FUNCTIONS.logout()
            } else {
                sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                this.setState({
                    loading: false
                })
                swal("Error!", "Hubo un problema", "error");
            }
            console.log("Error: ", e)
        }
    }

    render() {
        let { loading, AllPartituresModel } = this.state;

        return (
            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                {AllPartituresModel &&
                    <select>
                        {AllPartituresModel.map(partitureModel => {
                            console.log("Partiture model: ", partitureModel)
                            return <option value="" key={partitureModel.id}>{partitureModel.name}</option>
                        })}
                    </select>
                }
            </>
        )
    }
}
