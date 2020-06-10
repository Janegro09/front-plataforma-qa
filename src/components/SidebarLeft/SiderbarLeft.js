import React, { Component } from 'react'
import './styles.css'
import { NavLink } from 'react-router-dom';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import Logout from '../Logout/Logout'
import LogoIn from './qa_logo2.png';

// Íconos de Material UI
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import SecurityIcon from '@material-ui/icons/Security';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


export default class SiderbarLeft extends Component {
    render() {
        return (

            <div className="side__bar">
                <div className="side__bar_container side__bar_inverse">
                    <ul className="parent__menu_holder side__bar_inverse">
                        {/* HOME */}
                        <span className="LogoInMenu"><NavLink to="/home"><img src={LogoIn} className="LogoIn" /></NavLink></span>
                        <hr></hr>
                        {/* USERS */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("users") &&
                            <li><NavLink to="/users"><PersonIcon className="IconoMenu" /></NavLink></li>
                        }
                        {/* GROUPS */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("groups") &&
                            <li><NavLink to="/groups"><PeopleIcon className="IconoMenu" /></NavLink></li>
                        }
                        {/* ROLES */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("roles") &&
                            <li><NavLink to="/roles"><SecurityIcon className="IconoMenu" /></NavLink></li>
                        }
                        {/* BACKOFFICE */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("") &&
                            <li><NavLink to="/backoffice"><SettingsIcon className="IconoMenu" />
                             
                            </NavLink>
                            </li>
                        }

                        {/* EXIT */}
                        <li>
                            <ExitToAppIcon />
                            <Logout />
                        </li>
      
                    </ul>
                </div>
            </div>
        )
    }
}
