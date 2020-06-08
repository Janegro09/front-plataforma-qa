import React, { Component } from 'react'
import './styles.css'

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
                        <li><HomeIcon /></li>
                        <li><PersonIcon /></li>
                        <li><PeopleIcon /></li>
                        <li><SecurityIcon /></li>
                        <li><SettingsIcon />
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
                        </li>
                        <li><ExitToAppIcon />
                            <ul className="child__menu">
                                <li>My New Design</li>
                            </ul>
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
