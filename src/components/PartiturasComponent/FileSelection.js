import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import moment from 'moment'

export default class FileSelection extends Component {

    state = {
        data: null,
        dataFiltered: null,
        orderedData: null,
        loading: false,
        itemsToShow: 60,
        expanded: false,
        arrayToSend: []
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
        this.state.itemsToShow >= 50 ? (
            this.setState({ itemsToShow: this.state.itemsToShow + 10, expanded: true })
        ) : (
                this.setState({ itemsToShow: 6, expanded: false })
            )
    }

    filtrarTexto = () => {
        let { data } = this.state;
        let searchString = document.getElementById('searched').value.toLowerCase();

        let arrayData = []
        data.map(v => {
            if (v.name.toLowerCase().includes(searchString)) {
                arrayData.push(v)
            }
            return true;
        })

        this.setState({
            dataFiltered: arrayData
        })
    }

    agregar = (data) => {
        this.setState(prevState => ({
            arrayToSend: [...prevState.arrayToSend, data]
        }));
    }

    eliminar = (data) => {
        let { arrayToSend } = this.state;
        const index = arrayToSend.indexOf(data);
        if (index > -1) {
            arrayToSend.splice(index, 1);
        }
        this.setState({ arrayToSend });
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
                data: response.data.Data,
                dataFiltered: response.data.Data,
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
        let { data, dataFiltered, arrayToSend } = this.state;

        return (
            <>
                {data &&
                    <>
                        <input className="form-control" type="text" id="searched" onChange={this.filtrarTexto} />
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Programa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataFiltered.slice(0, this.state.itemsToShow).map(file => {
                                    return (
                                        <tr key={file.id}>
                                            <td>
                                                {!arrayToSend.includes(file.id) &&
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.agregar(file.id);
                                                        }}
                                                    >
                                                        Añadir
                                                    </button>
                                                }

                                                {arrayToSend.includes(file.id) &&
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.eliminar(file.id);
                                                        }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                }
                                            </td>
                                            <td>{file.name}</td>
                                            <td>{moment(file.date).format("DD/MM/YYYY")}</td>
                                            <td>{file.program ? file.program.name : '-'}</td>
                                        </tr>
                                    )
                                })

                                }

                            </tbody>
                        </table>
                        <div className="verMas">
                            <button
                                onClick={this.showMore}
                            >
                                Ver mas
                        </button>
                        </div>
                        <button className="buttonSiguiente"
                            onClick={(e) => {
                                e.preventDefault();
                                this.props.getData(arrayToSend);
                            }}
                        >
                            Siguiente
                        </button>
                    </>

                }
            </>
        )
    }
}
