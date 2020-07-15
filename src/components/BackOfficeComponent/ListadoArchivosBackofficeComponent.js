import React, { Component } from 'react'

export default class ListadoArchivosBackofficeComponent extends Component {
    render() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descargar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Nombre archivo</td>
                            <td>icono download</td>
                            <td>icono delete</td>
                        </tr>
                        <tr>
                            <td>Nombre archivo</td>
                            <td>icono download</td>
                            <td>icono delete</td>
                        </tr>
                        <tr>
                            <td>Nombre archivo</td>
                            <td>icono download</td>
                            <td>icono delete</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
