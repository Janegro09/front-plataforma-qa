import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import UserAdminHeader from '../Users/userAdminHeader/userAdminHeader'
import ReporteriaForm from './ReporteriaForm'
import { Body } from '../UI/Body'

export default class Reporteria extends Component {
    render() {
        return (
            <Body>
                <ReporteriaForm />
            </Body>
        )
    }
}
