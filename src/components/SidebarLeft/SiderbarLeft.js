import React, { Component } from 'react'
import './styles.css'
import { NavLink } from 'react-router-dom';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import LogoIn from './qa_logo2.png';

// Íconos de Material UI
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import SecurityIcon from '@material-ui/icons/Security';
import SettingsIcon from '@material-ui/icons/Settings';


export default class SiderbarLeft extends Component {
    render() {
        return (

            <div className="side__bar">
                <div className="side__bar_container side__bar_inverse">
                    <ul className="parent__menu_holder side__bar_inverse">
                        {/* HOME */}
                        <span className="LogoInMenu"><NavLink to="/home" activeClassName=""><img src={LogoIn} className="LogoIn" alt="logo" /></NavLink></span>
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
                        {HELPER_FUNCTIONS.checkPermissionGroup("") &&
                            <li className="nameMenu"><NavLink to="/backoffice" activeClassName="active"><SettingsIcon className="IconoMenu" /></NavLink>Nómina
                            </li>
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
