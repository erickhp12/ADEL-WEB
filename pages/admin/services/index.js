import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getServices } from '../../../services/services'
import { getServiceCategories } from '../../../services/service_categories'
import { getSpecialties } from '../../../services/specialties'
import Paginacion from '../../../components/Paginacion'

export default class extends React.Component{
    state = {
        objects: [],
        service_categories: [],
        specialties: [],
        total_records: 0,
        total_records_service_categories: 0,
        total_records_specialties: 0,
        page_limit: 20,
        selected_tab:1
    }

    async componentDidMount() {
        // TRAE SERVICIOS
        try {
            const req = await getServices({ limit: this.state.page_limit})
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
        } catch (error) {
            console.log(error)
        }

        // TRAE CATEGORIAS DE SERVICIO
        try {
            const req = await getServiceCategories({ limit: this.state.page_limit})
            const service_categories = req.data.results
            const total_records_service_categories = req.data.count
            this.setState({ service_categories, total_records_service_categories })
        } catch (error) {
            console.log(error)
        }

        // TRAE ESPECIALIDADES
        try {
            const req = await getSpecialties({ limit: this.state.page_limit})
            const specialties = req.data.results
            const total_records = req.data.count
            this.setState({ specialties, total_records })
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
            const req = await getServices(params)
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
            { name: "Servicios", url: "", active: true }
        ]
        return (
            <Layout title="Servicios" selectedMenu="services" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">

                        <div className='columns tabs is-small'>
                            <ul id="tabs">
                                <li className={`column is-4 ${this.state.selected_tab == "1" && 'is-active'}`} onClick={(e) => this.clickInTab(1)}><a><h4 className="subtitle is-4">Servicios</h4></a></li>
                                <li className={`column is-4 ${this.state.selected_tab == "2" && 'is-active'}`} onClick={(e) => this.clickInTab(2)}><a><h4 className="subtitle is-4">Categorias</h4></a></li>
                                <li className={`column is-4 ${this.state.selected_tab == "3" && 'is-active'}`} onClick={(e) => this.clickInTab(3)}><a><h4 className="subtitle is-4">Especialidades</h4></a></li>
                            </ul>
                        </div>
                        <div className={this.state.selected_tab == 1?'':'hide'} id="tab_services">
                            <Link route="add_service">
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
                                        <th>Categoria</th>
                                        <th>Nombre</th>
                                        <th>Duración</th>
                                        <th>Precio</th>
                                        <th>Agregado por</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                { this.state.objects.map((obj) => (
                                        <tr key={obj.id}>
                                            <td>{ obj.category_str }</td>
                                            <td>{ obj.name }</td>
                                            <td>{ obj.duration }</td>
                                            <td>{ obj.price }</td>
                                            <td>{ obj.user }</td>
                                            <td>
                                                <p className="buttons is-centered">
                                                    <Link route="edit_service" params={{ id: obj.id }}>
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
                        
                        <div className={this.state.selected_tab == 2?'':'hide'} id="tab_patient_packages">
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
                                    <th>Creada por</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.service_categories.map((obj) => (
                                <tr key={obj.id}>
                                    <td>{ obj.name }</td>
                                    <td>{ obj.user }</td>
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
                                Mostrando <strong> {this.state.service_categories.length} </strong> de <strong> {this.state.total_records_service_categories} </strong> registros.
                                <Paginacion
                                    totalRecords={this.state.total_records_service_categories}
                                    pageLimit={this.state.page_limit}
                                    pageNeighbours={1}
                                    onPageChanged={this.onPageChanged}
                                />
                            </div>
                        </div>
                        
                        <div className={this.state.selected_tab == 3?'':'hide'} id="tab_specialties">
                            <Link route="add_specialty">
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
                                { this.state.specialties.map((obj) => (
                                        <tr key={obj.id}>
                                            <td>{ obj.name }</td>
                                            <td>
                                                <p className="buttons is-centered">
                                                    <Link route="edit_specialty" params={{ id: obj.id }}>
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
