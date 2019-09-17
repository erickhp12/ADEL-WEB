import Layout from "../../../components/layouts/Layout"
import { Link } from '../../../routes'
import {  timeFormat, friendlyDateformat, currencyformat } from '../../../filters/filters'
import { getAllSalesByCashClosing } from '../../../services/sales'


export default class extends React.Component{
    state = {
        cash_closing_id:0,
        total:0,
        data: {
            branch_office:null,
            start_date:null,
            end_date:null
        },
        cortes:[]
    };

    async componentDidMount() {
        let resp = await getAllSalesByCashClosing()
        let cortes = resp.data.results
        this.setState({ cortes })
    }

    async getSalesByCashClosing (cash_closing_id) {
        let resp = await getAllSalesByCashClosing(cash_closing_id)
        let ventas = resp.data.sales
        let items = []

        ventas.forEach(item => {
            item.items.forEach(element => {
                item = {
                    sale_type: element.sale_type,
                    product_name:element.product_name,
                    unit_price:element.unit_price,
                    qty: element.qty,
                    total: element.total,
                }
            items.push(item)
            })
        })
        ventas = items
        let total = 0
        if (ventas.length > 0 ){
            total = resp.data.total
        }
        this.setState({ ventas, total })
    }

    render(){

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Caja", url: "cash", active: false }
        ]
        return (
            <Layout title="Cortes" selectedMenu="sales" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">Cortes</h4>

                        { this.state.cortes.length > 0 ?
                            <div>
                                <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Sucursal</th>
                                            <th>Fecha inicio</th>
                                            <th>Fecha fin</th>
                                            <th>Total</th>
                                            <th>Total en caja</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    { this.state.cortes.map((item, index) => (
                                        <tr key={ index }>
                                            <td>{ index + 1 }</td>
                                            <td>{ item.branch_office }</td>
                                            <td>{ friendlyDateformat(item.start_date) } { timeFormat(item.start_date) }</td>
                                            <td>{ friendlyDateformat(item.end_date) } { timeFormat(item.end_date) }</td>
                                            <td>{ currencyformat(parseFloat(item.total)) }</td>
                                            <td>{ currencyformat(parseFloat(item.total_real)) }</td>
                                            <td>
                                                <Link route="cash-closing-detail" params={{ id: item.id }}>
                                                    <p className="control buttons is-centered">
                                                        <a className="button is-primary is-outlined tooltip" data-tooltip="Editar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-eye"></i>
                                                        </span>
                                                        <span>Ver</span>
                                                        </a>
                                                    </p>
                                                </Link>
                                            </td>
                                        </tr>
                                        )) }
                                    </tbody>
                                </table>
                            </div>
                            :
                                <div className="div-wrapper">
                                    <p>No hay elementos en caja</p>
                                </div>
                            } 
                    </div>
                </div>
            </Layout>
        )
    }
}
