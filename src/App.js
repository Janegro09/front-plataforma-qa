import React from 'react'
import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './components/Login/Login'
import Home from './components/Home/Home';
import UsersComponent from './components/UsersComponent/UsersComponent';
import editUserComponent from './components/editUserComponent/editUserComponent'
import deleteUserComponent from './components/deleteUserComponent/deleteUserComponent'
import addUserComponent from './components/addUserComponent/addUserComponent'
import ChangePassword from './components/changePassword/ChangePassword'
import GroupsComponent from './components/GroupsComponent/GroupsComponent'
import editGroupComponent from './components/editGroupComponent/editGroupComponent'
import editRoleComponent from './components/editRoleComponent/editRoleComponent'
import deleteGroupComponent from './components/deleteGroupComponent/deleteGroupComponent'
import createGroupComponent from './components/createGroupComponent/createGroupComponent'
import RolesComponent from './components/RolesComponent/RolesComponent'
import createRoleComponent from './components/createRoleComponent/createRoleComponent'
import deleteRoleComponent from './components/deleteRoleComponent/deleteRoleComponent'
import BackOfficeComponent from './components/BackOfficeComponent/BackOfficeComponent'
import ProgramasComponent from './components/ProgramasComponent/ProgramasComponent'
import CreateProgramComponent from './components/CreateProgramComponent/CreateProgramComponent'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/users" component={UsersComponent} />
        <Route path="/addUser" component={addUserComponent} />
        <Route path="/editUser" component={editUserComponent} />
        <Route path="/editGroup" component={editGroupComponent} />
        <Route path="/editRole" component={editRoleComponent} />
        <Route path="/deleteUser" component={deleteUserComponent} />
        <Route path="/createGroup" component={createGroupComponent} />
        <Route path="/createProgram" component={CreateProgramComponent} />
        <Route path="/createRole" component={createRoleComponent} />
        <Route path="/deleteRole" component={deleteRoleComponent} />
        <Route path="/deleteGroup" component={deleteGroupComponent} />
        <Route path="/changePassword" component={ChangePassword} />
        <Route path="/groups" component={GroupsComponent} />
        <Route path="/roles" component={RolesComponent} />
        <Route path="/backoffice" component={BackOfficeComponent} />
        <Route path="/programas" component={ProgramasComponent} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
