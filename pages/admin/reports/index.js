import Layout from '../../../components/layouts/Layout'
import { getIncentives, payComission } from '../../../services/incentives'
import { friendlyDateformat, djangoDateFormat } from '../../../filters/filters'
import Flatpickr from 'react-flatpickr'
import { getSales } from '../../../services/sales'
import { Link } from '../../../routes'
import { getPackagesInfo } from '../../../services/patients'

export default class extends React.Component {
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Reportes' : title='Reportes'
        return { id, title }
    }

    state = {
        incentivos: [],
        ventas: [],
        start_date:new Date(),
        end_date: new Date(),
        data: {},
        notes: [],
        citas: [],
        paquetes:[],
        total_ventas:0,
        total_comisiones:0,
        total_porcentaje_comisiones:0,
        selected_tab: 1

    }

    async componentDidMount() {

        //TRAE COMISIONES
        try {
            const req = await getIncentives()
            const incentivos = req.data.results
            let total_comisiones = 0
            let total_porcentaje_comisiones = 0
            incentivos.forEach(element => {
                total_comisiones += parseInt(element.total)
                total_porcentaje_comisiones += parseInt(element.amount)
            })
            this.setState({ incentivos, total_comisiones, total_porcentaje_comisiones })
        } catch (error) {
            console.log(error)
        }

        //TRAE VENTAS
        try {
            const req = await getSales()
            const ventas = req.data.results
            let total_ventas = 0
            ventas.forEach(element => {
                total_ventas += parseInt(element.total)
            })
            this.setState({ ventas, total_ventas })
        } catch (error) {
            console.log(error)
        }

        //TRAE REPORTE DE PAQUETES
        try {
            const req = await getPackagesInfo()
            console.log('req')
            console.log(req)
            const paquetes = req.data
            this.setState({ paquetes })
        } catch (error) {
            console.log(error)
        }
    }

    getColor(status) {
        if (status == 'activo'){
            return 'pending'
        }
        if (status == 'liquidado'){
            return 'paid'
        }
    }

    searchValues =() => {
        let start_date = djangoDateFormat(this.state.start_date)
        let end_date = djangoDateFormat(this.state.end_date)
    }

    clickInTab(selected_tab){
        this.setState({ selected_tab })
    }

    async pagarComision(comision){
        comision.effected = true
        await payComission(comision.pk, comision)
        const req = await getIncentives()
        const incentivos = req.data.results
        this.setState({ incentivos })
    }

    render(){
        const { id, title } = this.props
        const { start_date, end_date, options } = this.state

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Reportes", url: "reports", active: false },
            { name: title, url: "", active: true }
        ]

        return (
            <Layout title={ title } selectedMenu="reports" breadcrumb={breadcrumb}>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">{ title } <b>{ this.state.data.first_name } { this.state.data.last_name }</b></h4>
                        <div className="tabs is-small">
                            <ul id="tabs">
                                <li className={this.state.selected_tab == 1?'is-active':''} onClick={(e) => this.clickInTab(1)}><a>Comisiones</a></li>
                                <li className={this.state.selected_tab == 2?'is-active':''} onClick={(e) => this.clickInTab(2)}><a>Ventas</a></li>
                                <li className={this.state.selected_tab == 3?'is-active':''} onClick={(e) => this.clickInTab(3)}><a>Paquetes</a></li>
                            </ul>
                        </div>
                        <div className={this.state.selected_tab == 1?'':'hide'} id="tab_reportes">
                            {/* <div className="columns field">
                                <div className="column is-2">
                                    <label className="label has-text-grey has-text-weight-semibold">Fecha  inicio</label>
                                    <Flatpickr
                                        value={ start_date }
                                        options={{options}}
                                    />
                                </div>
                                <div className="column is-2">
                                    <label className="label has-text-grey has-text-weight-semibold">Fecha fin</label>
                                    <Flatpickr
                                        value={ end_date }
                                        options={{options}}
                                    />
                                </div>
                                <div className="column is-2">
                                    <label className="label has-text-grey has-text-weight-semibold">&nbsp;</label>
                                    <button className="button is-info" onClick={ this.searchValues } >Buscar</button>
                                </div>
                            </div> */}

                            <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Asociado</th>
                                    <th>Porcentaje</th>
                                    <th>Total venta</th>
                                    <th>Comisión</th>
                                    <th>Concepto</th>
                                    <th>Fecha</th>
                                    <th>Pagado</th>
                                </tr>
                            </thead>
                            <tbody>
                            { this.state.incentivos.map((obj) => (
                                <tr key={obj.pk}>
                                    <td>{ obj.associate_str }</td>
                                    <td>{ parseInt(obj.percentage) }%</td>
                                    <td>${ obj.total }</td>
                                    <td>${ obj.amount }</td>
                                    <td>{ obj.comment }</td>
                                    <td>{ friendlyDateformat(obj.created_at) }</td>
                                    <td>{ obj.effected == true ?
                                        <button className="button is-small is-success tooltip disabled" data-tooltip="Pagado">
                                            <span>Pagado</span>
                                        </button>
                                    :
                                        <button onClick={ (e) => this.pagarComision(obj) } className="button is-small is-success is-outlined tooltip" data-tooltip="Editar">
                                            <span className="icon is-small">
                                                <i className="fas fa-money-bill-alt"></i>
                                            </span>
                                            <span>pagar</span>
                                        </button>
                                        }</td>
                                </tr>
                            )) }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><b>Total</b></td>
                                    <td></td>
                                    <td><b>${this.state.total_porcentaje_comisiones}</b></td>
                                    <td><b>${this.state.total_comisiones}</b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                        </div>

                        <div className={this.state.selected_tab == 2?'':'hide'} id="tab_ventas">
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Sucursal</th>
                                    <th>Total</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.ventas.map((obj) => (
                                <tr key={obj.id}>
                                    <td>{ obj.branch_office }</td>
                                    <td>${ obj.total }</td>
                                    <td>{ friendlyDateformat(obj.created_at) }</td>
                                    <td>
                                        <p className="buttons is-centered">
                                        <Link route="sale_detail" params={{ id: obj.id|| 0 }}>
                                            <a className="button is-small is-success tooltip" data-tooltip="Editar">
                                                <span className="icon is-small">
                                                    <i className="fas fa-pen"></i>
                                                </span>
                                            </a>
                                        </Link>
                                        </p>
                                    </td>
                                </tr>
                                )) }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><b>Total</b></td>
                                    <td></td>
                                    <td><b>${this.state.total_ventas}</b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                        </div>

                        <div className={this.state.selected_tab == 3?'':'hide'} id="tab_paquetes">
                            <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Estado</th>
                                    <th>Semanas</th>
                                    <th>Precio</th>
                                    <th>Pagado</th>
                                    <th>Pendiente</th>
                                    <th>Parcialidades</th>
                                    <th>Fecha de creacion</th >
                                    <th>Detalles</th >
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.paquetes.map((obj) => (
                                <tr className={this.getColor(obj.status)} key={obj.id}>
                                    <td> { obj.patient }</td>
                                    <td> { obj.status }</td>
                                    <td> { obj.past_weeks }</td>
                                    <td> { obj.real_price }</td>
                                    <td>${ obj.paid }</td>
                                    <td>${ obj.due }</td>
                                    <td> { obj.num_partialities }</td>
                                    <td> { friendlyDateformat(obj.created_at) }</td>
                                    <td className="blank"> 
                                        <p className="buttons is-centered">
                                            <Link route="package_detail" params={{ patient_package_id: obj.id|| 0 }}>
                                                <a className="button is-small is-primary is-outlined tooltip" data-tooltip="Editar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-eye"></i>
                                                    </span>
                                                    <span>Ver </span>
                                                </a>
                                            </Link>
                                        </p>
                                    </td>
                                </tr>
                                )) }
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .pending{
                        background: #ffc !important;
                    }
                    .paid{
                        background: #c3ffc9cc !important;
                    }
                    .blank{
                        background: #fff;
                    }
                `}
                </style>
            </Layout>
        )
    }
}