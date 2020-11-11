import React, { Component } from 'react'
import GroupsTable from '../GroupTable/GroupTable'
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
                <GroupsTable allUsers={this.state.allUsers} />
            </div>
        )
    }
}

