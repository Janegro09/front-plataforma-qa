import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'
import Perfilamiento from './Perfilamiento'
import Logo from '../Home/logo_background.png';

export default class PerfilamientoComponent extends Component {
    render() {
        return (
            <div>
                <div className="logoBackground">
                    <img src={Logo} alt="" title="Logo" className="logoFixed" />
                </div>
                <SidebarLeft />
                <div className="section-content">
                    <Perfilamiento />
                </div>
            </div>
        )
    }
}
