/*import React from 'react';
import MaterialTable from 'material-table';

export default function MaterialTableDemo() {
    const [state, setState] = React.useState({
        columns: [
            { title: 'Nombre', field: 'name' },
            { title: 'Apellido', field: 'surname' },
            { title: 'Cumpleaños', field: 'birthYear', type: 'numeric' },
            {
                title: 'Lugar de nacimiento',
                field: 'birthCity',
                lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
            },
        ],
        data: [
            { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
            {
                name: 'Zerya Betül',
                surname: 'Baran',
                birthYear: 2017,
                birthCity: 34,
            },
            {
                name: 'Zerya Betül',
                surname: 'Baran',
                birthYear: 2017,
                birthCity: 34,
            },
            {
                name: 'Zerya Betül',
                surname: 'Baran',
                birthYear: 2017,
                birthCity: 34,
            },
            {
                name: 'Zerya Betül',
                surname: 'Baran',
                birthYear: 2017,
                birthCity: 34,
            },
            {
                name: 'Zerya Betül',
                surname: 'Baran',
                birthYear: 2017,
                birthCity: 34,
            },
        ],
    });

    return (
        <MaterialTable
            title="Búsqueda de usuarios"
            columns={[
                { title: 'Vorname', field: 'name' },
                { title: 'Nachname', field: 'surname' },
                { title: 'Geburtsjahr', field: 'birthYear', type: 'numeric' },
                {
                    title: 'Geburtsort',
                    field: 'birthCity',
                    lookup: { 34: 'Istanbul', 63: 'Sanliurfa' },
                },
            ]}
            localization={{
                body: {
                    emptyDataSourceMessage: 'Sin datos',
                    // addTooltip: 'Hinzufügen',
                    deleteTooltip: 'Löschen',
                    // editTooltip: 'Bearbeiten',
                    // filterRow: {
                    //   filterTooltip: 'Filter'
                    // },
                    editRow: {
                        deleteText: 'Estás seguro que quieres borrar el usuario?',
                        cancelTooltip: 'No',
                        saveTooltip: 'Sí'
                    }
                },
                grouping: {
                    placeholder: 'Spalten ziehen ...',
                    groupedBy: 'Gruppiert nach:'
                },
                header: {
                    actions: 'Acciones'
                },
                pagination: {
                    labelDisplayedRows: '{from}-{to} de {count}',
                    labelRowsSelect: 'Página',
                    labelRowsPerPage: 'Líneas por página:',
                    firstAriaLabel: 'Primera',
                    firstTooltip: 'Primera',
                    previousAriaLabel: 'Anterior',
                    previousTooltip: 'Página anterior',
                    nextAriaLabel: 'Siguiente',
                    nextTooltip: 'Siguiente página',
                    lastAriaLabel: 'Última',
                    lastTooltip: 'Última'
                },
                toolbar: {
                    addRemoveColumns: 'Spalten hinzufügen oder löschen',
                    nRowsSelected: '{0} Zeile(n) ausgewählt',
                    showColumnsTitle: 'Zeige Spalten',
                    showColumnsAriaLabel: 'Zeige Spalten',
                    exportTitle: 'Export',
                    exportAriaLabel: 'Export',
                    exportName: 'Export als CSV',
                    searchTooltip: 'Buscar',
                    searchPlaceholder: 'Buscar'
                }
            }}
            columns={state.columns}
            data={state.data}
            editable={{
                onRowAdd: (newData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            setState((prevState) => {
                                const data = [...prevState.data];
                                data.push(newData);
                                console.log("Add prevState: ", prevState)
                                console.log("Add data: ", data)
                                return { ...prevState, data };
                            });
                        }, 600);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            if (oldData) {
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    data[data.indexOf(oldData)] = newData;
                                    console.log("Update prevState: ", prevState)
                                    console.log("Update data: ", data)
                                    return { ...prevState, data };
                                });
                            }
                        }, 600);
                    }),
                onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            setState((prevState) => {
                                const data = [...prevState.data];
                                data.splice(data.indexOf(oldData), 1);
                                console.log("Delete prevState: ", prevState)
                                console.log("Delete data: ", data)
                                return { ...prevState, data };
                            });
                        }, 600);
                    }),
            }}
        />
    );
} */

import React, { Component } from 'react'
import Global from '../../Global'
import axios from 'axios'
import UserTable from '../UserTable/UserTable'

export default class TableOfUsers extends Component {
    constructor() {
        super()
        this.state = {
            allUsers: null
        }
        console.log("Constructor lanzado")
    }
    componentDidMount() {
        console.log("componentDidMount lanzado")
        // const userInfo = JSON.parse(localStorage.getItem("userData"));
        const tokenUser = JSON.parse(localStorage.getItem("token"))
        const token = tokenUser
        const bearer = `Bearer ${token}`
        axios.get(Global.getUsers, { headers: { Authorization: bearer } }).then(response => {
            /* se actualiza el token */
            this.setState({
                allUsers: response.data.Data
            })
            localStorage.setItem("token", JSON.stringify(response.data.loggedUser.token));
        })
            .catch((error) => {
                console.log('error ' + error);
            });
    }
    render() {
        console.log("Daos en el render: ", this.state)
        return (
            <div>
                {this.state.allUsers === null &&
                    <h1>Cargando...</h1>
                }

                {this.state.allUsers != null &&
                    <UserTable allUsers={this.state.allUsers} />
                }

            </div>
        )
    }
}

