import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import axios from 'axios'
import Global from '../../Global'
import swal from "sweetalert"

export default class deleteUserComponent extends Component {
    constructor(props) {
        super(props)
        console.log("Desde el constructor ", this.props.location.state.userSelected.id)
    }

    componentDidMount() {
        console.log("Componente delete lanzado!!");
        swal({
            title: "¿Estás seguro que queres borras el grupo?",
            text: "Una vez borrado, no podrás recuperarlo :(",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    let token = JSON.parse(localStorage.getItem('token'))
                    let id = this.props.location.state.userSelected.id
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };

                    axios.delete(Global.getGroups + '/' + id, config)
                        .then(response => {
                            console.log(response.data.Success)
                            localStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))

                            console.log("La response: ", response.data)
                            if (response.data.Success) {
                                swal("Genial! el grupo se ha eliminado correctamente", {
                                    icon: "success",
                                });
                            }
                        })
                        .catch(e => {
                            swal("Hubo un error al intentar borrar el grupo", {
                                icon: "error",
                            });
                            localStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                        })



                } else {
                    swal("Uffff, casi... el grupo no se ha eliminado");
                }
            });
    }

    render() {
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft />
                </div>
            </div>
        )
    }
}
