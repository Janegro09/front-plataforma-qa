import React, { Component } from 'react'
import UserTable from '../UserTable/UserTable'
import { Redirect } from 'react-router-dom'

export default class TableOfUsers extends Component {
    constructor() {
        super()
        this.state = {
            allUsers: null,
            redirect: false
        }
        this.logout = this.logout.bind(this)
    }

    logout() {
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
                <UserTable allUsers={this.state.allUsers} />
            </div>
        )
    }
}

