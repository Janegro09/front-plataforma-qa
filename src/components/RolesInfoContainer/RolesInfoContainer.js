import React, { Component } from 'react'
import RolesTable from '../rolesTable/rolesTable'
import { Redirect } from 'react-router-dom'

export default class TableOfUsers extends Component {
    constructor() {
        super()
        this.state = {
            allUsers: null,
            redirect: false
        }
    }

    logout = () => {
        localStorage.setItem("userData", '')
        localStorage.setItem("token", '')
        localStorage.clear()
        this.setState({ redirect: true })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }

        return (
            <div>
                <RolesTable allUsers={this.state.allUsers} />
            </div>
        )
    }
}

