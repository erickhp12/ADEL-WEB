import Layout from '../../../components/layouts/Layout'
import { getSaleAppointmentDetail } from '../../../services/sales'
import { getAppointment } from '../../../services/appointments'
import { friendlyDateformat} from '../../../filters/filters'

export default class extends React.Component{
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Detalle de cita' : title='Detalle de cita'
        return { id, title }
    }

    state = {
        data:{
            company:"0",
            branch_office:0,
            branch_office_str:"0",
            created_at:null,
            total_venta:0,
            servicios:[]
        },

    }

    async componentDidMount() {
        if (this.props.id){
            try{
                const resp = await getSaleAppointmentDetail(this.props.id)
                const respCita = await getAppointment(this.props.id)

                let data = {
                    id: this.props.id,
                    patient: resp.data[0].product_name,
                    date: resp.data[0].appointment.date,
                    start_time: resp.data[0].appointment.start_time,
                    end_time: resp.data[0].appointment.end_time,
                    total: resp.data[0].total,
                    status: resp.data[0].appointment.status,
                    servicios: respCita.data.services
                }

                this.setState({ data })
            } catch (error) {
                console.log(error)
            }
        }
    }

    render(){

        const { id, title } = this.props
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Citas", url: "appointments", active: false },
            { name: title, url: "", active: true }
        ]
        return (
            <Layout title="Detalle" selectedMenu="appointments" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">

                        <div className="columns">
                            <article className="column is-12 message is-info">
                                <div className="message-header">
                                    <p>Detalles de Cita</p>
                                </div>
                                <div className="message-body">
                                    <div className="columns">
                                        <label className="column is-2">Paciente: </label>
                                        <label className="column is-10">{ this.state.data.patient } </label>
                                    </div>
                                    <div className="columns">
                                        <label className="column is-2">Total: </label>
                                        <label className="column is-10">${ this.state.data.total } </label>
                                    </div>
                                    <div className="columns">
                                        <label className="column is-2">Fecha: </label>
                                        <label className="column is-10">{ friendlyDateformat(this.state.data.created_at) } </label>
                                    </div>
                                    <div className="columns">
                                        <label className="column is-2">Estatus: </label>
                                        <label className="column is-10">{ this.state.data.status == 'effected' ? 'efectuada': this.state.data.status == 'pending '? 'pendiente' : 'sin definir'} </label>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <div>
                        <h4 className="subtitle is-4">Servicios</h4>
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Cita</th>
                                    <th>Asociado</th>
                                    <th>Servicio</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.data.servicios.map((obj) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.appointment }</td>
                                        <td>{ obj.associate }</td>
                                        <td>{ obj.service }</td>
                                        <td>{ obj.date }</td>
                                        <td>{ obj.start_time.substring(0,5) } - { obj.end_time.substring(0,5) }</td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                        </div>

                    </div>
                </div>
                <style jsx>{`
                    .message{
                        background:white;
                    }
                    .column{
                        padding-top:2px;
                        padding-bottom:2px;
                    }
                    .is-2{
                        font-weight:600;
                    }
                    .label-header, .label-content{
                        display: inline-block;
                        border-bottom: 1px solid #cacaca;
                    }
                    .label-header{
                        font-size:16px;
                        font-weight:600;
                        width: 10%;
                    }
                    .label-content {
                        width:18%;
                    }
                    .wrapper{
                        margin-left:2%;
                        margin-bottom:0.5rem;
                    }
                    .div-wrapper{
                        border: 1px solid black;
                        padding 0.5rem;
                        font-size:18px;
                        font-weight:600;
                        text-align:center;
                    }
                    .subtitle{
                        margin-bottom: 0.8rem;
                    }
                `}
                </style>
            </Layout>
        )
    }
}
