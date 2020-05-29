import React, { Component } from 'react'
import './styles.css'
import { NavLink } from 'react-router-dom';



export default class SiderbarLeft extends Component {
    state = {
        seccionSeleccionada: null
    };

    cambiarRuta(e) {
        e.preventDefault();
    }
    render() {
        console.log(this.props)
        return (
            <div>
                <input type="checkbox" id="slide" name="" value="" />
                <div className="container">
                    <label htmlFor="slide" className="toggle">☰</label>
                    <nav className="sidebar">
                        <ul>
                            <li><NavLink to="/home" activeClassName="active">Inicio</NavLink></li>
                            <li><NavLink to="/users" activeClassName="active">Prueba</NavLink></li>
                            <li><a href="/#"> Nav3 </a></li>
                            <li><a href="/#"> Nav4 </a></li>
                            <li><a href="/#"> Nav5 </a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        )
    }
}
