import React, { Component } from 'react'
import SiderbarLeft from '../SidebarLeft/SiderbarLeft'
import TablePagination from '../TableOfUsers/TableOfUsers'
import { Link, Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button';

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
                    <Link className="salir" to="/" onClick={this.logout} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        <Button variant="contained" color="primary" disableElevation>
                            SALIR
                        </Button>
                    </Link>
                    {/* MENSAJE BIENVENIDA */}
                    <div className="welcome-message">Bienvenido {userInfo.name}</div>
                    {/* BARRA LATERAL IZQUIERDA */}
                    <SiderbarLeft name={userInfo.name} />
                </div>
                {/* PAGINACION  */}
                <TablePagination userInfo={userInfo} />
            </div>
        )
    }
}
