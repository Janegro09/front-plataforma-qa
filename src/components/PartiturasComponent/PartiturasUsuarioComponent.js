import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import axios from 'axios';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';
import Global from '../../Global';
import swal from 'sweetalert';
import moment from 'moment';
import './partitures.css';

export default class PartiturasUsuarioComponent extends Component {

    state = {
        loading: false,
        data: null
    }

    getUsersColumns() {
        let { data } = this.state;
        data = data ? data[0] : null;
        let users = data ? data.users[0] : null

        let ReturnData = {
            headers: [],
            rows: []
        }

        for (let th in users.rowFromPartiture) {
            const value = users.rowFromPartiture[th]
            ReturnData.headers.push(th)
            ReturnData.rows.push(value);
        }
        return (
            <table className="longXTable">
                <thead>
                    <tr>
                        <th>Estado</th>
                        <th>Improvment</th>
                        {ReturnData.headers.map((value, key) => {
                            return <th key={key}>{value}</th>
                        })

                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>January</td>
                        <td>$100</td>
                        {ReturnData.rows.map((value, key) => {
                            return <th key={key}>{value}</th>
                        })
                        }
                    </tr>
                </tbody>
            </table>
        )
    }

    componentDidMount() {
        let { id, idUsuario } = this.props.match.params;

        console.log("id: ", id);
        console.log("idUsuario: ", idUsuario);


        this.setState({
            loading: true
        });

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getAllPartitures + '/' + id + '/' + idUsuario, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            console.log(response.data.Data)
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
        let { data, TableUserHeader } = this.state;
        data = data ? data[0] : null;
        let users = data ? data.users[0] : null;

        return (
            <>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>
                {data &&
                    <div className="section-content">
                        <h2>Archivo actual</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fechas</th>
                                    <th>Nombre</th>
                                    <th>Estado de partitura</th>
                                    <th>Archivos incluídos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{moment(data.dates.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                                    <td>{data.name}</td>
                                    <td>{data.partitureStatus}</td>
                                    <td>{data.fileId.length}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2>Usuario actual</h2>
                        {this.getUsersColumns()}
                    </div>
                }

            </>
        )
    }
}
