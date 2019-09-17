import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getUsers } from '../../../services/users'
import Paginacion from '../../../components/Paginacion'
import { hasPermission } from '../../../components/permission'
import { friendlyDateformat } from '../../../filters/filters'

export default class extends React.Component{
    state = {
        objects:[],
        total_records:0,
        page_limit:20,
        texto_busqueda:null
    }

    async componentDidMount() {
        try {
            const req = await getUsers({ limit: this.state.page_limit})
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
            const req = await getUsers(params)
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
            const req = await getUsers(params)
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
            { name: "ADEL", url: "admin", active: false, title:"USUARIOS",total:this.state.total_records },
            { name: "Usuarios", url: "", active: true },
        ]
        return (
            <Layout title="Usuarios" selectedMenu="users" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <Link route="add_user">
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
                                    <th>Imagen</th>
                                    <th>Nombre</th>
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
                                    <td>{ obj.phone_number }</td>
                                    <td>{ friendlyDateformat(obj.date_joined)}</td>
                                    <td>
                                        <p className="buttons is-centered">
                                            { hasPermission(17)?
                                            <Link route="edit_user" params={{ id: obj.id }}>
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
                `}</style>
            </Layout>
        )
    }
}
