import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getBranchOffices } from '../../../services/branch_offices'
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
            const req = await getBranchOffices({ limit: this.state.page_limit})
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
            const req = await getBranchOffices(params)
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
            title:"INENTARIO",total:0 },
            { name: "Inventario", url: "", active: true },
        ]
        return (
            <Layout title="Inventario" selectedMenu="inventory" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
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

                        <table className="table is-fullwidth is-striped is-hoverable">
                            <thead>
                                <tr>
                                    <th>Sucursal</th>
                                    <th>Inventario iniciado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.objects.map((obj, index) => (
                                    <tr key={ obj.id }>
                                        <td>{ obj.name}</td>
                                        <td>{ obj.initialized_inventory ? 'Si': 'No'}</td>
                                        <td>
                                            { hasPermission(67) ?
                                            <p className="buttons">
                                                { obj.initialized_inventory ? 
                                                    <Link route="inventory_branch_office" params={{ id: obj.id }}>
                                                        <a className="button is-small is-primary tooltip" data-tooltip="Ajustar inventario">
                                                            <span className="icon is-small">
                                                                <i className="fas fa-file-signature"></i>
                                                            </span>
                                                            <span>Ajustar</span>
                                                        </a>
                                                    </Link>
                                                    :
                                                    <Link route="inventory_branch_office" params={{ id: obj.id }}>
                                                        <a className="button is-small is-info tooltip" data-tooltip="Iniciar inventario">
                                                            <span className="icon is-small">
                                                                <i className="fas fa-file-import"></i>
                                                            </span>
                                                            <span>Iniciar</span>
                                                        </a>
                                                    </Link>
                                                }
                                            </p>
                                            :<p></p>}
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