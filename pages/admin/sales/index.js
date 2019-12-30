import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getSales } from '../../../services/sales'
import Paginacion from '../../../components/Paginacion'
import { friendlyDateformat, timeFormat, currencyformat} from '../../../filters/filters'
import { hasPermission } from '../../../components/permission';

export default class extends React.Component{
    state = {
        objects: [],
        total_records: 0,
        page_limit: 20
    }

    async componentDidMount() {
        try {
            const req = await getSales({ limit: this.state.page_limit})
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
        } catch (error) {
            console.log(error)
        }   
    }

    onPageChanged = async data => {
        const offset = (data.currentPage - 1) * this.state.page_limit
        const params = { offset, limit: this.state.page_limit }
        try {
            const req = await getSales(params)
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    render(){
        const breadcrumb = [
            { 
            name: "ADEL", url: "admin", active: false,
            title:"VENTAS",total:0 },
            { name: "Ventas", url: "", active: true },
        ]
        return (
            <Layout title="Ventas" selectedMenu="sales" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        { hasPermission(85)? 
                        <Link route="cash">
                            <a className="button is-info is-pulled-left is-radiusless">
                                <span className="icon is-small">
                                    <i className="fas fa-plus"></i>
                                </span>
                                <span>Agregar</span>
                            </a>
                        </Link>
                        : <a></a>}
                        <div className="field has-addons is-pulled-right">
                            <div className="control">
                                <input className="input is-radiusless" type="text" placeholder="Buscar..." />
                            </div>
                            <div className="control">
                                <button type="button" className="button is-info is-radiusless">
                                    <span className="icon is-small">
                                        <i className="fas fa-search"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <Link route="cash-closing">
                            <a className="button cash-closing is-info is-outlined is-pulled-right is-radiusless">
                                <span className="icon is-small">
                                    <i className="fas fa-money-bill"></i>
                                </span>
                                <span>Realizar corte</span>
                            </a>
                        </Link>
                        <Link route="cash-closing-list">
                            <a className="button is-info is-outlined is-pulled-right is-radiusless">
                                <span className="icon is-small">
                                    <i className="fas fa-eye"></i>
                                </span>
                                <span>Ver cortes</span>
                            </a>
                        </Link>
                        <table className="table is-fullwidth is-striped is-hoverable">
                            <thead>
                                <tr>
                                    <th>Sucursal</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Hecha por</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.objects.map((obj,index) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.branch_office }</td>
                                        {/* <td>{ obj.vendors[index].first_name } { obj.vendors[index].last_name }</td> */}
                                        <td>{ friendlyDateformat(obj.created_at) } { timeFormat(obj.created_at) } </td>
                                        <td>{ currencyformat(parseFloat(obj.total)) }</td>
                                        <td>{ obj.user }</td>
                                        <td>
                                            <Link route="sale_detail" params={{ id: obj.id }}>
                                                <p className="control buttons">
                                                    <a className="button is-primary tooltip" data-tooltip="Editar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-eye"></i>
                                                    </span>
                                                    <span>Ver detalle</span>
                                                    </a>
                                                </p>
                                            </Link>
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>

                        <div>
                            Mostrando <strong> {this.state.objects.length} </strong> de <strong> {this.state.total_records} </strong> registros.
                            <Paginacion
                                totalRecords={this.state.total_records}
                                pageLimit={this.state.page_limit}
                                pageNeighbours={1}
                                onPageChanged={this.onPageChanged}
                            />
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .has-addons, .cash-closing{
                        margin-left:1rem;
                    }
                `}
                </style>
            </Layout>
        )
    }
}
