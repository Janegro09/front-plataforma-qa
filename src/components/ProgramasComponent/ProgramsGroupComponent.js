import React, { Component } from 'react'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

export default class ProgramsGroupComponent extends Component {
    render() {
        return (
            <div>
                <table cellSpacing="0">
                    <thead className="encabezadoTabla">
                        <tr>
                            <th>Nombre</th>
                            <th className="tableIcons">Editar</th>
                            <th className="tableIcons">Eliminar</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr key={1}>
                            <td>Nombre grupo</td>
                            <td ><EditIcon style={{ fontSize: 15 }} /></td>
                            <td><DeleteIcon style={{ fontSize: 15 }} /></td>
                        </tr>
                        <tr key={2}>
                            <td>Nombre grupo 1</td>
                            <td ><EditIcon style={{ fontSize: 15 }} /></td>
                            <td><DeleteIcon style={{ fontSize: 15 }} /></td>
                        </tr>
                        <tr key={3}>
                            <td>Nombre grupo 2</td>
                            <td ><EditIcon style={{ fontSize: 15 }} /></td>
                            <td><DeleteIcon style={{ fontSize: 15 }} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
