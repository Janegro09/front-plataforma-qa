import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import TablePagination from '../TableOfUsers/TableOfUsers'
import { Redirect } from 'react-router-dom'


export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }

        this.logout = this.logout.bind(this)
    }

    logout() {
        localStorage.setItem("userData", '')
        localStorage.clear()
        this.setState({ redirect: true })
    }

    render() {
        const userInfo = JSON.parse(localStorage.getItem("userData"));
        console.log(userInfo)
        if (this.state.redirect) {
            return <Redirect to={'/'} />
        }
        return (
            <div>
                <div className="header">
                    {/* BOTON DE SALIDA */}
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft name={userInfo.name} />
                </div>
                {/* PAGINACION  */}
                <TablePagination userInfo={userInfo} />
            </div>
        )
    }
}
