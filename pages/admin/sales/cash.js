import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getProducts } from '../../../services/products'
import { addSale } from '../../../services/sales'
import Select from 'react-select'
import { getAssociates } from '../../../services/associates'
import { getPatientPackages } from '../../../services/patients'
import { getAppointments } from '../../../services/appointments'
import { friendlyDateformat, friendlyFullDateformat } from '../../../filters/filters'
import { getServices } from '../../../services/services'
import Ticket from '../../../components/ticket'
import Router from 'next/router'
import Breadcrumb from '../../../components/Breadcrumb';

export default class extends React.Component {

    state = {
        data: {
            branch_office:null,
            total: 0,
            vendors:[],
            items: []
        },
        products: [],
        products_combo: [],
        services: [],
        services_combo: [],
        associates: [],
        associates_combo: [],
        packages: [],
        packages_combo: [],
        appointments: [],
        appointments_combo: [],
        selected_products:[],
        selected_services:[],
        selected_packages:[],
        selected_appointments:[],
        appointment_name:"",
        appointment_price:null,
        total:0,
        package_price:0,
        service_price:0,
        selected_tab:1,
        venta:{
            items:[]
        },
        //Ticket
        ticketVisible: false,
        textoConfirmacion:''
    }

    async componentDidMount() {

        // ASIGNA SUCURSAL
        let data = this.state.data
        data.branch_office = localStorage.getItem('sucursal')

        // TRAE ASOCIADOS
        try {
            const req = await getAssociates();
            const data = req.data.results
            let associates = req.data.results
            let associates_combo = data.map(obj => {
                return { label: obj.first_name + ' ' + obj.last_name, value: obj.id };
            })
            associates_combo.unshift({
                label: "Seleccionar...", value: ""
            })
            this.setState({ associates, associates_combo });
        } catch (error) {
            console.log(error);
        }

        // TRAE PAQUETES
        try {
            const req = await getPatientPackages()
            const resp = req.data.results
            let packages = req.data.results

            let packages_combo = resp.map(obj => {
                return { label: obj.name + ' - ' + obj.patient, value: obj.id}
            })

            packages_combo.unshift({
                label: "Seleccionar...", value: ""
            })
            this.setState({ packages, packages_combo })
        } catch (error) {
            console.log(error);
        }

        // TRAE SERVICIOS
        try {
            const req = await getServices()
            const resp = req.data.results
            let services = req.data.results
            let services_combo = resp.map(obj => {
                return { label: obj.name , value: obj.id}
            })

            services_combo.unshift({
                label: "Seleccionar...", value: ""
            })
            this.setState({ services, services_combo })
        } catch (error) {
            console.log(error);
        }

        // TRAE CITAS
        try {
            const params = { status: 'pending'}
            const req = await getAppointments(params)
            const resp = req.data.results
            let appointments = req.data.results
            let appointments_combo = resp.map(obj => {
                return { label: friendlyDateformat(obj.date) + ' - ' + obj.patient.first_name + ' ' + obj.patient.last_name, value: obj.id}
            })

            appointments_combo.unshift({
                label: "Seleccionar...", value: ""
            })
            this.setState({ appointments, appointments_combo })
        } catch (error) {
            console.log(error);
        }

        // TRAE PRODUCTOS
        try {
            const req = await getProducts();
            const data = req.data.results
            let products = req.data.results
            let products_combo = data.map(obj => {
                return { label: obj.name, value: obj.id };
            });
            products_combo.unshift({
                label: "Seleccionar...", value: ""
            });
            this.setState({ products_combo, products });
        } catch (error) {
            console.log(error);
        }
    }

	selectProduct = (products) => {
        let selected_products = []
        products.forEach(element => {
            selected_products.push(element.value)
        })
        this.setState({ selected_products })
    }

    selectService = (services) => {
        let selected_services = []
        services.forEach(element => {
            selected_services.push(element.value)
        })
        this.setState({ selected_services })
    }

    selectAppointments = (appointments) => {
        let selected_appointments = []
        appointments.forEach(element => {
            selected_appointments.push(element.value)
        })
        this.setState({ selected_appointments })
    }

    selectPackage = (packages) => {
        let selected_packages = []
        packages.forEach(element => {
            selected_packages.push(element.value)
        })
        this.setState({ selected_packages })
    }

