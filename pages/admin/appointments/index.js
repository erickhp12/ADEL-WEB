import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getAppointments, updateAppointmentStatus } from '../../../services/appointments'
import Paginacion from '../../../components/Paginacion'
import { friendlyDateformat, DayMonthFormat } from '../../../filters/filters'
import ModalForm from '../../../components/ModalForm'
import { djangoDateFormat } from '../../../filters/filters'
import Flatpickr from 'react-flatpickr'
import { hasPermission } from '../../../components/permission'

export default class extends React.Component{
    state = {
        objects: [],
        total_objects: [],
        total_records: 0,
        modalVisible: false,
        page_limit: 20,
        texto_busqueda:null,
        dia_anterior: new Date(),
        dia_actual: new Date(),
        dia_siguiente: new Date(),
        mostrar_fecha:false
    }

    async componentDidMount() {
        try {
            let dia_anterior = new Date()
            dia_anterior.setDate(dia_anterior.getDate() - 1)
            let dia_siguiente = new Date()
            dia_siguiente.setDate(dia_siguiente.getDate() + 1)

            const req = await getAppointments({ limit: this.state.page_limit})
            const objects = req.data.results
            const total_objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_objects, total_records, dia_anterior, dia_siguiente })
        } catch (error) {
            console.log(error)
        }
    }

    onPageChanged = async data => {
        const offset = (data.currentPage - 1) * this.state.page_limit
        const params = { offset, limit: this.state.page_limit }
        try {
            const req = await getAppointments(params)
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    async filtraDia (date) {
        try {
            let dia_actual = this.state.dia_actual
            switch(date) {
                case '1':
                    var dia_nuevo = dia_actual.getDate() - 1
                    dia_actual.setDate(dia_nuevo)
                  break
                case '2':
                    dia_actual = new Date()
                    break
                case '3':
                    var dia_nuevo = dia_actual.getDate() + 1
                    dia_actual.setDate(dia_nuevo)
                    break
                default:
                    dia_actual = new Date(date)
              }
            let dia_anterior = new Date()
            dia_anterior.setDate(dia_actual.getDate() - 1)
            let dia_siguiente = new Date()
            dia_siguiente.setDate(dia_actual.getDate() + 1)
            let mostrar_fecha = true
            const params = { date: djangoDateFormat(dia_actual) }
            const req = await getAppointments(params)
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records, dia_anterior, dia_actual, dia_siguiente, mostrar_fecha})
        } catch (error) {
            console.log(error)
        }
    }
    selectDate = (selected_date) => {
        let date = djangoDateFormat(selected_date[0])
        this.filtraDia(date)
    }

    eliminarCaracteristica = () => {
        this.props.onDelete(this.props.id)
    }

    async confirmaCita (obj) {
        let objects = this.state.objects
        obj.status = 'confirmed'
        let data = {status:'confirmed'}
        this.setState({ objects })
        await updateAppointmentStatus(obj.id,data)
    }

    async cancelaCita (obj) {
        let objects = this.state.objects
        obj.status = 'canceled'
        let data = {status:'canceled'}
        this.setState({ objects })
        await updateAppointmentStatus(obj.id,data)
    }
    async pendienteCita (obj) {
        let objects = this.state.objects
        obj.status = 'pending'
        let data = {status:'pending'}
        this.setState({ objects })
        await updateAppointmentStatus(obj.id,data)
    }
    
    mostrarOpciones = (opcion, status) => {
        if (opcion == 'Editar' && status == 'pending')
            return true
        else if (opcion == 'Eliminar' && (status == 'pending' || status == 'canceled'))
            return true
        else if (opcion == 'Editar' && status == 'canceled')
            return true
        else if (opcion == 'Confirmar' && status == 'pending')
            return true
        else if (opcion == 'Cancelar' && status == 'confirmed')
            return true
        else if (opcion == 'Pagar' && status == 'confirmed')
            return true
        else if (opcion == 'Pendiente' && (status == 'confirmed' || status == 'canceled'))
            return true
    }

    async searchValue () {
        if (this.state.texto_busqueda == null || this.state.texto_busqueda ==''){
            let objects = this.state.total_objects
            const total_records = objects.count
            this.setState({ objects, total_records })
        }else{
            let texto = this.state.texto_busqueda.toLowerCase()
            let total_objetos = this.state.total_objects
            let obj = total_objetos.find(o => o.patient.first_name.toLowerCase().indexOf(texto) >= 0 || o.patient.last_name.toLowerCase().indexOf(texto) >= 0)
            try {
                const params = { patient: obj.patient.id }
                const req = await getAppointments(params)
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

    cerrarModal = () => {
        this.setState({ modalVisible: false });
    }

    render(){
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false,
            title:"CITAS",total:this.state.total_records },
            { name: "Citas", url: "", active: true },
        ]
        return (
            <Layout title="Citas" selectedMenu="appointments" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">Citas { this.state.mostrar_fecha == true ? 'del ' + friendlyDateformat(this.state.dia_actual): ''} </h4>

                        <div className="columns is-12 multiline">
                            <div className="column is-1">
                                { hasPermission(94) ?
                                <Link route="add_appointment">
                                    <a className="button is-info is-radiusless">
                                        <span className="icon is-small">
                                            <i className="fas fa-plus"></i>
                                        </span>
                                        <span>Agregar</span>
                                    </a>
                                </Link>
                                :<a></a>}
                            </div>
                            <div className="field has-addons column is-offset-1 is-4">
                                <button onClick={ (e) => this.filtraDia('1')} className="button is-info is-outlined is-radiusless">
                                    <span className="icon is-small">
                                        <i className="fas fa-angle-left"></i>
                                    </span>
                                    <span>{ DayMonthFormat(this.state.dia_anterior)}</span>
                                </button>
                                <button onClick={ (e) => this.filtraDia('2')} className="button is-info is-outlined is-radiusless">
                                    <span className="icon is-small">
                                        <i className="fas fa-caret-down"></i>
                                    </span>
                                    <span>Hoy</span>
                                </button>
                                <button onClick={ (e) => this.filtraDia('3')} className="button is-info is-outlined is-radiusless">
                                    <span className="icon is-small">
                                        <i className="fas fa-angle-right"></i>
                                    </span>
                                    <span> { DayMonthFormat(this.state.dia_siguiente) }</span>
                                </button>
                            </div>

                            <div className="column is-2">
                                <Flatpickr
                                    placeholder="Seleccionar fecha"
                                    onChange={ this.selectDate }
                                    options={this.state.time_options}
                                />
                            </div>
                            <div className="field has-addons column is-2">
                                <input
                                    type="text"
                                    onKeyPress={this.handleKeyPress}
                                    className="input is-radiusless"
                                    onChange={ this.setSearchValue }
                                    placeholder="Buscar..." />
                                <button onClick={ (e) => this.searchValue() } type="button" className="button is-info  is-radiusless">
                                    <span className="icon is-small">
                                        <i className="fas fa-search"></i>
                                    </span>
                                </button>
                            </div>
                            <div className="column is-2">
                                <Link route="calendar" >
                                        <button className="button is-pulled-right is-offset-1 is-primary">
                                            <span className="icon is-small">
                                                    <i className="fas fa-calendar"></i>
                                            </span>&nbsp;&nbsp;Ver calendario
                                        </button>
                                </Link>
                            </div>
                        </div>

                        <table className="table is-fullwidth is-bordered">
                            <thead>
                                <tr>
                                    <th>Sucursal</th>
                                    <th>Paciente</th>
                                    <th>Fecha</th>
                                    <th>Estatus</th>
                                    <th>Creada por</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.objects.map((obj) => (
                                    <tr key={obj.id} 
                                        className={`${obj.status == "effected" && 'status-ok'}
                                        ${obj.status == "confirmed" && 'status-confirmed'}
                                        ${obj.status == "canceled" && 'status-cancelled'}
                                        ${obj.status == "pending" && 'status-pending'}`}>
                                        <td>{ obj.branch_office }</td>
                                        <td>{ obj.patient.first_name } { obj.patient.last_name }</td>
                                        <td><b>{ friendlyDateformat(obj.date) }</b> { obj.start_time.substring(0, 5) } - { obj.end_time.substring(0, 5) } </td>

                                        <td>{ obj.status == 'effected' ? 'Efectuada':
                                            obj.status == 'pending' ? 'Pendiente' : 
                                            obj.status == 'confirmed' ? 'Confirmada' : 
                                            obj.status== 'canceled' ? 'Cancelada': 'Servicio'}</td>
                                               
                                        <td>{ obj.user }</td>
                                        <td>
                                            <p className="buttons is-centered">
                                                { hasPermission(95) && this.mostrarOpciones('Editar',obj.status) ?
                                                <Link route="edit_appointment" params={{ id: obj.id }}>
                                                    <a className="button is-small is-dark tooltip" data-tooltip="Editar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-pen"></i>
                                                        </span>
                                                        <span>Editar</span>
                                                    </a>
                                                </Link>
                                                : <a></a>}
                                                { hasPermission(95) && this.mostrarOpciones('Confirmar',obj.status)?
                                                <button onClick={ (e) => this.confirmaCita(obj)} className="button is-small is-dark tooltip">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-check"></i>
                                                        </span>
                                                        <span>Confirmar</span>
                                                </button>
                                                : <a></a>}
                                                { hasPermission(95) && this.mostrarOpciones('Cancelar',obj.status)?
                                                <button onClick={ (e) => this.cancelaCita(obj)} className="button is-small is-dark tooltip">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-trash"></i>
                                                        </span>
                                                        <span>Cancelar</span>
                                                </button>
                                                : <a></a>}
                                                { hasPermission(95) && this.mostrarOpciones('Pendiente',obj.status)?
                                                <button onClick={ (e) => this.pendienteCita(obj)} className="button is-small is-dark tooltip">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-trash"></i>
                                                        </span>
                                                        <span>Pendiente</span>
                                                </button>
                                                : <a></a>}
                                                { hasPermission(96) && this.mostrarOpciones('Eliminar',obj.status) ?
                                                <Link route="edit_appointment" params={{ id: obj.id }}>
                                                    <a className="button is-small is-dark tooltip" data-tooltip="Eliminar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-trash"></i>
                                                        </span>
                                                        <span>Eliminar</span>
                                                    </a>
                                                </Link>
                                                : <a></a>}
                                                { obj.status == 'effected' ?
                                                <Link route="appointment_detail" params={{ id: obj.id }}>
                                                    <a className="button is-small is-light tooltip" data-tooltip="Editar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-pen"></i>
                                                        </span>
                                                        <span>Ver detalle</span>
                                                    </a>
                                                </Link>
                                                : <a></a>}
                                                { hasPermission(95) && this.mostrarOpciones('Pagar',obj.status) ?
                                                <Link route="cash">
                                                    <a className="button is-small is-dark tooltip" data-tooltip="Pagar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-money-bill"></i>
                                                        </span>
                                                        <span>Pagar</span>
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
                        <div>
                        <ModalForm
                            activo={this.state.modalVisible}
                            titulo="Efectuar pago de cita"
                            botonOkTexto="Pagar"
                            color="is-info"
                            botonOkClick={this.eliminarCaracteristica}
                            cerrarModal={this.cerrarModal}
                        >
                        <div className="columns is-multiline">
                            <div className="column is-2">
                                <label>Costo</label>
                            </div>
                            <div className="column is-10">
                                <input type="text" className="input"></input>
                            </div>
                            <div className="column is-2">
                                <label>Vendedores</label>
                            </div>
                            <div className="column is-10">
                                <input type="text" className="input"></input>
                            </div>
                        </div>
                        </ModalForm>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                .is-offset-1{
                    margin-right:1rem;
                }
                `}
                </style>
            </Layout>
        )
    }
}
