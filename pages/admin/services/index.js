import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getServices, deleteService } from '../../../services/services'
import { getCategories, deleteCategory } from '../../../services/service_categories'
import { getSpecialties, deleteSpecialty } from '../../../services/specialties'
import Paginacion from '../../../components/Paginacion'
import { hasPermission } from '../../../components/permission'
import { currencyformat } from '../../../filters/filters'
import ModalConfirmacion from '../../../components/general/ModalConfirmacion'


export default class extends React.Component{
    permisoAgregarServicio = 25
    permisoEditarServicio = 26
    permisoEliminarServicio = 27
    permisoAgregarCategoria = 28
    permisoEditarCategoria = 29
    permisoEliminarCategoria = 30
    permisoAgregarEspecialidad = 40
    permisoEditarEspecialidad = 41
    permisoEliminarEspecialidad = 42
    state = {
        objects: [],
        title:'SERVICIOS',
        categories: [],
        specialties: [],
        total_records: 0,
        total_records_services: 0,
        total_records_categories: 0,
        total_records_specialties: 0,
        texto_busqueda:null,
        page_limit: 20,
        selected_tab:1
    }

    async componentDidMount() {
        // TRAE SERVICIOS
        try {
            const req = await getServices({ limit: this.state.page_limit})
            const objects = req.data.results
            const total_records_services = req.data.count
            const total_records = req.data.count
            this.setState({ objects, total_records, total_records_services })
        } catch (error) {
            console.log(error)
        }

        // TRAE CATEGORIAS
        try {
            const req = await getCategories({ limit: this.state.page_limit})
            const categories = req.data.results
            const total_records_categories = req.data.count
            this.setState({ categories, total_records_categories })
        } catch (error) {
            console.log(error)
        }

        // TRAE ESPECIALIDADES
        try {
            const req = await getSpecialties({ limit: this.state.page_limit})
            const specialties = req.data.results
            const total_records_specialties = req.data.count
            this.setState({ specialties, total_records_specialties })
        } catch (error) {
            console.log(error)
        }
    }

    clickInTab(selected_tab){
        let title = ''
        let total_records = 0
        if (selected_tab == 1){
            title = 'SERVICIOS'
            total_records = this.state.total_records_services
        }
        else if (selected_tab == 2){
            title = 'CATEGORIAS'
            total_records = this.state.total_records_categories
        }
        else if (selected_tab == 3){
            title = 'ESPECIALIDADES'
            total_records = this.state.total_records_specialties
        }
        this.setState({ selected_tab, title, total_records })
    }

