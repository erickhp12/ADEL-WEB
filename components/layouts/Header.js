import React, { Component } from 'react'
import Router from 'next/router'
import { Link } from "../../routes"
import { hasPermission } from '../permission'

export default class extends React.Component{
    permisoAsociados = 31
    permisoPacientes = 46
    permisoCitas = 97
    permisoSucursales = 16
    permisoUsuarios = 22
    permisoServicios = 25
    permisoProducto = 67
    permisoCaja = 88
    permisoInventario = 88
    permisoPaquete = 76
    
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
                            {hasPermission(this.permisoAsociados) &&
                            <Link route="associates">
                                <a className={`navbar-item ${this.isActive("associates")}`}>Asociados</a>
                            </Link>}
                            {hasPermission(this.permisoPacientes) &&
                            <Link route="patients">
                                <a className={`navbar-item ${this.isActive("patients")}`}>Pacientes</a>
                            </Link>}

                            {hasPermission(this.permisoCitas) &&
                            <Link route="appointments">
                                <a className={`navbar-item ${this.isActive("appointments")}`}>Citas</a>
                            </Link>}

                            {hasPermission(this.permisoSucursales) &&
                            <Link route="branch_offices">
                                <a className={`navbar-item ${this.isActive("branch_offices")}`}>Sucursales</a>
                            </Link>}
                            {hasPermission(this.permisoCaja) &&
                            <Link route="cash">
                                <a className={`navbar-item ${this.isActive("sales")}`}>Caja</a>
                            </Link>}
                            {hasPermission(this.permisoInventario) &&
                            <Link route="inventory">
                                <a className={`navbar-item ${this.isActive("inventory")}`}>Inventario</a>
                            </Link>}
                            {hasPermission(this.permisoProducto) &&
                            <Link route="products">
                                <a className={`navbar-item ${this.isActive("products")}`}>Productos</a>
                            </Link>}
                            {hasPermission(this.permisoPaquete) &&
                            <Link route="packages">
                                <a className={`navbar-item ${this.isActive("packages")}`}>Paquetes</a>
                            </Link>}
                            {hasPermission(this.permisoServicios) &&
                            <Link route="services">
                                <a className={`navbar-item ${this.isActive("services")}`}>Servicios</a>
                            </Link>}
                            {hasPermission(this.permisoUsuarios) &&
                            <Link route="users">
                                <a className={`navbar-item ${this.isActive("users")}`}>Usuarios</a>
                            </Link>}
                            <div className="navbar-item has-dropdown is-hoverable">
                                <a className="navbar-link is-arrowless">Reportes</a>
                                <div className="navbar-dropdown">
                                    <a className="navbar-item">Reporte 1</a>
                                    <a className="navbar-item">Reporte 2</a>
                                    <a className="navbar-item">Reporte 4</a>
                                    <hr className="navbar-divider"/>
                                    <a className="navbar-item">Reporte general</a>
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
