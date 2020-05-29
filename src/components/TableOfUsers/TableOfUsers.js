import React, { Component } from 'react'
import Global from '../../Global'
import axios from 'axios'

export default class TableOfUsers extends Component {
    constructor(props) {
        super(props)
        console.log("datos: ", props.userInfo)
        console.log(Global.getUsers)
    }
    componentDidMount() {
        axios.get(Global.getUsers)
            .then(response => {
                console.log(response.data)
                if (response.data.Success) {
                    console.log("Response", response.data)

                } else {
                    console.log("Login error")
                }
            })
            .catch(err => console.warn(err));
    }
    render() {
        console.log("Se cargo el componente")
        return (
            <div>
                {/* <h1>Table of users</h1> */}
            </div>
        )
    }
}