    selectAssociate = (associate) => {
        let selected_associates = []
        associate.forEach(element => {
            selected_associates.push(element.value)
        })
        let data = this.state.data
        data.vendors = selected_associates

        this.setState({ data, selected_associates })
    }

    searchAppointments = () =>{
        let appointments = this.state.selected_appointments
        let data = this.state.data
        let items = data.items
        let name = this.state.appointment_name
        let price = this.state.appointment_price
        console.log('pago')
        console.log(price)
        let objs = []
        var i=0
        appointments.forEach(element => {
            
            let obj = this.state.appointments.find(o => o.id === element)
            console.log('obj')
            console.log(obj)
            objs.push(obj)
            { price ? obj.cost = price : obj.cost }

            if (objs[i]) {
                const item = {
                    "sale_type": "appointment", 
                    "qty": 1,
                    "product_name": obj.patient.first_name + ' ' + obj.patient.last_name,
                    "unit_price": obj.cost,
                    "appointment":obj.id,
                    "product": null
                }
                items.push(item)
            }
            data.total = 0
            data.items = items
            this.setState({ data })
            i+=1
        })
        this.calculateTotal()
    }

    searchPackages = () =>{
        let packages = this.state.selected_packages
        let data = this.state.data
        let items = data.items
        let objs = []
        var i=0
        packages.forEach(element => {
            var pagos_abonados = 0
            var pendiente_pagos = 0
            let obj = this.state.packages.find(o => o.id === element)
            var total_pagos = 0
            let pagos = obj.payments

            if (pagos.length > 0 ) {
                pagos.forEach(pago => {
                    total_pagos += parseFloat(pago.amount)
                })
            }
            pendiente_pagos = parseFloat(obj.real_price) - total_pagos
            objs.push(obj)

        if (objs[i]) {
            const item = {
                "sale_type": "package",
                "qty": 1,
                "product_name": obj.name + ' ' + obj.patient,
                "unit_price": obj.real_price / obj.partialities,
                "patient_package": obj.id,
                "total": obj.real_price,
                "pending": pendiente_pagos,
                "paid": total_pagos,
                "patient_package": obj.id,
                "product": null
            }
                console.log(item)
                items.push(item)
            }
            data.total = 0
            data.items = items
            this.setState({ data })
        i+=1
    })

    this.calculateTotal()
    }

    searchProductCode = () =>{
        let products = this.state.selected_products
        let data = this.state.data
        let total = data.total
        let items = data.items
        let objs = []
        var i=0

        products.forEach(element => {
            let obj = this.state.products.find(o => o.id === element)
            total += parseFloat(obj.price)
            objs.push(obj)

        if (objs[i]) {
            let found_item_index = items.findIndex(o => o.value === obj.id)
            if (found_item_index != -1) {
                items[found_item_index].qty++
            } else {
                const item = {
                    "sale_type": "product",
                    "qty": 1,
                    "product_name": obj.name,
                    "unit_price": obj.price,
                    "product": obj.id
                }
                items.push(item)
            }
            data.total = total
            data.items = items
            this.setState({ data })
        } else {
            console.log('No se encontró el producto')
        }
        i+=1
    });
    this.calculateTotal()
    }

    searchServiceCode = () =>{
        let services = this.state.selected_services
        let data = this.state.data
        let total = data.total
        let items = data.items
        let objs = []
        var i=0

        services.forEach(element => {
            let obj = this.state.services.find(o => o.id === element)
            total += parseFloat(obj.price)
            objs.push(obj)

        if (objs[i]) {
            let found_item_index = items.findIndex(o => o.value === obj.id)
            if (found_item_index != -1) {
                items[found_item_index].qty++
            } else {
                const item = {
                    "sale_type": "service",
                    "qty": 1,
                    "product_name": obj.name,
                    "real_price":obj.price,
                    "unit_price": obj.price,
                    "service":obj.id
                }
                items.push(item)
            }
            data.total = total
            data.items = items
            this.setState({ data })
        } else {
            console.log('No se encontró el producto')
        }
        i+=1
    });
    this.calculateTotal()
    }

    changeProductQty(value, index){
        let data = this.state.data
        let items = data.items

        if (items[index].qty == 1 && value == '-'){
            console.log('No es posible tener menos de un producto en el paquete')
            return false
        }
        switch(value){
            case '+':
                items[index].qty += 1
                break
            case '-':
                items[index].qty -= 1
                break
            default:
                console.log('el parámetro de la función changeProductQty no es aceptado.')
                return false
        }
        data.items = items
        this.calculateTotal()
        this.setState({ data })
    }

