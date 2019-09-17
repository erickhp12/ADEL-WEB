import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getServiceCategories } from '../../../services/service_categories'
import Paginacion from '../../../components/Paginacion'

export default class extends React.Component{
    state = {
        objects: [],
        total_records: 0,
        page_limit: 20
    }

    async componentDidMount() {
        try {
            const req = await getServiceCategories({ limit: this.state.page_limit})
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
            const req = await getServiceCategories(params)
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    render(){
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Categorías de Servicio", url: "", active: true }
        ]
        return (
            <Layout title="Categorías de Servicio" selectedMenu="service_categories" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">Categorías de Servicio</h4>

                        <Link route="add_service_category">
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
                                    <th>Nombre</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.objects.map((obj) => (
                                <tr key={obj.id}>
                                    <td>{ obj.name }</td>
                                    <td>
                                        <p className="buttons is-centered">
                                            <Link route="edit_service_category" params={{ id: obj.id }}>
                                                <a className="button is-small is-primary is-outlined tooltip" data-tooltip="Editar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-pen"></i>
                                                    </span>
                                                    <span>Editar</span>
                                                </a>
                                            </Link>
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
