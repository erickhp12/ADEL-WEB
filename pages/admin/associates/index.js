import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import Paginacion from '../../../components/Paginacion'
import { friendlyDateformat } from '../../../filters/filters'
import { getAssociates, deleteAssociate } from '../../../services/associates'
import { hasPermission } from '../../../components/permission'
import ModalConfirmacion from '../../../components/general/ModalConfirmacion'

export default class extends React.Component{
    permisoAgregar = 22
    permisoEditar = 23
    permisoEliminar = 24

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
            const req = await getAssociates({ limit: this.state.page_limit})
            const objects = req.data.results
            const total_records = req.data.count
            console.log('TOTAL ' + total_records)
            this.setState({ objects, total_records })
        } catch (error) {
            console.log(error)
        }
    }

    onPageChanged = async data => {
        const offset = (data.currentPage - 1) * this.state.page_limit
        const params = { offset, limit: this.state.page_limit }
        try {
            const req = await getAssociates(params)
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
            const req = await getAssociates(params)
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
        let textoModal = '¿Estás seguro de borrar este asociado? - ' + obj.first_name + " " + obj.last_name
        let tituloModal = 'Eliminar asociado'
        let item = obj.id
        this.setState({ modalVisible, textoModal, tituloModal, textoConfirmacion, item })
      }

    async eliminaItem(item){
        let objects = this.state.objects
        let item_index = objects.findIndex(o => o.id == item)
        objects.splice(item_index,1)
        await deleteAssociate(item)
      }

    cerrarModal = () => {
        this.setState({ modalVisible: false });
    }

    render(){
        const breadcrumb = [
            { 
                name: "ADEL", url: "admin", active: false,
                title:"ASOCIADOS",total:this.state.total_records },
            { name: "Asociados", url: "", active: true },
        ]
        const { 
            modalVisible, textoModal, colorModal, tituloModal, textoConfirmacion, item
        } = this.state

        return (
            <Layout title="Asociados" selectedMenu="associates" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        {hasPermission(this.permisoAgregar)?
                        <Link route="add_associate">
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

                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Sucursal</th>
                                    <th>Telefono</th>
                                    <th>Fecha inicio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            { this.state.objects.map((obj) => (
                                <tr key={obj.id}>
                                    <td><img className="img-50" src={ obj.picture }/></td>
                                    <td>{ obj.first_name } { obj.last_name }</td>
                                    <td>{ obj.branch_office }</td>
                                    <td>{ obj.phone_number }</td>
                                    <td>{ friendlyDateformat(obj.date_joined)}</td>
                                    <td>
                                        <p className="buttons is-centered">
                                            { hasPermission(this.permisoAgregar)?
                                            <Link route="edit_associate" params={{ id: obj.id }}>
                                                <a className="button is-small is-primary is-outlined tooltip" data-tooltip="Editar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-pen"></i>
                                                    </span>
                                                    <span>Editar</span>
                                                </a>
                                            </Link>
                                            :<a></a>}
                                            { hasPermission(this.permisoEliminar)?
                                            <button onClick={(e) => this.abrirModal(obj) } className="button is-small is-danger is-outlined tooltip" data-tooltip="Eliminar">
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
