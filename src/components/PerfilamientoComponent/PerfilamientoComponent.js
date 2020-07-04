import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'
import Perfilamiento from './Perfilamiento'

export default class PerfilamientoComponent extends Component {
    render() {
        return (
            <div>
                <SidebarLeft />
                <div className="section-content">
                    <Perfilamiento />
                </div>
            </div>
        )
    }
}
