import React, { Component } from 'react'
import SideBarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios';
import Global from '../../Global';
import swal from 'sweetalert';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers';

export default class PerfilamientoCuartilesComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nombreColumnas: null,
            result: [],
            dataFiltered: null
        }
    }

    buscar = () => {
        const { nombreColumnas } = this.state
        let searched = this.searched.value.toLowerCase()
        const result = nombreColumnas.filter(word => word.columnName.toLowerCase().includes(searched));

        this.setState({
            dataFiltered: result
        })
    }

    componentDidMount() {
        const { cuartilSeleccionado } = this.props.location;
        let id = cuartilSeleccionado.id;

        const tokenUser = JSON.parse(sessionStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`

        axios.get(Global.reasignProgram + '/' + id + '/columns', { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            const { Data } = response.data;
            this.setState({ nombreColumnas: Data, dataFiltered: Data });
        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }


    render() {
        const { nombreColumnas, dataFiltered } = this.state;

        return (
            <div>
                <SideBarLeft />
                <input type="text" placeholder="Buscar" ref={(c) => this.searched = c} onChange={this.buscar} />
                {nombreColumnas &&
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Rango [MIN-MAX]</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataFiltered.map((columna, key) => {
                                if (columna.VMax !== 0) {
                                    return (
                                        <tr key={key}>
                                            <td>{columna.columnName}</td>
                                            <td>{`[${columna.VMin} - ${columna.VMax}]`}</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}
