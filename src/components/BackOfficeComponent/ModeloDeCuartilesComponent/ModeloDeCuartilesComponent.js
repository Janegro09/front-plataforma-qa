import React, { Component } from 'react'
import SidebarLeft from '../../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader'
import axios from 'axios'
import Global from '../../../Global'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import moment from 'moment'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { Redirect } from 'react-router-dom';

export default class ModeloDePartiturasComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            loading: false,
            abrirEditor: false,
            idModel: false
        }
    }

    eliminarModelo = (id) => {
        console.log(id);
        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar un Modelo, no podrá recuperarlo.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let token = JSON.parse(localStorage.getItem('token'))
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    axios.delete(Global.newModel + "/" + id, config)
                        .then(response => {
                            localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                            if (response.data.Success) {
                                swal("Felicidades!", "Modelo eliminado correctamente", "success");
                                window.location.reload(window.location.href);
                            }

                        })
                        .catch(e => {
                            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                HELPER_FUNCTIONS.logout()
                            } else {
                                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                // swal("Error al eliminar!", {icon: "error",});
                                swal("Error!", `${e.response.data.Message}`, "error");

                            }
                            console.log("Error: ", e)
                        })

                } else {
                    swal("No se elimino nada");
                }
            });

    }

    editarModelo = (id = false) => {
        let abrirEditor = true;
        let idModel = false;
        if (id !== false) {
            idModel = id;
        }
        this.setState({ abrirEditor, idModel })
    }

    componentDidMount() {
        // Hacer rekest
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.newModel, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            this.setState({
                loading: false
            })
            let data = response.data.Data
            this.setState({ data })

        })
            .catch((e) => {
                // Si hay algún error en el request lo deslogueamos
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        loading: false
                    })
                    // swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });

    }

    render() {
        let { data, abrirEditor, idModel, loading } = this.state
        
        if (abrirEditor) {
            if(idModel){
                return <Redirect
                    to={`/modelo-de-cuartiles/${idModel}`}
                />;
            } else {
                return <Redirect
                    to={`/modelo-de-cuartiles/crear`}
                />;
            }
        }
        return (
            <div>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SidebarLeft />
                    <UserAdminHeader />
                </div>

                <div className="section-content">
                    <div className="flex-input-add input-add-spacebetween">
                        <h4 className="mr-2">MODELOS DE CUARTILES</h4>
                    </div>
                    <hr />
                    <br />
                    {data &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Fecha de creación</th>
                                    <th className="tableIcons">Editar</th>
                                    <th className="tableIcons">Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((modelo, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{modelo.name}</td>
                                            <td> {moment(modelo.createdAt).format("DD/MM/YYYY")}</td>
                                            <td className="tableIcons"> <button onClick={(e) => {
                                                e.preventDefault();
                                                this.editarModelo(modelo._id)
                                            }} className="celdaBtnHover"> <EditIcon style={{ fontSize: 15 }} /> </button> </td>
                                            <td className="tableIcons"> <button onClick={(e) => {
                                                e.preventDefault();
                                                this.eliminarModelo(modelo._id);
                                            }} className="celdaBtnHover"> <DeleteIcon style={{ fontSize: 15 }} /> </button> </td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        )
    }
}