    changeAppointmentName = (name) => {
        let appointment_name = name.target.value
        this.setState({ appointment_name })
    }

    changeAppointmentPrice = (price) => {
        let appointment_price = price.target.value
        this.setState({ appointment_price })
    }

    calculateTotal = () => {
        let total = 0
        this.state.data.items.forEach(item => {
            let total_item = item.unit_price * item.qty
            total += total_item
        });
        let data = this.state.data
        data.total = total
        this.setState({ data, total })
    }

    changeServicePayment = (service_price) => {
        let data = this.state.data
        data.items[this.state.index].unit_price = service_price.target.value
        this.calculateTotal()
        this.setState({ data, service_price })
    }

    changePackagePayment = (package_price) => {
        let data = this.state.data
        data.items[this.state.index].unit_price = package_price.target.value
        this.calculateTotal()
        this.setState({ data, package_price })
    }

    clickInTab(selected_tab){
        this.setState({ selected_tab })
    }

    deleteProduct = ( index ) => {
        let data = this.state.data
        let items = data.items
        data.items.splice(index, 1)
        this.setState({ data }, () => this.calculateTotal())
    }

    deleteProducts = ( ) => {
        let data = this.state.data
        let items = data.items
        data.items.splice(0, items.length)
        this.setState({ data }, () => this.calculateTotal())
    }

    selectIndex = (index) => {
        this.setState({ index })
    }

    abrirTicket = () => {
        let ticketVisible = true
        this.setState({ ticketVisible })
    }

    cerrarTicket = () => {
        this.setState({ ticketVisible: false })
        Router.pushRoute('sales')
    }

    async cobrar(){
        let values = this.state.data
        try {
            const resp = await addSale(values)
            let venta = resp.data
            alertify.success('Venta agregada con exito')
            this.abrirTicket()
            this.setState({ venta })
        } catch (error) {
            alertify.error(error.response.data[0])
        }
    }

