import React, { Component } from 'react'
import SidebarLeft from '../../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader'
import axios from 'axios'
import Global from '../../../Global'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'
import swal from 'sweetalert'
import moment from 'moment'
import Formulario from './FormularioCuartiles'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

export default class ModeloCuartiles extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: [],
            crearNuevo: false
        }
        
    }

    componentDidMount() {
        // newModel
        // Hacer rekest
        this.setState({
            loading: true
        })

        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.newModel, { headers: { Authorization: bearer } }).then(response => {
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let data = response.data.Data
            this.setState({
                loading: false,
                data
            })

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

    crearNuevo = (id = false) => {
        let crearNuevo = true;
        if (id !== false) {
            crearNuevo = id;
        }
        this.setState({ crearNuevo })
    }

    eliminarPlantilla = (id) => {
        swal({
            title: "Estas seguro?",
            text: "Estas por eliminar una plantilla, no podrá recuperarla",
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
                                swal("Felicidades!", "Plantilla eliminada correctamente", "success");
                                window.location.reload(window.location.href);
                            }

                        })
                        .catch(e => {
                            if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                                HELPER_FUNCTIONS.logout()
                            } else {
                                localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                                // swal("Error al eliminar!", {icon: "error",});
                                swal("Error al eliminar!", `${e.response.data.Message}`, "error");
                            }
                            console.log("Error: ", e)
                        })

                } else {
                    swal("No se elimino nada");
                }
            });

    }

    render() {
        let { data, loading, crearNuevo } = this.state
        return (
            <div>
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }

                {crearNuevo &&
                    <Formulario idModificate={crearNuevo} />
                }

                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SidebarLeft />
                    <UserAdminHeader />
                </div>

                <div className="section-content">
                <div className="flex-input-add input-add-spacebetween">
                        <h4 className="mr-2">MODELO DE CUARTIL</h4>
                        <div className="">
     
                            <button className="btnDefault" onClick={(e) => {
                                e.preventDefault();
                            }}>NUEVO MODELO</button>

                        </div>
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
                                        <tr key={modelo._id}>
                                            <td>{modelo.name}</td>
                                            <td> {moment(modelo.createdAt).format("DD/MM/YYYY")}</td>
                                            <td className="tableIcons"> <button onClick={(e) => {
                                                e.preventDefault();
                                                this.crearNuevo(modelo._id)
                                            }} className="celdaBtnHover"> <EditIcon style={{ fontSize: 15 }} /> </button> </td>
                                            <td className="tableIcons"> <button onClick={(e) => {
                                                e.preventDefault();
                                                this.eliminarPlantilla(modelo._id);
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