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
            seleccionados: [],
            seleccionadosToShow: 10
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

    handleClickDeleteAll = () => {

        this.setState({ groupsToSend: '', allSelected: false, seleccionados: [] });

        document.getElementById('quitar-todos').focus();
        document.getElementById('quitar-todos').click();
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
        const { groupSelect, groupsToShow, valueInput, allSelected, seleccionados, seleccionadosToShow } = this.state;

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

                {seleccionados.length !== groupSelect.length &&
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
                }


                {seleccionados.length === groupSelect.length &&
                    <button
                        id="quitar-todos"
                        className="quitarTodos"
                        onClick={
                            (e) => {
                                e.preventDefault();
                                this.handleClickDeleteAll();
                            }
                        }
                    >
                        Quitar todos
                    </button>
                }

                {allSelected &&
                    <p>
                        Has seleccionado todos los grupos
                    </p>
                }
                {!allSelected && seleccionados.length > 0 &&
                    <table>
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">Grupos agregados</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                seleccionados.slice(0, seleccionadosToShow).map(seleccionado => {
                                    return (
                                        <tr>
                                            <td key={seleccionado}>{seleccionado}</td>
                                        </tr>
                                    )
                                })
                            }
                            {seleccionados.length > 0 &&
                                <tr>
                                    <td>
                                    </td>
                                </tr>
                            }
                        </tbody>
                        <button
                            className="ver-mas"
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState(prevState => {
                                    return { seleccionadosToShow: prevState.seleccionadosToShow + 5 }
                                })
                            }}>
                            Ver más
                                        </button>
                    </table>
                }

                {groupSelect &&
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre del grupo</th>
                                <th className="tableIcons">Agregar / Quitar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupSelect.filter(result => valueInput ? result.label.trim().includes(valueInput) : true).slice(0, groupsToShow).map(group => {
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
                    </table>
                }
                        <div
                            id="ver-mas"
                            className="ver-mas"
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    this.handleClick();
                                }
                            }
                        >
                            Ver más
                        </div>
            </>
        )
    }
}

