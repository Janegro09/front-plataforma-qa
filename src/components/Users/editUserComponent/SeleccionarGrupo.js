import React, { Component } from 'react';
import axios from 'axios'
import Global from '../../../Global'
import swal from 'sweetalert'
import { HELPER_FUNCTIONS } from '../../../helpers/Helpers'


export default class SeleccionarGrupo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            groups: null,
            groupSelect: [],
            groupsToSend: "",
            valueInput: "",
            groupsToShow: 10,
            allSelected: false,
            seleccionados: []
        };
    }

    buscar = (event) => {
        const valueInput = event.target.value.toUpperCase().trim();
        this.setState({ valueInput });
    }

    handleClick = () => {
        this.setState(prevState => {
            return { groupsToShow: prevState.groupsToShow + 5 }
        });

        /**
         * Se utiliza para no hacer doble click ya que al cargar más elementos 
         * en la lista pierde el foco del botón
         */
        document.getElementById('ver-mas').focus();
    }

    handleClickAddAll = () => {
        const { groupSelect, allSelected } = this.state;
        let groupsToSend = '';

        for (let i = 0; i < groupSelect.length; i++) {
            groupsToSend += `${groupSelect[i].value}|`
        }

        groupsToSend = groupsToSend.substring(0, groupsToSend.length - 1);
        this.setState({ groupsToSend, allSelected: !allSelected });

        document.getElementById('agregar-todos').focus();
        document.getElementById('agregar-todos').click();
    }

    agregarGrupo = (grupo) => {
        let id = grupo.value;
        let { groupsToSend, seleccionados } = this.state;

        seleccionados.push(grupo.label);

        if (groupsToSend === '') {
            groupsToSend += `${id}`;
        } else {
            groupsToSend += `|${id}`;
        }

        this.setState({ groupsToSend, seleccionados })
        document.getElementById('agregar-uno').focus();
    }

    quitarGrupo = (grupo) => {
        let nombre = grupo.label;
        let id = grupo.value;

        let { groupsToSend, seleccionados } = this.state;

        groupsToSend = groupsToSend.replace(id, '');

        const index = seleccionados.indexOf(nombre);
        if (index > -1) {
            seleccionados.splice(index, 1);
        }

        this.setState({ groupsToSend, seleccionados });
    }

    componentDidMount() {
        let groupSelect = []
        axios.get(Global.frontUtilities)
            .then(response => {
                // levanto el default value: 
                let { defaultValue } = this.props;
                let { groupsToSend, seleccionados } = this.state;

                defaultValue.map(value => {
                    groupsToSend += `${value.id}|`;
                    seleccionados.push(value.name);
                    return true;
                })

                // se quita el último caracter del string (que es |)
                groupsToSend = groupsToSend.substring(0, groupsToSend.length - 1);

                this.setState({
                    groups: response.data.Data.groups,
                    groupsToSend,
                    seleccionados
                })

                this.state.groups.map(group => {
                    let temp = {
                        value: group.id,
                        label: group.group
                    }
                    groupSelect.push(temp)
                    return true;
                })

                this.setState({
                    groupSelect: groupSelect
                })
            })
            .catch(e => {
                if (!e.response.data.Success && e.response.data.HttpCodeResponse === 401) {
                    HELPER_FUNCTIONS.logout()
                } else {
                    sessionStorage.setItem('token', JSON.stringify(e.response.data.loggedUser.token))
                    swal("Error!", "Hubo un problema al agregar el usuario", "error");
                }
                console.log("Error: ", e)
            })
    }

    render() {
        const { groupSelect, groupsToShow, valueInput, allSelected, seleccionados } = this.state;
        this.props.getValue(this.state.groupsToSend)

        return (
            <>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar grupo"
                    value={this.state.valueInput}
                    onChange={this.buscar}
                />

                <button
                    id="agregar-todos"
                    className="btn btn-primary"
                    onClick={
                        (e) => {
                            e.preventDefault();
                            this.handleClickAddAll();
                        }
                    }
                >
                    Agregar todos
                </button>

                {allSelected &&
                    <p>
                        Has seleccionado todos los grupos
                    </p>
                }

                {!allSelected && seleccionados.length > 0 &&
                    <div>
                        Grupos agregados:
                        <ul>
                            {
                                seleccionados.map(seleccionado => {
                                    return (
                                        <li key={seleccionado}>{seleccionado}</li>
                                    )
                                })
                            }

                        </ul>
                    </div>
                }

                {groupSelect &&
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre del grupo</th>
                                <th>Agregar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupSelect.slice(0, groupsToShow).filter(result => valueInput ? result.label.trim().includes(valueInput) : true).map(group => {
                                return (
                                    <tr
                                        key={group.value}
                                    >
                                        <td>{group.label}</td>
                                        <td>
                                            {!seleccionados.includes(group.label) &&
                                                <button
                                                    disabled={allSelected}
                                                    id="agregar-uno"
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            this.agregarGrupo(group);
                                                        }
                                                    }
                                                >
                                                    Agregar
                                            </button>
                                            }
                                            {seleccionados.includes(group.label) &&
                                                <button
                                                    disabled={allSelected}
                                                    id="agregar-uno"
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            this.quitarGrupo(group);
                                                        }
                                                    }
                                                >
                                                    Quitar
                                            </button>
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>
                                    <button
                                        id="ver-mas"
                                        className="btn btn-primary"
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                this.handleClick();
                                            }
                                        }
                                    >
                                        Ver más
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                }
            </>
        )
    }
}

