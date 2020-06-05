import React, { Component } from 'react'
import SidebarLeft from '../SidebarLeft/SiderbarLeft'

export default class UsersComponent extends Component {
    render() {
        return (
            <div>
                <div className="welcome-message">Users component</div>
                <SidebarLeft />
            </div>
        )
    }
}