    onPageChanged = async data => {
        const offset = (data.currentPage - 1) * this.state.page_limit
        const params = { offset, limit: this.state.page_limit }
        try {
            if(this.state.selected_tab == 1){
                const req = await getServices(params)
                const objects = req.data.results
                const total_records = req.data.count
                this.setState({ objects, total_records })
            }
            if(this.state.selected_tab == 2){
                const req = await getCategories(params)
                const categories = req.data.results
                const total_records_categories = req.data.count
                this.setState({ categories, total_records_categories })
            }
            if(this.state.selected_tab == 3){
                const req = await getSpecialties(params)
                const specialties = req.data.results
                const total_records_specialties = req.data.count
                this.setState({ specialties, total_records_specialties })
            }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    async searchValue () {
        let texto = this.state.texto_busqueda ? this.state.texto_busqueda.toLowerCase() :""
        try {
            if (this.state.selected_tab == 1){
                const params = { search:texto}
                const req = await getServices(params)
                const objects = req.data.results
                const total_records_services = req.data.count
                this.setState({ objects, total_records_services })
            }
            if (this.state.selected_tab == 2){
                const params = { search:texto}
                const req = await getCategories(params)
                const categories = req.data.results
                const total_records_categories = req.data.count
                this.setState({ categories, total_records_categories })
            }
            if (this.state.selected_tab == 3){
                const params = { search:texto}
                const req = await getSpecialties(params)
                const specialties = req.data.results
                const total_records_specialties = req.data.count
                this.setState({ specialties, total_records_specialties })
            }
            } catch (error) {
                console.log(error)
            }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter')
            this.searchValue()
    }

    setSearchValue = (texto) => {
        let texto_busqueda = texto.target.value
        this.setState({ texto_busqueda })
    }

    abrirModal = (obj) => {
        let modalVisible = true
        let textoConfirmacion = 'Confirmar'
        let textoModal = '¿Estás seguro de borrar? - ' + obj.name
        let tituloModal = 'Eliminar '
        let item = obj.id
        this.setState({ modalVisible, textoModal, tituloModal, textoConfirmacion, item })
      }

    async eliminaItem(item){
        let objects = this.state.objects
        if (this.state.selected_tab == 1){
            await deleteService(item)
            let item_index = objects.findIndex(o => o.id == item)
            objects.splice(item_index,1)
            this.setState({ total_records: objects.length})
        }
        else if (this.state.selected_tab == 2){
            await deleteCategory(item)
            objects = this.state.categories
            let item_index = objects.findIndex(o => o.id == item)
            objects.splice(item_index,1)
            this.setState({ total_records: objects.length})
        }
        else if (this.state.selected_tab == 3){
            await deleteSpecialty(item)
            let objects = this.state.specialties
            let item_index = objects.findIndex(o => o.id == item)
            objects.splice(item_index,1)
            this.setState({ total_records: objects.length})
        }
      }

    cerrarModal = () => {
        this.setState({ modalVisible: false });
    }

    render(){
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false,
            title:this.state.title,total:this.state.total_records },
            { name: "Servicios", url: "", active: true },
        ]
        const { 
            modalVisible, textoModal, colorModal, tituloModal, textoConfirmacion, item
        } = this.state
        return (
            <Layout title="Servicios" selectedMenu="services" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">

                        <div className='columns tabs is-small'>
                            <ul id="tabs">
                                <li className={`column is-4 ${this.state.selected_tab == "1" && 'is-active' }`} onClick={(e) => this.clickInTab(1)}><a><h4 className="subtitle is-4">Servicios</h4></a></li>
                                <li className={`column is-4 ${this.state.selected_tab == "2" && 'is-active'}`} onClick={(e) => this.clickInTab(2)}><a><h4 className="subtitle is-4">Categorias</h4></a></li>
                                <li className={`column is-4 ${this.state.selected_tab == "3" && 'is-active'}`} onClick={(e) => this.clickInTab(3)}><a><h4 className="subtitle is-4">Especialidades</h4></a></li>
                            </ul>
                        </div>
                        <div className={this.state.selected_tab == 1?'':'hide'} id="tab_services">
                            {hasPermission(this.permisoAgregarServicio)?
                            <Link route="add_service">
                                <a className="button is-info is-pulled-left is-radiusless">
                                    <span className="icon is-small">
                                        <i className="fas fa-plus"></i>
                                    </span>
                                    <span>Agregar</span>
                                </a>
                            </Link>
                            :<a></a>}

                            <div className="field has-addons is-pulled-right">
                                <div className="control">
                                <input
                                    type="text"
                                    onKeyPress={this.handleKeyPress}
                                    className="input is-radiusless"
                                    onChange={ this.setSearchValue } 
                                    placeholder="Buscar..." />
                                </div>
                                <div className="control">
                                    <button type="button" type="button" onClick={ (e) => this.searchValue() } className="button is-info is-radiusless">
                                        <span className="icon is-small">
                                            <i className="fas fa-search"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <table className="table is-fullwidth is-striped is-hoverable">
                                <thead>
                                    <tr>
                                        <th>Categoria</th>
                                        <th>Servicio</th>
                                        <th>Duración</th>
                                        <th>Precio</th>
                                        <th>Moneda</th>
                                        <th>Agregado por</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                { this.state.objects.map((obj) => (
                                        <tr key={obj.id}>
                                            <td>{ obj.category_str }</td>
                                            <td>{ obj.name }</td>
                                            <td>{ obj.duration } Minutos</td>
                                            <td>{ currencyformat(parseFloat(obj.price)) }</td>
                                            <td>{ obj.currency }</td>
                                            <td>{ obj.user }</td>
                                            <td>
                                                <div className="buttons">
                                                    { hasPermission(this.permisoEditarServicio)?
                                                    <Link route="edit_service" params={{ id: obj.id }}>
                                                        <a className="button is-small is-primary tooltip" data-tooltip="Editar">
                                                            <span className="icon is-small">
                                                                <i className="fas fa-pen"></i>
                                                            </span>
                                                            <span>Editar</span>
                                                        </a>
                                                    </Link>
                                                    :<a></a>}
                                                    { hasPermission(this.permisoEliminarServicio)?
                                                    <button onClick={(e) => this.abrirModal(obj) } className="button is-small is-danger tooltip" data-tooltip="Eliminar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-trash"></i>
                                                        </span>
                                                        <span>Eliminar</span>
                                                    </button>
                                                    :<a></a>}
                                                </div>
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
                        <Link route="add_category">
                            <a className="button is-info is-pulled-left is-radiusless">
                                <span className="icon is-small">
                                    <i className="fas fa-plus"></i>
                                </span>
                                <span>Agregar</span>
                            </a>
                        </Link>

                        <div className="field has-addons is-pulled-right">
                                <div className="control">
                                <input
                                    type="text"
                                    onKeyPress={this.handleKeyPress}
                                    className="input is-radiusless"
                                    onChange={ this.setSearchValue } 
                                    placeholder="Buscar..." />
                                </div>
                                <div className="control">
                                    <button type="button" type="button" onClick={ (e) => this.searchValue() } className="button is-info is-radiusless">
                                        <span className="icon is-small">
                                            <i className="fas fa-search"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>

                        <table className="table is-fullwidth is-striped is-hoverable">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Creada por</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.categories.map((obj) => (
                                <tr key={obj.id}>
                                    <td>{ obj.name }</td>
                                    <td>{ obj.user }</td>
                                    <td>
                                        <div className="buttons">
                                        { hasPermission(this.permisoEditarCategoria)?
                                            <Link route="edit_category" params={{ id: obj.id }}>
                                                <a className="button is-small is-primary tooltip" data-tooltip="Editar">
                                                    <span className="icon is-small">
                                                      <i className="fas fa-pen"></i>
                                                    </span>
                                                    <span>Editar</span>
                                                </a>
                                            </Link>
                                        :<a></a>}
                                        { hasPermission(this.permisoEliminarCategoria)?
                                            <button onClick={(e) => this.abrirModal(obj) } className="button is-small is-danger tooltip" data-tooltip="Eliminar">
                                                <span className="icon is-small">
                                                    <i className="fas fa-trash"></i>
                                                </span>
                                                <span>Eliminar</span>
                                                </button>
                                                :<a></a>}
                                        </div>
                                    </td>
                                </tr>
                                )) }
                            </tbody>
                        </table>
                            <div>
                                Mostrando <strong> {this.state.categories.length} </strong> de <strong> {this.state.total_records_categories} </strong> registros.
                                <Paginacion
                                    totalRecords={this.state.total_records_categories}
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
                                <input
                                    type="text"
                                    onKeyPress={this.handleKeyPress}
                                    className="input is-radiusless"
                                    onChange={ this.setSearchValue } 
                                    placeholder="Buscar..." />
                                </div>
                                <div className="control">
                                    <button type="button" type="button" onClick={ (e) => this.searchValue() } className="button is-info is-radiusless">
                                        <span className="icon is-small">
                                            <i className="fas fa-search"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <table className="table is-fullwidth is-striped is-hoverable">
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
                                                <p className="buttons">
                                                { hasPermission(this.permisoEditarEspecialidad)?
                                                <Link route="edit_specialty" params={{ id: obj.id }}>
                                                    <a className="button is-small is-primary tooltip" data-tooltip="Editar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-pen"></i>
                                                        </span>
                                                        <span>Editar</span>
                                                    </a>
                                                </Link>
                                                :<a></a>}
                                                { hasPermission(this.permisoEliminarEspecialidad)?
                                                <button onClick={(e) => this.abrirModal(obj) } className="button is-small is-danger tooltip" data-tooltip="Eliminar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-trash"></i>
                                                    </span>
                                                    <span>Eliminar</span>
                                                </button>
                                                :<a></a>}
                                                </p>
                                            </td>
                                        </tr>
                                    )) }
                                </tbody>
                            </table>
                            <div>
                                Mostrando <strong> {this.state.specialties.length} </strong> de <strong> {this.state.total_records} </strong> registros.
                                <Paginacion
                                    totalRecords={this.state.total_records_specialties}
                                    pageLimit={this.state.page_limit}
                                    pageNeighbours={1}
                                    onPageChanged={this.onPageChanged}
                                />
                            </div>
                        </div>
                        <ModalConfirmacion
                    activo={modalVisible}
                    titulo={tituloModal}
                    contenido={textoModal}
                    botonOkTexto={textoConfirmacion}
                    color={colorModal}
                    botonOkClick={(e) =>this.eliminaItem(item)}
                    cerrarModal={this.cerrarModal}
                />
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
