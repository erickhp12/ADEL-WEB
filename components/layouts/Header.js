import React, { Component } from 'react'
import Router from 'next/router'
import { Link } from "../../routes"
import { hasPermission } from '../permission'

export default class extends React.Component{
    permisoSucursales = 17
    permisoUsuarios = 23
    state = {
        active: "0",
        selected_menu: this.props.selectedMenu,
    }

    logout = (e) => {
        localStorage.clear()
        Router.pushRoute('/login')
    }

    openBurguer = () => {
        if (this.state.active == "0")
            this.setState({ active:"1" })
        else
            this.setState({active:"0"})
    }

    isActive = (menu) => {
        return this.state.selected_menu === menu ? "active" : ""
    }

    render(){
        return (
            <div>
                <nav className="navbar header-bar" role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <a className="navbar-item" href="https://bulma.io">
                            <h1>ADEL</h1>
                        </a>

                        <a
                            role="button"
                            className="navbar-burger burger"
                            onClick={ this.openBurguer }
                            aria-label="menu"
                            aria-expanded="false"
                            data-target="navbarBasicExample">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarBasicExample" className={`navbar-menu ${this.state.active == "1" ? 'is-active': ''}`}>
                        <div className="navbar-start">
                            {hasPermission(this.permisoSucursales)?
                            <Link route="associates">
                                <a className={`navbar-item ${this.isActive("associates")}`}>Asociados</a>
                            </Link>
                            :<span></span>}
                            
                            {hasPermission(this.permisoSucursales)?
                            <Link route="patients">
                                <a className={`navbar-item ${this.isActive("patients")}`}>Pacientes</a>
                            </Link>
                            :<span></span>}
                            {hasPermission(this.permisoSucursales)?
                            <Link route="branch_offices">
                                <a className={`navbar-item ${this.isActive("branch_offices")}`}>Sucursales</a>
                            </Link>
                            :<span></span>}
                            {hasPermission(this.permisoUsuarios)?
                            <Link route="users">
                                <a className={`navbar-item ${this.isActive("users")}`}>Usuarios</a>
                            </Link>
                            :<span></span>}
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link is-arrowless">Reportes</a>
                                <div className="navbar-dropdown">
                                    <a className="navbar-item">About</a>
                                    <a className="navbar-item">Jobs</a>
                                    <a className="navbar-item">Contact</a>
                                    <hr className="navbar-divider"/>
                                    <a className="navbar-item">Report an issue</a>
                                </div>
                            </div>
                        </div>

                        <div className="navbar-end">
                            <div className="navbar-item">
                                <div className="buttons">
                                    <Link route="settings">
                                        <a className={`button is-light ${this.isActive("settings")}`}><strong>Configuracion</strong></a>
                                    </Link>
                                    <a className="button is-danger" onClick={this.logout}>Salir</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <style jsx>{`
                    .active{
                        font-weight:800;
                        border-bottom: 3px solid #CCC;
                    }
                `}</style>
            </div>
        )
    }
}
