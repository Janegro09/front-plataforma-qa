import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'
import Perfilamiento from './Perfilamiento'
import Logo from '../Home/logo_background.png';
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader';

export default class PerfilamientoComponent extends Component {
    render() {
        return (
            <>
                <div className="logoBackground">
                    <img src={Logo} alt="" title="Logo" className="logoFixed" />
                </div>
                <SidebarLeft />
                <UserAdminHeader />
                <div className="section-content">
                    <Perfilamiento />
                </div>
            </>
        )
    }
}
