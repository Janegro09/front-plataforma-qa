import React, { Component } from 'react';
import DashboardRoutes from './routers/DashboardRoutes';

require('dotenv').config(); // Utilizamos este metodo para utilizar variables de entorno desde el archivo .env

export default class PlataformaApp extends Component {
  render() {
    return (
      <DashboardRoutes />
    )
  }
}

