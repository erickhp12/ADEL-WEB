import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getPatients } from '../../../services/patients'
import Paginacion from '../../../components/Paginacion'
import { hasPermission } from '../../../components/permission'

export default class extends React.Component{
    state = {
        objects: [],
        total_objects: [],
        total_records: 0,
        page_limit: 20,
        texto_busqueda:null
    }

    async componentDidMount() {
        try {
            const req = await getPatients({ limit: this.state.page_limit})
            const objects = req.data.results
            const total_objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_objects, total_records })
        } catch (error) {
            console.log(error)
        }
    }

    onPageChanged = async data => {
        const offset = (data.currentPage - 1) * this.state.page_limit
        const params = { offset, limit: this.state.page_limit }
        try {
            const req = await getPatients(params)
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    async searchValue () {
        if (this.state.texto_busqueda == null || this.state.texto_busqueda ==''){
            let objects = this.state.total_objects
            this.setState({ objects })
        }else{
            let texto = this.state.texto_busqueda.toLowerCase()
            let total_objetos = this.state.total_objects
            let obj = total_objetos.find(o => o.first_name.toLowerCase().indexOf(texto) >= 0 || o.last_name.toLowerCase().indexOf(texto) >= 0)
            try {
                const params = { id: obj.id }
                const req = await getPatients(params)
                const objects = req.data.results
                const total_records = req.data.count
                this.setState({ objects, total_records })
            } catch (error) {
                console.log(error)
            }
        }
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          this.searchValue()
        }
      }

    setSearchValue = (texto) => {
        let texto_busqueda = texto.target.value
        this.setState({ texto_busqueda })
    }
    render(){
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Pacientes", url: "", active: true }
        ]
        return (
            <Layout title="Pacientes" selectedMenu="patients" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">Pacientes</h4>
                        { hasPermission(40) ?
                        <Link route="add_patient">
                            <a className="button is-info is-pulled-left is-radiusless">
                                <span className="icon is-small">
                                    <i className="fas fa-plus"></i>
                                </span>
                                <span>Agregar</span>
                            </a>
                        </Link>
                        : <a></a>}
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
                                <button onClick={ (e) => this.searchValue() } type="button" className="button is-info is-radiusless">
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
                                    <th>Correo</th>
                                    <th>Telefono</th>
                                    <th>Creado por</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.objects.map((obj) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.first_name } { obj.last_name }</td>
                                        <td>{ obj.email }</td>
                                        <td>{ obj.phone_number }</td>
                                        <td>{ obj.user }</td>
                                        <td>
                                            <p className="buttons is-centered">
                                                { hasPermission(41) ?
                                                <Link route="edit_patient" params={{ id: obj.id }}>
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
