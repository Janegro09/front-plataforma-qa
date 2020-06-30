import React, { Component } from 'react'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import axios from 'axios';
import Global from '../../Global';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import swal from 'sweetalert'
import { Redirect } from 'react-router-dom'

export default class ProgramsGroupComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            programs: null,
            searchedGroups: null,
            actualPage: 1,
            grupoBorrado: false,
            crearGrupoProgramas: false,
            editProgramGroup: false
        }
        this.buscar = this.buscar.bind(this);
        this.getUsersPage = this.getUsersPage.bind(this);
        this.editGroup = this.editGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.createGroupProgram = this.createGroupProgram.bind(this);
    }

    buscar() {
        let searched
        if (this.title && this.title !== undefined) {
            searched = this.title.value.toUpperCase()
        }
        console.log(searched);
        let returnData = []

        if (this.state.allGroups) {

            this.state.allGroups.map(group => {
                // console.log("a: ", group)
                if (searched !== undefined) {
                    group.name = group.name.toUpperCase()
                    if (group.name.indexOf(searched) >= 0) {
                        returnData.push(group)
                    }
                } else {
                    returnData.push(group)
                }
                return true
            })

            console.log("La data: ", returnData);
            this.setState({
                searchedGroups: returnData,
                actualPage: 1
            })
        }

    }

    getUsersPage(page, allGroups) {
        let total = []
        let cantOfPages = 0
        if (allGroups !== null) {
            const cantPerPage = 25
            cantOfPages = Math.ceil(allGroups.length / cantPerPage)

            let index = (page - 1) * cantPerPage
            let acum = index + cantPerPage
            if (acum > allGroups.length) {
                acum = allGroups.length
            }
            while (index < acum) {
                total.push(allGroups[index])
                index++
            }
        }
        return {
            total: total,
            cantOfPages: cantOfPages
        }
    }

    editGroup(event, userInfo) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        console.log(userInfo)
        this.setState({
            editProgramGroup: true,
            userSelected: userInfo
        })

    }

    createGroupProgram(e) {
        e.preventDefault()
        this.setState({
            crearGrupoProgramas: true
        })
    }

    deleteGroup(event, userInfo) {
        // Cargo en el estado la información del usuario seleccionado
        event.preventDefault()
        swal({
            title: "Estás seguro?",
            text: "Una vez borrado el grupo, no podrás recuperarlo!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const tokenUser = JSON.parse(sessionStorage.getItem("token"))
                    const token = tokenUser
                    const bearer = `Bearer ${token}`
                    axios.delete(Global.getAllProgramsGroups + '/' + userInfo.id, { headers: { Authorization: bearer } }).then(response => {
                        sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
                        this.setState({
                            grupoBorrado: true
                        })
                        swal("El grupo ha sido eliminado!", {
                            icon: "success",
                        });
                    })
                } else {
                    swal("No has cambiado nada!");
                }
            });
        // console.log(userInfo)
        // this.setState({
        //     deleteUser: true,
        //     userSelected: userInfo
        // })

    }

    componentDidMount() {
        // console.log("La prop: ", this.props)
        const { ok } = this.props
        /**Se le agrega delay de 1 seg para que no se pise el token con el request de programas */
        if (ok) {
            const tokenUser = JSON.parse(sessionStorage.getItem("token"))
            const token = tokenUser
            const bearer = `Bearer ${token}`
            axios.get(Global.getAllProgramsGroups, { headers: { Authorization: bearer } }).then(response => {
                this.setState({
                    searchedGroups: response.data.Data
                })
                sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));

                // console.log("El token en grupos: ", JSON.parse(sessionStorage.getItem('token')))
                // this.buscar()
            })
                .catch((e) => {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    this.setState({
                        searchedGroups: []
                    })
                    console.log("Error: ", e)
                });
        }
    }

    render() {
        const allGroups = this.state.searchedGroups
        let pagina = this.getUsersPage(this.state.actualPage, allGroups)
        let totalUsuarios = pagina.total

        if (this.state.grupoBorrado) {
            return <Redirect to={'/programas'} />
        }

        if (this.state.crearGrupoProgramas) {
            return <Redirect to={'/crearGrupoProgramas'} />
        }

        if (this.state.editProgramGroup) {
            return <Redirect to={{
                pathname: '/editarGrupoProgramas',
                state: this.state.userSelected
            }} />
        }


        return (
            <div>
                <div className="flex-input-add">
                    {/* Buscador */}
                    {/* {HELPER_FUNCTIONS.checkPermission("GET|groups/:id") && */}
                    <input
                        className="form-control"
                        type="text"
                        ref={(c) => {
                            this.title = c
                        }}
                        placeholder="Buscar grupo de programa"
                        onChange={this.buscar}
                    />
                    {/* } */}

                    {/* {HELPER_FUNCTIONS.checkPermission("POST|groups/new") && */}
                    <button onClick={e => this.createGroupProgram(e)}><GroupAddIcon style={{ fontSize: 33 }} /></button>
                    {/* } */}



                    {/* {this.state.error && */}
                    {/* <h1>Hubo un error en la búsqueda, inténtalo más tarde</h1> */}
                    {/* // } */}
                </div>
                <table cellSpacing="0">
                    <thead className="encabezadoTabla">
                        <tr>
                            <th>Nombre</th>
                            <th className="tableIcons">Editar</th>
                            <th className="tableIcons">Eliminar</th>
                        </tr>
                    </thead>

                    <tbody>
                        {totalUsuarios &&

                            totalUsuarios.map((group, index) => {

                                return (
                                    <tr key={index}>

                                        <td>{group.name}</td>
                                        {HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") &&
                                            <td onClick={e => this.editGroup(e, group)}><EditIcon style={{ fontSize: 15 }} /></td>
                                        }
                                        {!HELPER_FUNCTIONS.checkPermission("PUT|groups/:id") &&
                                            <td disabled><EditIcon></EditIcon></td>
                                        }
                                        {HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") &&
                                            <td onClick={e => this.deleteGroup(e, group)}><DeleteIcon style={{ fontSize: 15 }} /></td>
                                        }
                                        {!HELPER_FUNCTIONS.checkPermission("DELETE|groups/:id") &&
                                            <td disabled><DeleteIcon></DeleteIcon></td>
                                        }

                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
