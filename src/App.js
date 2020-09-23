import React from 'react'
import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './components/Login/Login'
import Home from './components/Home/Home';
import UsersComponent from './components/Users/UsersComponent/UsersComponent';
import editUserComponent from './components/Users/editUserComponent/editUserComponent'
import deleteUserComponent from './components/Users/deleteUserComponent/deleteUserComponent'
import addUserComponent from './components/Users/addUserComponent/addUserComponent'
import ChangePassword from './components/changePassword/ChangePassword'
import GroupsComponent from './components/Groups/GroupsComponent/GroupsComponent'
import editGroupComponent from './components/Groups/editGroupComponent/editGroupComponent'
import editRoleComponent from './components/editRoleComponent/editRoleComponent'
import deleteGroupComponent from './components/Groups/deleteGroupComponent/deleteGroupComponent'
import createGroupComponent from './components/Groups/createGroupComponent/createGroupComponent'
import RolesComponent from './components/RolesComponent/RolesComponent'
import createRoleComponent from './components/createRoleComponent/createRoleComponent'
import deleteRoleComponent from './components/deleteRoleComponent/deleteRoleComponent'
import BackOfficeComponent from './components/BackOfficeComponent/BackOfficeComponent'
import ProgramasComponent from './components/ProgramasComponent/ProgramasComponent'
import CreateProgramComponent from './components/CreateProgramComponent/CreateProgramComponent'
import EditProgramComponent from './components/EditProgramComponent/EditProgramComponent'
import DeleteProgramComponent from './components/DeleteProgramComponent/DeleteProgramComponent'
import CreateProgramsGroupComponent from './components/ProgramasComponent/CreateProgramsGroupComponent'
import EditProgramsGroupComponent from './components/ProgramasComponent/EditProgramsGroupComponent'
import PerfilamientoComponent from './components/PerfilamientoComponent/PerfilamientoComponent'
import PerfilamientosComponent from './components/PerfilamientoComponent/PerfilaminetosComponent'
import PerfilamientoCuartilesComponent from './components/PerfilamientoComponent/PerfilamientoCuartilesComponent';
import PartiturasComponent from './components/PartiturasComponent/PartiturasComponent';
import BibliotecaArchivosComponent from './components/BackOfficeComponent/BibliotecaArchivosComponent/BibliotecaArchivosComponent';
import ModeloDePartiturasComponent from './components/BackOfficeComponent/ModeloDePartiturasComponent/ModeloDePartiturasComponent';
import AdministracionFormulariosComponent from './components/BackOfficeComponent/AdministracionFormulariosComponent/AdministracionFormulariosComponent';
import ExportarBasesDeDatosComponent from './components/BackOfficeComponent/ExportarBasesDeDatosComponent/ExportarBasesDeDatosComponent';
import PartiturasEspecificComponent from './components/PartiturasComponent/PartiturasEspecificComponent';
import PartiturasUsuariosComponent from './components/PartiturasComponent/PartiturasUsuarioComponent';
import StepName from './components/PartiturasComponent/StepName';
import ProgramsGroups from './components/ProgramasComponent/ProgramsGroups';
import FormulariosComponent from './components/BackOfficeComponent/AdministracionFormulariosComponent/FormulariosComponent';
import ModeloFormularios from './components/BackOfficeComponent/AdministracionFormulariosComponent/ModeloFormularios';
import ViewModelOfForm from './components/BackOfficeComponent/AdministracionFormulariosComponent/ModeloFormulariosView';
import FormularioView from './components/BackOfficeComponent/AdministracionFormulariosComponent/FormularioView';
import Monitoreo from './components/QA/Monitoreo';
import MonitoreoEditar from './components/QA/MonitoreoEditar';
import Calibraciones from './components/QA/Calibraciones';
import TiposDeCalibraciones from './components/BackOfficeComponent/TiposDeCalibraciones';
import CalibracionesView from './components/QA/CalibracionesView';

require('dotenv').config(); // Utilizamos este metodo para utilizar variables de entorno desde el archivo .env

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/addUser" component={addUserComponent} />
        <Route exact path="/administracion-formularios" component={AdministracionFormulariosComponent} />
        <Route exact path="/administracion-formularios/formularios" component={FormulariosComponent} />

        <Route exact path="/administracion-formularios/modelo-formularios" component={ModeloFormularios} />
        <Route exact path="/administracion-formularios/modelo-formularios/:id" component={ViewModelOfForm} />

        <Route exact path="/administracion-formularios/formularios/:id" component={FormularioView} />
        <Route exact path="/tipos-de-calibraciones" component={TiposDeCalibraciones} />

        <Route path="/backoffice" component={BackOfficeComponent} />
        <Route path="/biblioteca" component={BibliotecaArchivosComponent} />
        <Route path="/borrarPrograma" component={DeleteProgramComponent} />
        <Route path="/createGroup" component={createGroupComponent} />
        <Route path="/crearGrupoProgramas" component={CreateProgramsGroupComponent} />
        <Route path="/changePassword" component={ChangePassword} />
        <Route path="/crearPrograma" component={CreateProgramComponent} />
        <Route path="/createRole" component={createRoleComponent} />
        <Route path="/deleteGroup" component={deleteGroupComponent} />
        <Route path="/deleteUser" component={deleteUserComponent} />
        <Route path="/deleteRole" component={deleteRoleComponent} />
        <Route path="/editGroup" component={editGroupComponent} />
        <Route path="/editUser" component={editUserComponent} />
        <Route path="/editRole" component={editRoleComponent} />
        <Route path="/editarGrupoProgramas" component={EditProgramsGroupComponent} />
        <Route path="/editarPrograma" component={EditProgramComponent} />
        <Route path="/exportar-bases-de-datos" component={ExportarBasesDeDatosComponent} />
        <Route path="/groups" component={GroupsComponent} />
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/modelo-de-partituras" component={ModeloDePartiturasComponent} />
        <Route exact path="/partituras" component={PartiturasComponent} />
        <Route exact path="/partituras/step/:id/:idUsuario/:idStep" component={StepName} />
        <Route exact path="/partituras/:id" component={PartiturasEspecificComponent} />
        <Route exact path="/partituras/:id/:idUsuario" component={PartiturasUsuariosComponent} />
        <Route exact path="/perfilamiento" component={PerfilamientoComponent} />
        <Route  path="/perfilamiento/cuartiles" component={PerfilamientoCuartilesComponent} />
        <Route  path="/perfilamiento/perfilamientos" component={PerfilamientosComponent} />
        <Route exact path="/programas" component={ProgramasComponent} />
        <Route exact path="/programas/grupos" component={ProgramsGroups} />
        <Route path="/roles" component={RolesComponent} />
        <Route path="/users" component={UsersComponent} />
        <Route exact path="/monitoreo" component={Monitoreo} />
        <Route exact path="/monitoreo/:id" component={MonitoreoEditar} />
        <Route exact path="/calibraciones" component={Calibraciones} />
        <Route exact path="/calibraciones/:id" component={CalibracionesView} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
