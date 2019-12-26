import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getProducts, currencyformat } from '../../../services/products'
import Paginacion from '../../../components/Paginacion'
import { hasPermission } from '../../../components/permission'

export default class extends React.Component{
    state = {
        objects: [],
        total_records: 0,
        page_limit: 20
    }

    async componentDidMount() {
        try {
            const req = await getProducts({ limit: this.state.page_limit })
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
            const req = await getProducts(params)
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    render(){
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false,
            title:"PRODUCTOS",total:0 },
            { name: "Productos", url: "", active: true },
        ]
        return (
            <Layout title="Productos" selectedMenu="products" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">Productos</h4>

                        <Link route="add_product">
                            <a className="button is-info is-pulled-left is-radiusless">
                                <span className="icon is-small">
                                    <i className="fas fa-plus"></i>
                                </span>
                                <span>Agregar</span>
                            </a>
                        </Link>

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

                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Codigo</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Agregado por</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            { this.state.objects.map((obj) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.product_code }</td>
                                        <td>{ obj.name }</td>
                                        <td>{ currencyformat(parseFloat(obj.price)) }</td>
                                        <td>{ obj.user }</td>
                                        <td>
                                            <p className="buttons is-centered">
                                                { hasPermission(65) ?
                                                <Link route="edit_product" params={{ id: obj.id }}>
                                                    <a className="button is-small is-primary is-outlined tooltip" data-tooltip="Editar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-pen"></i>
                                                        </span>
                                                        <span>Editar</span>
                                                    </a>
                                                </Link>
                                                : <a></a>}
                                            </p>
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
            </Layout>
        )
    }
}
