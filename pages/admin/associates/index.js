import { Link } from '../../../routes'
import Paginacion from '../../../components/Paginacion'
import Layout from '../../../components/layouts/Layout'
import { hasPermission } from '../../../components/permission'
import { friendlyDateformat } from '../../../filters/filters'
import { getAssociates } from '../../../services/associates'

export default class extends React.Component{
    state = {
        objects:[],
        total_records:0,
        page_limit:20,
        texto_busqueda:null
    }

    async componentDidMount() {
        try {
            const req = await getAssociates({ limit: this.state.page_limit})
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

    render(){
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false, title:"Asociados",total:this.state.total_records },
            { name: "Asociados", url: "", active: true },
        ]
        return (
            <Layout title="Asociados" selectedMenu="associates" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <Link route="add_associate">
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
                                        <p className="buttons is-centered">
                                            { hasPermission(17)?
                                            <Link route="edit_associate" params={{ id: obj.id }}>
                                                <a className="button is-small is-primary is-outlined tooltip" data-tooltip="Editar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-pen"></i>
                                                    </span>
                                                    <span>Editar</span>
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
                </div>
                <style jsx>{`
                    .card{
                        margin:1.5em;
                    }
                    .card-content {
                        overflow-x: auto;
                      }
                      
                `}</style>
            </Layout>
        )
    }
}
