import React, { Component } from 'react'
import './styles.css'
import { NavLink } from 'react-router-dom';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import LogoIn from './qa_logo2.png';
import { version } from '../../../package.json';

// Íconos de Material UI
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import SecurityIcon from '@material-ui/icons/Security';
import SettingsIcon from '@material-ui/icons/Settings';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import TimelineIcon from '@material-ui/icons/Timeline';


export default class SiderbarLeft extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activo: false
        }
    }

    render() {

        let viewBackoffice = false;

        return (

            <div className="side__bar">
                <div className="side__bar_container side__bar_inverse">
                    <ul className="parent__menu_holder side__bar_inverse">
                        {/* HOME */}
                        <span className="LogoInMenu"><NavLink to="/home" activeClassName=""><img src={LogoIn} className="LogoIn" alt="" /></NavLink></span>
                        <hr></hr>
                        {/* USERS */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("users") &&
                            <li className="nameMenu"><NavLink to="/users" activeClassName="active"><PersonIcon className="IconoMenu" /></NavLink>Usuarios</li>
                        }
                        {/* GROUPS */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("groups") &&
                            <li className="nameMenu"><NavLink to="/groups" activeClassName="active"><PeopleIcon className="IconoMenu" /></NavLink>Grupos</li>
                        }
                        {/* ROLES */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("roles") &&
                            <li className="nameMenu"><NavLink to="/roles" activeClassName="active"><SecurityIcon className="IconoMenu" /></NavLink>Roles</li>
                        }
                        {/* BACKOFFICE */}
                        {(HELPER_FUNCTIONS.checkPermissionGroup("files") || HELPER_FUNCTIONS.checkPermissionGroup("")) &&
                            <li className="nameMenu"><NavLink to="/backoffice" activeClassName="active"><SettingsIcon className="IconoMenu" /></NavLink>Backoffice
                                <span className="showme">
                                    {HELPER_FUNCTIONS.checkPermission("GET|analytics/partituresModels/:id") &&
                                        <NavLink to="/modelo-de-partituras">Modelo de partitura</NavLink>
                                    }

                                    {HELPER_FUNCTIONS.checkPermissionGroup("forms") &&
                                        <NavLink to="/administracion-formularios">Administrador de formularios</NavLink>
                                    }

                                    {HELPER_FUNCTIONS.checkPermission("GET|backoffice/exports") &&
                                        <NavLink to="/exportar-bases-de-datos">Exportar bases de datos</NavLink>
                                    }

                                    {HELPER_FUNCTIONS.checkPermission("GET|files/:id") &&
                                        <NavLink to="/biblioteca">Biblioteca de archivos general</NavLink>
                                    }
                                </span>
                            </li>
                        }
                        {/* PROGRAMAS */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("programs") &&
                            <li className="nameMenu"><GroupWorkIcon className="IconoMenu" />Programas
                                <span className="showme">
                                    <NavLink to="/programas">Programas</NavLink>
                                    <NavLink to="/programas/grupos">Grupos de programas</NavLink>

                                </span>
                            </li>
                        }
                        {/* PERFILAMIENTO */}
                        {/* {HELPER_FUNCTIONS.checkPermissionGroup("") &&
                            <li className="nameMenu"><NavLink to="/perfilamiento" activeClassName="active"><GroupWorkIcon className="IconoMenu" /></NavLink>Perfilamiento
                            </li>
                        } */}
                        {/* ANALYTICS */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("analytics") &&
                            <li className="nameMenu">
                                <div id="parent" className={this.state.activo ? 'active' : ''}>
                                    <TimelineIcon className="IconoMenu" />
                                    <span className="showme">
                                        {HELPER_FUNCTIONS.checkPermission("GET|analytics/file") &&
                                            <NavLink to="/perfilamiento">Perfilamiento</NavLink>
                                        }
                                        {HELPER_FUNCTIONS.checkPermission("GET|analytics/partitures/:id/:userId/:stepId") &&
                                            <NavLink to="/partituras">Partituras</NavLink>
                                        }
                                    </span>
                                    Analytics
                                </div>

                            </li>
                        }
                    </ul>
                    <span className="version">V{version}</span>
                </div>
            </div>
        )
    }
}
