import React from 'react'
import './App.css'
import DashboardRoutes from './routers/DashboardRoutes';

require('dotenv').config(); // Utilizamos este metodo para utilizar variables de entorno desde el archivo .env

function App() {
  return (
    <DashboardRoutes />
  );
}

export default App;
