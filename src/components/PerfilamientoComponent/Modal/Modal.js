import React, { Component } from 'react'
import './Modal.css'
import axios from 'axios'
import Global from '../../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

export default class Modal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            allPrograms: null,
            programsFiltered: null
        }
    }

    cerrarModal = () => {
        document.getElementById("modal-casero").style.display = "none";
        window.location.reload(window.location.href);
    }

    buscar = () => {
        const { allPrograms } = this.state
        let searched = this.searched.value.toLowerCase()
        const result = allPrograms.filter(word => word.name.toLowerCase().includes(searched));

        this.setState({
            programsFiltered: result
        })
    }

    enviarPrograma = (programa) => {
        let id = programa.id;
        const { idFile } = this.props
        let token = JSON.parse(sessionStorage.getItem('token'))
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const bodyParameters = {
            program: id
        }

        axios.put(Global.reasignProgram + "/" + idFile, bodyParameters, config)
            .then(response => {
                sessionStorage.setItem('token', JSON.stringify(response.data.loggedUser.token))
                swal("Felicidades!", "Has reasignado el programa", "success").then(() => {
                    this.cerrarModal()
                })
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Atención!", "No has cambiado nada", "info");
                }
                console.log("Error: ", e)
            })
    }

    componentDidMount() {
        let tokenUser = JSON.parse(sessionStorage.getItem("token"))
        let token = tokenUser
        let bearer = `Bearer ${token}`
        this.setState({
            loading: true
        })
        axios.get(Global.getAllPrograms, { headers: { Authorization: bearer } }).then(response => {
            sessionStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
            let losP = response.data.Data.filter(data => data.section === 'P');

            this.setState({
                allPrograms: losP,
                programsFiltered: losP,
                loading: false
            })


        })
            .catch((e) => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    this.setState({
                        loading: false
                    })
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema", "error");
                }
                console.log("Error: ", e)
            });
    }

    render() {
        const { programsFiltered, loading, allPrograms } = this.state;
        let assignedPrograms = [];
        let arrayDiv = [];

        if (allPrograms) {

            const data = programsFiltered.filter(program => {
                if (this.title) {
                    if (this.title.value === '' || this.title.value === null) {
                        return true;
                    } else {
                        return (program.name.toUpperCase().indexOf(this.title.value.toUpperCase()) >= 0);
                    }
                } else {
                    return true;
                }

            })

            for (let index = 0; index < data.length; index++) {
                if (assignedPrograms.indexOf(data[index].id) >= 0 || data[index].programParent !== '') {
                    continue
                }

                let rows = []
                let tempData = (
                    <tr key={index}>
                        <td>{data[index].name}</td>
                        <td><button onClick={
                            (e) => {
                                e.preventDefault()
                                this.enviarPrograma(data[index])
                            }
                        }>Asignar</button></td>
                    </tr>
                )

                rows.push(tempData)
                for (let j = 0; j < data.length; j++) {

                    if (data[j].programParent === data[index].id) {

                        let tempData = (
                            <tr key={index + 1 + j}>
                                <td><SubdirectoryArrowRightIcon className="ArrowRightIcon" /> {data[j].name}</td>
                                <td><button onClick={
                                    (e) => {
                                        e.preventDefault()
                                        this.enviarPrograma(data[j])
                                    }
                                }>Asignar</button></td>
                            </tr>
                        )

                        rows.push(tempData)
                        assignedPrograms.push(data[j].id)


                        for (let k = 0; k < data.length; k++) {

                            if (data[j].id === data[k].programParent) {
                                let tempData = (
                                    <tr key={index + 3 + k}>
                                        <td><SubdirectoryArrowRightIcon className="marginArrow ArrowRightIcon" /> {data[k].name}</td>
                                        <td><button onClick={
                                            (e) => {
                                                e.preventDefault()
                                                this.enviarPrograma(data[k])
                                            }
                                        }>Asignar</button></td>
                                    </tr>
                                )

                                rows.push(tempData)
                                assignedPrograms.push(data[k].id)
                            }
                        }
                    }

                }

                arrayDiv.push(rows)
                assignedPrograms.push(data[index].id)
            }
        }

        return (
            <div className="modal" id="modal-casero">
                {loading &&
                    HELPER_FUNCTIONS.backgroundLoading()
                }
                <div className="hijo">
                    <div className="boton-cerrar">
                        <button onClick={
                            (e) => {
                                e.preventDefault()
                                this.cerrarModal()
                            }
                        }>x</button>
                    </div>


                    <input className="form-control form-control-modal" type="text" placeholder="Buscar" ref={(c) => this.searched = c} onChange={this.buscar} />

                    <table cellSpacing="0">

                        {this.state.allUsers === null &&
                            <div className="sk-fading-circle">
                                <div className="sk-circle1 sk-circle"></div>
                                <div className="sk-circle2 sk-circle"></div>
                                <div className="sk-circle3 sk-circle"></div>
                                <div className="sk-circle4 sk-circle"></div>
                                <div className="sk-circle5 sk-circle"></div>
                                <div className="sk-circle6 sk-circle"></div>
                                <div className="sk-circle7 sk-circle"></div>
                                <div className="sk-circle8 sk-circle"></div>
                                <div className="sk-circle9 sk-circle"></div>
                                <div className="sk-circle10 sk-circle"></div>
                                <div className="sk-circle11 sk-while (true) {
                                                        <h1>Hola</h1>
                                                    }circle"></div>
                                <div className="sk-circle12 sk-circle"></div>
                            </div>
                        }



                        <thead className="encabezadoTabla">
                            <tr>

                                <th>Nombre</th>
                                <th className="tableIcons">Asignar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {arrayDiv.length > 0 &&
                                arrayDiv.map(data => {
                                    data.map(row => {
                                        return row;
                                    })
                                    return data;
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
