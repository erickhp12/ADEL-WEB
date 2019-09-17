import Layout from '../../../components/layouts/Layout'
import { getPatients } from '../../../services/patients'
import { getPatientPackage } from '../../../services/patients'
import { friendlyDateformat, djangofriendlyDateformat, currencyformat } from '../../../filters/filters'
import { Link } from '../../../routes'

export default class extends React.Component{
    static async getInitialProps ({ query }) {
        let id = query.patient_package_id;
        let title = ''
        id ? title='Editar paciente' : title='Agregar paciente'
        return { id, title }
    }

    state = {
        data:{
            company:"0",
            branch_office:0,
            branch_office_str:"0",
            patient:0,
            patient_str:"0",
            package:0,
            name:"0",
            description:"0",
            discount_type:"0",
            discount:"0",
            total_price:"0",
            real_price:"0",
            status:"0",
            partialities:"0",
            advance_payment:"0",
            vendors:[],
            paid_commission:"0",
            sessions:[],
            payments:[]
        },
        total_pagos:0,
        paid_partialities:0,
        pendiente:0
    }

    async componentDidMount() {
        try {
            const req = await getPatients({ limit: this.state.page_limit})
            const objects = req.data.results
            const total_records = req.data.count
            this.setState({ objects, total_records })
        } catch (error) {
            console.log(error)
        }
        if (this.props.id){
            try{
                const resp = await getPatientPackage(this.props.id)
                let paid_partialities = 0
                let data = {
                    id: this.props.id,
                    company: resp.data.company,
                    branch_office: resp.data.branch_office,
                    branch_office_str: resp.data.branch_office,
                    patient: resp.data.patient_id,
                    patient_str: resp.data.patient,
                    package: resp.data.package,
                    name: resp.data.name,
                    description: resp.data.description,
                    discount_type: resp.data.discount_type,
                    discount: resp.data.discount,
                    total_price: resp.data.total_price,
                    real_price: resp.data.real_price,
                    status: resp.data.status,
                    partialities: resp.data.partialities,
                    advance_payment: resp.data.advance_payment,
                    vendors: resp.data.vendors,
                    paid_commission: resp.data.paid_commission,
                    sessions: resp.data.sessions,
                    payments: resp.data.payments
                }

                data.payments.length > 0 ? paid_partialities =data.payments[0].paid_partialities :0
                let pagos = data.payments
                let total_pagos = 0

                pagos.forEach(pago => {
                    total_pagos += parseInt(pago.amount)
                });

                let pendientes = data.real_price - total_pagos
                this.setState({
                    data, total_pagos, pendientes, paid_partialities
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    render(){

        const { id, title, patient_id } = this.props
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Pacientes", url: "patients", active: false },
            { name: title, url: "", active: true }
        ]
        return (
            <Layout title="Detalle" selectedMenu="patients" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                    <div className="columns">
                        <article className={`column message is-12 ${this.state.data.status == 'liquidado' ? 'is-success' : 'is-dark'}`}>
                            <div className="message-header">
                                <p>Detalle de paquete - <b className="status">{this.state.data.status}</b> </p>
                            </div>
                            <div className="message-body">
                                <div className="columns">
                                    <label className="column is-2">Sucursal</label>
                                    <label className="column is-4">{ this.state.data.branch_office_str }</label>
                                    <label className="column is-2">Precio lista </label>
                                    <label className="column is-4">{ currencyformat(parseFloat(this.state.data.total_price)) }</label>
                                </div>
                                <div className="columns">
                                    <label className="column is-2">Paciente </label>
                                    <label className="column is-4">{ this.state.data.patient_str }</label>
                                    <label className="column is-2">Precio descuento </label>
                                    <label className="column is-4">{ currencyformat(parseFloat(this.state.data.real_price)) } </label>
                                </div>
                                <div className="columns is-multiline">
                                    <label className="column is-2">Descripcion</label>
                                    <label className="column is-4">{ this.state.data.description }</label>
                                    <label className="column is-2">Descuento </label>
                                    <label className="column is-4">{this.state.data.discount} </label>
                                </div>
                                <div className="columns is-multiline">
                                    <label className="column is-2">Tipo de descuento </label>
                                    <label className="column is-4">{ this.state.data.discount_type == 'percentage' ? 'Porcentaje':this.state.data.discount_type == 'direct' ? 'Directo': 'Sin definir'}</label>
                                    <label className="column is-2"> Abonos </label>
                                    <label className="column is-4"> { currencyformat(parseFloat(this.state.total_pagos)) } </label>
                                </div>
                                <div className="columns is-multiline">
                                    <label className="column is-2">Parcialidades </label>
                                    <label className="column is-4">{this.state.paid_partialities || 0 } / { this.state.data.partialities }</label>
                                    <label className="column is-2"> Resto a liquidar </label>
                                    <label className="column is-4"> { currencyformat(parseFloat(this.state.pendiente)) } </label>
                                </div>
                            </div>
                        </article>
                    </div>

                    <h4 className="subtitle is-4">Vendedores</h4>
                    { this.state.data.vendors.length > 0 ?
                    <div>
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Vendedores</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.data.vendors.map((obj, index) => (
                                    <tr key={obj.id}>
                                        <td>{ obj }</td>
                                    </tr>
                                )) }
                                </tbody>
                            </table>
                        </div>
                        :
                            <div className="div-wrapper">No hay sesiones aun</div> 
                        }


                    <h4 className="subtitle is-4">Sesiones</h4>
                    { this.state.data.sessions.length > 0 ?
                    <div>
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th># sesión</th>
                                    <th>Fecha</th>
                                    <th>Estatus</th>
                                    <th>Asignar cita</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.data.sessions.map((obj) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.num_session }</td>
                                        <td>{ friendlyDateformat(obj.session_date) == "Invalid date" ? "sin fecha asignada" : friendlyDateformat(obj.session_date) }</td>
                                        <td>{ obj.status == 'pending ' ? 'Pendiente':obj.status == 'scheduled' ? 'Agendado':obj.status == 'rescheduled'? 'Reagendado': 'Sin definir'}</td>
                                        <td>
                                            <p className="buttons is-centered">
                                            <Link route="add_appointment_session" params={{ session_id: obj.id, patient_id: this.state.data.patient, patient_package_id: this.state.data.id}}>
                                                <a className="button is-small is-primary is-outlined tooltip" data-tooltip="Editar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-pen"></i>
                                                    </span>
                                                    <span>Asignar</span>
                                                </a>
                                            </Link>
                                            </p>
                                        </td>
                                    </tr>
                                )) }
                                </tbody>
                            </table>
                        </div>
                        :
                            <div className="div-wrapper">No hay sesiones aun</div> 
                        }

                        <h4 className="subtitle is-4">Pagos</h4>
                        { this.state.data.payments.length > 0 ?
                        <div>
                            <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Fecha de pago</th>
                                        <th>Concepto</th>
                                        <th>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.data.payments.map((obj, index) => (
                                        <tr key={obj.id}>
                                            <td>{index + 1}</td>
                                            <td> { friendlyDateformat(obj.created_at) }</td>
                                            <td>{ obj.sale_item_str }</td>
                                            <td>{ currencyformat(parseFloat(obj.amount)) }</td>
                                        </tr>
                                    )) }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td><b>Total</b></td>
                                        <td>{ currencyformat(parseFloat(this.state.total_pagos)) }</td>
                                    </tr>
                                    
                                </tfoot>
                            </table>
                        </div>
                        : 
                            <div className="div-wrapper" >No hay pagos aun</div>
                        }
                    </div>
                </div>
                <style jsx>{`
                    .c {
                        border-bottom: 1px solid #cacaca;
                        width: 100%;
                        margin-bottom: 1.5rem;
                    }
                    .status{
                        text-transform:uppercase;
                        font-size:20px;
                    }
                    .cancelado{
                        color:red;
                        border-bottom: 1px solid red;
                    }
                    .liquidado{
                        color:green;
                        border-bottom: 1px solid green;
                    }
                    .label-header, .label-content{
                        display: inline-block;
                        border-bottom: 1px solid #cacaca;
                    }
                    .label-header{
                        font-size:16px;
                        font-weight:600;
                        width: 20%;
                    }
                    .label-content {
                        width:78%;
                    }
                    .wrapper{
                        margin-left:2%;
                        margin-bottom:0.5rem;
                    }
                    .subtitle{
                        margin-bottom: 0.8rem;
                    }
                    .div-wrapper{
                        border: 1px solid #cacaca;
                        padding: 0.5rem;
                        margin-bottom: 0.5rem;
                    }
                    .message{
                        background:white;
                    }
                    .column{
                        padding-top:4px;
                        padding-bottom:4px;
                    }
                    .is-2{
                        font-weight:600;
                    }
                `}
                </style>
            </Layout>
        )
    }
}
