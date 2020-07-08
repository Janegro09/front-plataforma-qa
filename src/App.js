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

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/addUser" component={addUserComponent} />
        <Route path="/backoffice" component={BackOfficeComponent} />
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
        <Route path="/groups" component={GroupsComponent} />
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route exact path="/perfilamiento" component={PerfilamientoComponent} />
        <Route path="/perfilamiento/cuartiles" component={PerfilamientoCuartilesComponent} />
        <Route path="/perfilamiento/perfilamientos" component={ PerfilamientosComponent } />
        <Route path="/programas" component={ProgramasComponent} />
        <Route path="/roles" component={RolesComponent} />
        <Route path="/users" component={UsersComponent} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
