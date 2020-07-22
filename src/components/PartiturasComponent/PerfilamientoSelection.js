import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'

export default class PerfilamientoSelection extends Component {

    state = {
        data: [],
        loading: false
    }

    async componentDidMount() {
        let { files } = this.props;
        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        let dataState = []

        this.setState({ loading: true });

        for (let i = 0; i < files.length; i++) {
            try {
                let resp = await axios.get(Global.getAllFiles + '/' + files[i] + '/perfilamiento', { headers: { Authorization: bearer } });
                token = resp.data.loggedUser.token;
                bearer = `Bearer ${token}`

                if (resp.data.Data) {
                    dataState.push({
                        "id": files[i],
                        "perfilamientos": resp.data.Data
                    })
                }
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

        sessionStorage.setItem("token", JSON.stringify(token));
        this.setState({
            data: dataState,
            loading: false
        });
    }

    render() {
        let { data, loading } = this.state;

        console.log("DATA: ", data);
        return (
            <>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                {data &&
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cluster</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map(r => {
                                    return r.perfilamientos.map((s, key) => {
                                        return (
                                            <tr key={key}>
                                                <td>{s.name}</td>
                                                <td>{r.id}</td>
                                                <td>
                                                    <button>
                                                        Agregar
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })

                                })
                            }

                        </tbody>
                    </table>
                }
            </>
        )
    }
}
