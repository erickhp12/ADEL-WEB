import { Link } from '../../../routes'
import Layout from '../../../components/layouts/Layout'
import Paginacion from '../../../components/Paginacion'
import { friendlyDateformat } from '../../../filters/filters'
import { hasPermission } from '../../../components/permission'
import { getBranchOffices, deleteBranchOffice } from '../../../services/branch_offices'
import ModalConfirmacion from '../../../components/general/ModalConfirmacion'

export default class extends React.Component{
    permisoAgregar = 16
    permisoEditar = 17
    permisoEliminar = 18

    state = {
        objects:[],
        total_records:0,
        page_limit:20,
        texto_busqueda:null,
        textoModal:'',
        tituloModal:'',
        textoConfirmacion:'',
        item:null,
        colorModal:'is-danger'
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

    async searchValue () {
        let texto = this.state.texto_busqueda.toLowerCase()
        try {
            const params = { search:texto}
            const req = await getBranchOffices(params)
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
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
        let textoModal = '¿Estás seguro de borrar esta sucursal? - ' + obj.name
        let tituloModal = 'Eliminar sucursal'
        let item = obj.id
        this.setState({ modalVisible, textoModal, tituloModal, textoConfirmacion, item })
      }

    async eliminaItem(item){
        let objects = this.state.objects
        let item_index = objects.findIndex(o => o.id == item)
        objects.splice(item_index,1)
        await deleteBranchOffice(item)
      }

    cerrarModal = () => {
        this.setState({ modalVisible: false });
    }

    render(){
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false,
            title:"SUCURSALES",total:this.state.total_records },
            { name: "Sucursales", url: "", active: true },
        ]
        const { 
            modalVisible, textoModal, colorModal, tituloModal, textoConfirmacion, item
        } = this.state

        return (
            <Layout title="Sucursales" selectedMenu="branch_offices" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        {hasPermission(this.permisoAgregar)?
                        <Link route="add_branch_office">
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
                                <button type="button" onClick={ (e) => this.searchValue() } className="button is-info is-radiusless">
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
                                    <th>Telefono</th>
                                    <th>Direccion</th>
                                    <th>Creada por</th>
                                    <th>Inicio operaciones</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            { this.state.objects.map((obj) => (
                                <tr key={obj.id}>
                                    <td>{ obj.name }</td>
                                    <td>{ obj.phone_number }</td>
                                    <td>{ obj.street_address } - { obj.city }</td>
                                    <td>{ obj.usuario }</td>
                                    <td>{ friendlyDateformat(obj.created_at)}</td>
                                    <td>
                                        <p className="buttons">
                                            { hasPermission(17)?
                                            <Link route="edit_branch_office" params={{ id: obj.id }}>
                                                <a className="button is-small is-primary tooltip" data-tooltip="Editar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-pen"></i>
                                                    </span>
                                                    <span>Editar</span>
                                                </a>
                                            </Link>
                                            :<a></a>}
                                            { hasPermission(this.permisoEliminar)?
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
                `}</style>
                <ModalConfirmacion
                    activo={modalVisible}
                    titulo={tituloModal}
                    contenido={textoModal}
                    botonOkTexto={textoConfirmacion}
                    color={colorModal}
                    botonOkClick={(e) =>this.eliminaItem(item)}
                    cerrarModal={this.cerrarModal}
                />
            </Layout>
        )
    }
}