    render(){
        const breadcrumb = [
            { 
            name: "ADEL", url: "admin", active: false, title:"CAJA",total:0 },
            { name: "Ventas", url: "sales", active: false },
            { name: "Caja", url: "", active: true },
        ]
        const {
            products_combo,
            services_combo,
            associates_combo,
            packages_combo,
            appointments_combo,
            ticketVisible
        } = this.state

        return (
            <Layout title='Caja' selectedMenu="cash" breadcrumb={ breadcrumb }>
                <div className="card height-90">
                    <div className="card-content height-100">
                        <div className="columns is-multiline">
                            <div className='column is-12 tabs is-small'>
                                <div className="columns">
                                <ul id="tabs">
                                    <li className={`column is-3 ${this.state.selected_tab == "1" && 'is-active'}`} onClick={(e) => this.clickInTab(1)}>
                                        <a className={`${this.state.selected_tab == "1" && 'selected'}`}><h4 className="subtitle is-4">Productos</h4></a>
                                    </li>
                                    <li className={`column is-3 ${this.state.selected_tab == "2" && 'is-active'}`}onClick={(e) => this.clickInTab(2)}>
                                        <a className={`${this.state.selected_tab == "2" && 'selected'}`}><h4 className="subtitle is-4">Servicios</h4></a>
                                    </li>
                                    <li className={`column is-3 ${this.state.selected_tab == "3" && 'is-active'}`} onClick={(e) => this.clickInTab(3)}>
                                        <a className={`${this.state.selected_tab == "3" && 'selected'}`}><h4 className="subtitle is-4">Paquetes</h4></a>
                                    </li>
                                    <li className={`column is-3 ${this.state.selected_tab == "4" && 'is-active'}`} onClick={(e) => this.clickInTab(4)}>
                                        <a className={`${this.state.selected_tab == "4" && 'selected'}`}><h4 className="subtitle is-4">Citas</h4></a>
                                    </li>
                                </ul>
                                </div>
                            </div>
                        
                            <div className="column is-3">
                                <label>Asociado</label>
                                <Select
                                    instanceId
                                    isMulti
                                    onChange={ this.selectAssociate }
                                    options={ associates_combo }
                                />
                            </div>

                        {/* SECCION PRODUCTOS */}
                        <div className={this.state.selected_tab == 1?'column is-7':'hide'} id="tab_general">
                            <label>Productos</label>
                            <Select
                                instanceId
                                isMulti
                                closeMenuOnSelect={true}
                                onChange={ this.selectProduct }
                                options={ products_combo }
                            />
                        </div>

                        <div className={this.state.selected_tab == 2?'column is-7':'hide'} id="tab_servicios">
                            <label>Servicios</label>
                            <Select
                                instanceId
                                isMulti
                                closeMenuOnSelect={true}
                                onChange={ this.selectService }
                                options={ services_combo }
                            />
                        </div>

                        <div className={this.state.selected_tab == 3?'column is-7':'hide'} id="tab_paquetes">
                            <label>Paquetes</label>
                            <Select
                                instanceId
                                isMulti
                                closeMenuOnSelect={false}
                                onChange={ this.selectPackage }
                                options={ packages_combo }
                            />
                        </div>
                        <div className={this.state.selected_tab == 4?'column is-6':'hide'} id="tab_appointments">
                            <label>Cita</label>
                            <Select
                                instanceId
                                isMulti
                                closeMenuOnSelect={true}
                                onChange={ this.selectAppointments }
                                options={ appointments_combo }
                            />
                        </div>
                        <div className={this.state.selected_tab == 4?'column is-1':'hide'} id="tab_appointments">
                            <label>Precio</label>
                            <input
                                type="text"
                                className="input"
                                onChange={ this.changeAppointmentPrice }
                            />
                        </div>

                        <div className="column is-2">
                            <label className="invisible">m</label><br></br>
                            { this.state.selected_tab == 1 && <button className=" button is-info" onClick={() => this.searchProductCode()}>Buscar</button>}
                            {this.state.selected_tab == 2 && <button className=" button is-info" onClick={() => this.searchServiceCode()}>Buscar</button>}
                            {this.state.selected_tab == 3 && <button className=" button is-info" onClick={() => this.searchPackages()}>Buscar</button>}
                            {this.state.selected_tab == 4 && <button className=" button is-info" onClick={() => this.searchAppointments()}>Buscar</button>}
                        </div>
                        <div className={this.state.selected_tab == 1?'column is-12':'hide'} id="tab_general">
                            <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tipo de venta</th>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Total</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.data.items.map((item, index) => (
                                        <tr key={ index }>
                                            <td>{ index + 1 }</td>
                                            <td>{ item.sale_type == 'product' ? 'Producto':item.sale_type == 'package' ? 'Paquete':item.sale_type == 'appointment' ? 'Cita': 'Servicio'}</td>
                                            <td>{ item.product_name }</td>
                                            { item.sale_type != 'product' ? <td>No aplica</td>:
                                            <td className="sesiones">
                                                <input className="minus" type="button" disabled={ this.state.num_sessions == 1 } onClick={(e) => this.changeProductQty('-',index)} value="-" />
                                                <input className="qty" type="text" value={ item.qty } disabled onChange={(e) => this.changeProductQty('-',index)} />
                                                <input className="plus" type="button" onClick={(e) => this.changeProductQty('+',index)} value="+" />
                                            </td>
                                            }
                                            <td>$ { item.unit_price }</td>
                                            <td>{ item.qty * item.unit_price }</td>
                                            <td>
                                            <p className="buttons is-centered">
                                                <a onClick={ (e) => this.deleteProduct(index)} className="button is-small is-danger is-outlined tooltip" data-tooltip="Borrar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-trash"></i>
                                                    </span>
                                                </a>
                                            </p>
                                            </td>
                                        </tr>
                                    )) }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Venta total</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th>${ this.state.total }</th>
                                        <th>
                                            <p className="buttons is-centered">
                                                <a onClick={ (e) => this.deleteProducts()} className="button is-small is-danger is-outlined tooltip" data-tooltip="Borrar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-trash"></i>
                                                    </span>
                                                </a>
                                            </p>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                        {/* SECCION SERVICIOS */}
                        <div className={this.state.selected_tab == 2?'column is-12':'hide'} id="tab_servicios">
                            <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tipo de venta</th>
                                        <th>Servicio</th>
                                        <th>Precio</th>
                                        <th>Pago</th>
                                        <th>Total</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.data.items.map((item, index) => (
                                        <tr key={ index }>
                                            <td>{ index + 1 }</td>
                                            <td>{ item.sale_type == 'product' ? 'Producto':item.sale_type == 'package' ? 'Paquete':item.sale_type == 'appointment'? 'Cita': 'Servicio'}</td>
                                            <td>{ item.product_name }</td>
                                            <td>$ { item.unit_price }</td>
                                            <td onClick={(e) => this.selectIndex(index)}>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    onChange={ this.changeServicePayment }
                                                    value = { item.unit_price}>
                                                </input>
                                            </td>
                                            <td>{ item.qty * item.unit_price }</td>
                                            <td>
                                            <p className="buttons is-centered">
                                                <a onClick={ (e) => this.deleteProduct(index)} className="button is-small is-danger is-outlined tooltip" data-tooltip="Borrar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-trash"></i>
                                                    </span>
                                                </a>
                                            </p>
                                            </td>
                                        </tr>
                                    )) }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Venta total</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th>${ this.state.total }</th>
                                        <th>
                                            <p className="buttons is-centered">
                                                <a onClick={ (e) => this.deleteProducts()} className="button is-small is-danger is-outlined tooltip" data-tooltip="Borrar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-trash"></i>
                                                    </span>
                                                </a>
                                            </p>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* SECCION PAQUETES */}
                        <div className={this.state.selected_tab == 3?'':'hide'} id="tab_packages">
                            <div>
                                <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tipo de venta </th>
                                            <th>Paquete </th>
                                            <th>Costo total</th>
                                            <th>Abonos</th>
                                            <th>Restante</th>
                                            <th>Abono</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.data.items.map((item, index) => (
                                            <tr key={ index }>
                                                <td>{ index + 1 }</td>
                                                <td>{ item.sale_type == 'product' ? 'Producto':item.sale_type == 'package' ? 'Paquete':item.sale_type == 'appointment'? 'Cita': 'Servicio'}</td>
                                                <td>{ item.product_name}</td>
                                                { item.sale_type != 'package' ?<td>No aplica</td> : <td>${ item.total } </td> }
                                                { item.sale_type != 'package' ?<td>No aplica</td> : <td>${ item.paid } </td> }
                                                { item.sale_type != 'package' ?<td>No aplica</td> : <td>${ item.pending } </td> }
                                                <td onClick={(e) => this.selectIndex(index)}>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        onChange={ this.changePackagePayment }
                                                        value = { item.unit_price}>
                                                    </input>
                                                </td>
                                                <td>
                                                <p className="buttons is-centered">
                                                    <a onClick={ (e) => this.deleteProduct(index)} className="button is-small is-danger is-outlined tooltip" data-tooltip="Borrar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-trash"></i>
                                                        </span>
                                                    </a>
                                                </p>
                                                </td>
                                            </tr>
                                        )) }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th>Venta total</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>${ this.state.total }</th>
                                            <th>
                                                <p className="buttons is-centered">
                                                    <a onClick={ (e) => this.deleteProducts()} className="button is-small is-danger is-outlined tooltip" data-tooltip="Borrar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-trash"></i>
                                                        </span>
                                                    </a>
                                                </p>
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* SECCION CITAS */}
                        <div className={this.state.selected_tab == 4?'':'hide'} id="tab_appointments">
                        { this.state.data.items.length > 0 ?
                            <div>
                                <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tipo de venta </th>
                                            <th>Concepto </th>
                                            <th>Precio</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.data.items.map((item, index) => (
                                            <tr key={ index }>
                                                <td>{ index + 1 }</td>
                                                <td>{ item.sale_type == 'product' ? 'Producto':item.sale_type == 'package' ? 'Paquete':item.sale_type == 'appointment'? 'Cita': 'Servicio'}</td>
                                                <td>{ item.product_name}</td>
                                                <td>${ item.unit_price }</td>
                                                <td>
                                                <p className="buttons is-centered">
                                                    <a onClick={ (e) => this.deleteProduct(index)} className="button is-small is-danger is-outlined tooltip" data-tooltip="Borrar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-trash"></i>
                                                        </span>
                                                    </a>
                                                </p>
                                                </td>
                                            </tr>
                                        )) }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th>Venta total</th>
                                            <th></th>
                                            <th></th>
                                            <th>${ this.state.total }</th>
                                            <th>
                                                <p className="buttons is-centered">
                                                    <a onClick={ (e) => this.deleteProducts()} className="button is-small is-danger is-outlined tooltip" data-tooltip="Borrar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-trash"></i>
                                                        </span>
                                                    </a>
                                                </p>
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                                <button className="button is-info"  onClick={() => this.cobrar() }>Cobrar</button>
                            </div>
                            :
                                <div className="div-wrapper">
                                    <p>No hay elementos en caja</p>
                                </div>
                            }

                    </div>

                            <Ticket
                                activo={ticketVisible}
                                titulo={'Resumen de venta'}
                                botonConfirmacion={'Imprimir ticket'}
                                botonCancelar={'Cerrar'}
                                cerrarTicket={this.cerrarTicket}
                            >
                            <div className="ticket-wrapper">
                                <div className="ticket-header">
                                    Resumen de venta
                                </div>
                                <div className="ticket-content">
                                    <p><b>{friendlyFullDateformat(this.state.venta.created_at)} - Folio {this.state.venta.id}</b></p>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Concepto </th>
                                                <th>Precio </th>
                                                <th>Cantidad </th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { this.state.venta.items.map((item, index) => (
                                                <tr key={ index }>
                                                    <td>{ item.product_name}</td>
                                                    <td>{ item.unit_price}</td>
                                                    <td>{ item.qty}</td>
                                                    <td>${ item.total }</td>
                                                </tr>
                                            )) }
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td>Total</td>
                                                <td></td>
                                                <td></td>
                                                <td>${ this.state.venta.total }</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            </Ticket>
                        <style jsx>{`
                            .sesiones {
                                padding: 10px;
                                border: 1px solid #cacaca;
                                border-radius: 4px;
                                margin-bottom:1rem;
                                margin-top:1rem;
                            }
                            .sesiones>button {
                                margin-left:2rem;
                            }
                            .sesiones>input, .sesiones>select, .sesiones>button, textarea {
                                -webkit-appearance: none;
                                -ms-flex-align: center;
                                border: 1px solid transparent;
                                border-radius: 3px;
                                font-size: 1rem;
                                -webkit-box-pack: start;
                                -ms-flex-pack: start;
                                -webkit-justify-content: flex-start;
                                -ms-flex-pack: start;
                                padding-bottom: calc(.375em - 1px);
                                padding-left: calc(.625em - 1px);
                                padding-right: calc(.625em - 1px);
                                padding-top: calc(.375em - 1px);
                                background-color: #fff;
                                border-color: #dbdbdb;
                                color: #363636;
                                cursor: pointer;
                            }
                            .sesiones>input, .sesiones>button {
                                height: 2em;
                            }
                            .qty{
                                width:50px;
                            }
                            .minus{
                                background: #fd1d1d;
                                color: white;
                                font-weight: 700;
                                border-radius: 2px;
                            }
                            .sesiones>button {
                                padding:5px;
                                color: white;
                                font-size:16px;
                                font-weight: 500;
                                border-radius:4px;
                                background: #209cee;
                            }
                            .div-wrapper{
                                padding: 0.5rem;
                                margin-bottom: 0.5rem;
                                text-align:center;
                                font-size:18px;
                                font-weight:600;
                            }
                            .invisible{
                                color:white;
                            }
                            .tabs ul {
                                border-bottom-color: #ffffff;
                            }
                            .selected {
                                border: 2px solid #1e9dee;
                                color: white;
                                border-radius: 5px;
                            }
                            .is-active a {
                                color: #ffffff;
                            }
                            .cash-closing {
                                margin-left:1rem;
                            }
                            .ticket-wrapper{
                                width: 70%;
                                border: 1px solid #b7b7b7;
                                border-radius: 4px;
                                box-shadow: 1px 3px 8px #717171;
                                height: 500px;
                                margin: 19px 20px 20px 17%;
                                background:white;
                            }
                            .ticket-header {
                                border-bottom: 1px solid #9e9e9e;
                                font-size: 18px;
                                font-weight: 500;
                            }
                            .ticket-content {
                                width:90%;
                                margin: auto;
                            }
                            @media print {
                                .main {
                                    display:none;
                                }
                             }
                            `
                            }
                        </style>
                </div>
            </div>
        </Layout>
        )
    }
}