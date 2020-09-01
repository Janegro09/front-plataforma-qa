import React, { Component } from 'react';
import SiderbarLeft from '../../SidebarLeft/SiderbarLeft';
import UserAdminHeader from '../../Users/userAdminHeader/userAdminHeader';

export default class FormulariosComponent extends Component {
    render() {
        return (
            <>
                <div className="header">
                    <SiderbarLeft />
                    <UserAdminHeader />
                </div>

                <div className="container">
                    <h4>FormulariosComponent</h4>
                </div>
            </>
        )
    }
}
