import React, { Component } from 'react'
import axios from 'axios'
import Global from '../../Global'
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'

export default class PerfilamientoSelection extends Component {

    state = {
        data: [],
        perfilamientos: [],
        loading: false
    }

    aniadir = (fileId, name) => {
        this.setState(prevState => ({
            perfilamientos: [...prevState.perfilamientos, {
                fileId,
                name
            }]
        }))
    }

    eliminar = (fileId, name) => {
        let { perfilamientos } = this.state;

        if (perfilamientos.length > 1) {
            let c = perfilamientos.findIndex(e => e.fileId === fileId && e.name === name);
            if (c) {
                perfilamientos.splice(c, 1);
            }
        } else if (perfilamientos.length === 1) {
            perfilamientos = [];
        }


        this.setState({
            perfilamientos
        })
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
        let { data, loading, perfilamientos } = this.state;
        
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
                                                <td>{!perfilamientos.find(element => element.fileId === r.id && element.name === s.name) &&
                                                    <button disabled={s.partitura} onClick={(e) => {
                                                        e.preventDefault();
                                                        this.aniadir(r.id, s.name);
                                                    }}>
                                                        Agregar
                                                        </button>
                                                }
                                                    {perfilamientos.find(element => element.fileId === r.id && element.name === s.name) &&
                                                        <button disabled={s.partitura} onClick={(e) => {
                                                            e.preventDefault();
                                                            this.eliminar(r.id, s.name);
                                                        }}>
                                                            Eliminar
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })

                                })
                            }

                        </tbody>
                    </table>
                }

                <button className="buttonSiguiente"
                    onClick={(e) => {
                        e.preventDefault();
                        this.props.getData(perfilamientos);
                    }}
                >
                    Siguiente
                </button>
            </>
        )
    }
}
