import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import moment from 'moment'

export default class FileSelection extends Component {

    state = {
        data: null,
        orderedData: null,
        loading: false,
        itemsToShow: 15,
        expanded: false
    }

    dynamicSort = (property) => {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return (a, b) => {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    ascDesc = (field) => {
        let { data } = this.state
        let dataOrdenada = data.sort(this.dynamicSort(field));
        this.setState({
            orderedData: dataOrdenada
        })
    }

    showMore = () => {
        this.state.itemsToShow >= 15 ? (
            this.setState({ itemsToShow: this.state.itemsToShow + 10, expanded: true })
        ) : (
                this.setState({ itemsToShow: 15, expanded: false })
            )
    }

    componentDidMount() {
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllFiles, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false,
                data: response.data.Data
            })

        })
            .catch((e) => {
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
            });
    }
    render() {
        let { loading, data, itemsToShow } = this.state;

        return (
            <>
                {data &&
                    <>
                        <button
                            onClick={this.showMore}
                        >
                            Ver mas
                        </button>

                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Programa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, this.state.itemsToShow).map(file => {
                                    return (
                                        <tr key={file.id}>
                                            <td>{file.name}</td>
                                            <td>{moment(file.date).format("DD/MM/YYYY")}</td>
                                            <td>{file.program ? file.program.name : '-'}</td>
                                        </tr>
                                    )
                                })

                                }

                            </tbody>
                        </table>
                    </>

                }
            </>
        )
    }
}
