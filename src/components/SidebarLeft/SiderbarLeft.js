import React, { Component } from 'react'
import './styles.css'
import { NavLink } from 'react-router-dom';
import { HELPER_FUNCTIONS } from '../../helpers/Helpers'
import Logout from '../Logout/Logout'
import LogoIn from './qa_logo.png';

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
                        <span class="LogoInMenu"><NavLink to="/home"><img src={LogoIn} className="LogoIn" /></NavLink></span>
<hr></hr>
                        {/* USERS */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("users") &&
                            <li><NavLink to="/users"><PersonIcon className="IconoMenu"/></NavLink></li>
                        }
                        {/* GROUPS */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("groups") &&
                            <li><NavLink to="/groups"><PeopleIcon className="IconoMenu"/></NavLink></li>
                        }
                        {/* ROLES */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("roles") &&
                            <li><NavLink to="/roles"><SecurityIcon className="IconoMenu"/></NavLink></li>
                        }
                        {/* BACKOFFICE */}
                        {HELPER_FUNCTIONS.checkPermissionGroup("") &&
                            <li><NavLink to="/backoffice"><SettingsIcon className="IconoMenu"/>
                                <ul className="child__menu">
                                    <li>My New Design</li>
                                    <ul className="child__list">
                                        <li><a href="#">Design One</a></li>
                                        <li><a href="#">Design Two</a></li>
                                        <li><a href="#">Design Three</a></li>
                                        <li><a href="#">One Of My Best Design</a></li>
                                        <li><a href="#">Check Out My Other Design www.niweshshrestha.com.np</a></li>
                                        <li><a href="#">Design Four</a></li>
                                        <li><a href="#">Design Three</a></li>
                                        <li><a href="#">One Of My Best Design</a></li>
                                        <li><a href="#">Check Out My Other Design www.niweshshrestha.com.np</a></li>
                                        <li><a href="#">Design Four</a></li>
                                    </ul>
                                </ul>
                            </NavLink>
                            </li>
                        }

                        {/* EXIT */}
                        <li>
                            <ExitToAppIcon />
                            <Logout />
                        </li>
                        {/* <li><i className="fa fa-dropbox"></i>
                            <ul className="child__menu">
                                <li>My New Design</li>
                            </ul>
                        </li>
                        <li><i className="fa fa-git"></i>
                            <ul className="child__menu">
                                <li>My New Design</li>
                            </ul>
                        </li>

                        <li><i className="fa fa-amazon"></i>
                            <ul className="child__menu">
                                <li>My New Design</li>
                            </ul>
                        </li>
                        <li><i className="fa fa-android"></i>
                            <ul className="child__menu">
                                <li>My New Design</li>
                            </ul>
                        </li>
                        <li><i className="fa fa-apple"></i>
                            <ul className="child__menu">
                                <li>My New Design</li>
                            </ul>
                        </li>
                        <li><i className="fa fa-behance"></i>
                            <ul className="child__menu">
                                <li>My New Design</li>
                                <ul className="child__list">
                                    <li><a href="#">Design One</a></li>
                                    <li><a href="#">Design Two</a></li>
                                    <li><a href="#">Design Three</a></li>
                                    <li><a href="#">One Of My Best Design</a></li>
                                    <li><a href="#">Check Out My Other Design www.niweshshrestha.com.np</a></li>
                                    <li><a href="#">Design Four</a></li>
                                </ul>
                            </ul>
                        </li>
                        <li><i className="fa fa-css3"></i>
                            <ul className="child__menu">
                                <li>My New Design</li>
                            </ul>
                        </li>
                        <li><i className="fa fa-dropbox"></i>
                            <ul className="child__menu">
                                <li>My New Design</li>
                            </ul>
                        </li>
                        <li><i className="fa fa-git"></i>
                            <ul className="child__menu">
                                <li>My New Design</li>
                            </ul>
                        </li> */}
                    </ul>
                </div>
            </div>
        )
    }
}
