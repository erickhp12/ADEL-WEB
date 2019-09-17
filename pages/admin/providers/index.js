import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getProviders } from '../../../services/providers'
import Paginacion from '../../../components/Paginacion'
import { hasPermission } from '../../../components/permission';

export default class extends React.Component{
    state = {
        objects: [],
        total_records: 0,
        page_limit: 20
    }

    async componentDidMount() {
        try {
            const req = await getProviders({ limit: this.state.page_limit})
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
            const req = await getProviders(params)
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
            { name: "Proveedores", url: "", active: true }
        ]
        return (
            <Layout title="Proveedores" selectedMenu="providers" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">Proveedores</h4>
                        <Link route="add_provider">
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
                                                { hasPermission(101) ?
                                                <Link route="edit_provider" params={{ id: obj.id }}>
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
