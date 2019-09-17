import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getPackages } from '../../../services/packages'
import Paginacion from '../../../components/Paginacion'
import { getPatientPackages } from '../../../services/patients'
import { hasPermission } from '../../../components/permission';

export default class extends React.Component{
    state = {
        objects: [],
        patient_packages: [],
        total_records: 0,
        total_records_packages: 0,
        page_limit: 20,
        selected_tab:1
    }

    async componentDidMount() {
        try {
            const req = await getPackages({ limit: this.state.page_limit})
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
        } catch (error) {
            console.log(error)
        }

        try {
            const req = await getPatientPackages({ limit: this.state.page_limit})
            const patient_packages = req.data.results
            const total_records_packages = req.data.count
            this.setState({ patient_packages, total_records_packages })
        } catch (error) {
            console.log(error)
        }
    }

    clickInTab(selected_tab){
        this.setState({ selected_tab })
    }

    onPageChanged = async data => {
        const offset = (data.currentPage - 1) * this.state.page_limit
        const params = { offset, limit: this.state.page_limit }
        try {
            const req = await getPackages(params)
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
            { name: "Paquetes", url: "", active: true }
        ]
        return (
            <Layout title="Paquetes" selectedMenu="packages" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                    
                    <div className='columns tabs is-small'>
                        <ul id="tabs">
                            <li className={`column is-6 ${this.state.selected_tab == "1" && 'is-active'}`} onClick={(e) => this.clickInTab(1)}><a><h4 className="subtitle is-4">Paquetes</h4></a></li>
                            <li className={`column is-6 ${this.state.selected_tab == "2" && 'is-active'}`} onClick={(e) => this.clickInTab(2)}><a><h4 className="subtitle is-4">Paquetes de pacientes</h4></a></li>
                        </ul>
                    </div>
                    
                    <div className={this.state.selected_tab == 1?'':'hide'} id="tab_general">

                        <Link route="add_package">
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
                                    <th>Creado por</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.objects.map((obj) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.name }</td>
                                        <td>{ obj.user }</td>
                                        <td>
                                            <p className="buttons is-centered">
                                                { hasPermission(74) ?
                                                <Link route="edit_package" params={{ id: obj.id }}>
                                                    <a className="button is-small is-primary is-outlined tooltip" data-tooltip="Editar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-pen"></i>
                                                        </span>
                                                        <span>Editar </span>
                                                    </a>
                                                </Link>
                                                :<a></a>}
                                                { hasPermission(77) ?
                                                <Link route="package_edition" params={{ id: obj.id }}>
                                                    <a className="button is-small is-success is-outlined tooltip" data-tooltip="Ediciones">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-clock"></i>
                                                        </span>
                                                        <span>Ediciones</span>
                                                    </a>
                                                </Link>
                                                :<a></a>}
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

    <div className={this.state.selected_tab == 2?'':'hide'} id="tab_patient_packages">
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
    <th>Sucursal</th>
    <th>Paciente</th>
    <th>Paquete</th>
    <th>Estatus</th>
    <th>Acciones</th>
    </tr>
    </thead>
    <tbody>
    { this.state.patient_packages.map((obj) => (
    <tr key={obj.id}>
    <td>{ obj.branch_office }</td>
    <td>{ obj.patient }</td>
    <td>{ obj.name }</td>
                                        <td>{ obj.status }</td>
                                        <td>
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
                        <div>
                            Mostrando <strong> {this.state.patient_packages.length} </strong> de <strong> {this.state.total_records_packages} </strong> registros.
                            <Paginacion
                                totalRecords={this.state.total_records_packages}
                                pageLimit={this.state.page_limit}
                                pageNeighbours={1}
                                onPageChanged={this.onPageChanged}
                            />
                        </div>
                    </div>
                    <style jsx>{`
                        .tabs ul {
                            border-bottom-color: #ffffff;
                        }
                    `}
                    </style>
                </div>
            </div>
        </Layout>
        )
    }
}
