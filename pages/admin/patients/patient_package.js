import Layout from '../../../components/layouts/Layout'
import { getPackages, getPackage } from '../../../services/packages'
import { addPatientPackage } from '../../../services/patients'
import { getAssociates } from '../../../services/associates'
import Router from 'next/router'
import Form from '../../../components/form/Form'
import Select from 'react-select'
import { friendlyDateformat } from '../../../filters/filters'

export default class extends React.Component{
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Asignar paquete' : title='Asignar paquete'
        return { id, title }
    }

    state = {
        buttonDisplay:'display',
        services:[],
        branch_offices: [],
        services:[],
        vendors:[],
        patients: [],
        packages: [],
        selected_services:[],
        selected_vendors:[],
        number_sessions:0,
        session_date:new Date(),
        time_session:new Date(),

        num_sessions: 1,
        total_sessions: [],
        normal_prices: [],
        normal_total_price: 0,
        promotion_price: 0,

        data: {
            patient:this.props.id,
            branch_office:null,
            package:0,
            name:null,
            description:null,
            discount_type:"Direct",
            discount:"0",
            total_price:0,
            partialities:8,
            status:'activo',
            vendors:[],
            sessions:[]
        },
        errors: {},
    }

    async componentDidMount() {

        let data = this.state.data
        data.branch_office = localStorage.getItem('sucursal')

        // TRAE PAQUETES
        try {
            const req = await getPackages()
            const data = req.data.results

            let packages = data.map(obj => {
                return { label: obj.name, value: obj.id };
            });
            packages.unshift({
                label: "Seleccionar...", value: ""
            });

            this.setState({ packages })
        } catch (error) {
            console.log(error)
        }

        // TRAE ASOCIADOS
        try {
            const req = await getAssociates();
            const data = req.data.results
            let vendors = data.map(obj => {
                return { label: obj.first_name + " " + obj.last_name, value: obj.id };
            });
            vendors.unshift({
                label: "Seleccionar...", value: ""
            });

            this.setState({ vendors })
        } catch (error) {
            console.log(error)
        }
        this.setState({ data })
    }

    selectVendor = async(selected_vendors) => {
        let { data } = this.state
        let vendors = []

        selected_vendors.forEach(s => {
            vendors.push(s.value)
        })
        data.vendors = vendors

        this.setState({ data, selected_vendors })
    }

    selectPackage = async(selected_package) => {
        try {
            const req = await getPackage(selected_package.value)
            
            let data = {
                branch_office: localStorage.getItem('sucursal'),
                patient:this.props.id,
                package: selected_package.value,
                name: req.data.name,
                discount_type: req.data.discount_type,
                discount: req.data.discount,
                real_price: req.data.real_price,
                total_price: req.data.total_price,
                description: req.data.description,
                partialities: req.data.sessions.length,
                status: 'activo',
                vendors:[],
                sessions: req.data.sessions,
                sessions_name: req.data.sessions
            }
            let sesiones = []
            let sesiones_originales = data.sessions
            
            sesiones_originales.forEach(session => {
                let servicios = []
                session.services.forEach(servicio => {
                    servicios.push(servicio.id)
                })
                let sesion = {
                    id: session.id,
                    num_session: session.num_session,
                    services:servicios
                }
                sesiones.push(sesion)
            })

            data.sessions = sesiones
            this.setState({ data })

        } catch (error) {
            console.log(error)
        }
    }

    handleChange(e) {
		let extra_data = this.state.extra_data
		extra_data[e.target.name] = e.target.value
		this.setState({ 'extra_data': extra_data })
    }

    deleteAppointmentAssociate = ( index ) => {
        let data = this.state.data
        let sessions = data.sessions
        data.sessions.splice(index, 1)
        this.setState({ data }, () => console.log(this.state))
    }

    render(){
        const { id, title } = this.props
        const { selected_vendors, selected_package, vendors, packages } = this.state

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Pacientes", url: "patients", active: false },
            { name: title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                display:this.state.buttonDisplay,
                onSubmit: async (event, values) => {
                    try {
                        await addPatientPackage(values)
                        alertify.success('Paquete asignado correctamente')
                        Router.pushRoute('patients')
                    } catch (error) {
                        alertify.error('Error al asignar paquete')
                        console.log(error)
                        const errors = error.response.data
                        this.setState({ errors })
                    }
                }
            },
            fields:[{
                name:'partialities',
                label:'parcialidades',
                type:'text',
                helpText:'',
                value:this.state.partialities,
                width:'is-2',
                keyPressValidation: 'only_numbers'
            },
            {
                name:'total_price',
                label:'Precio total',
                type:'text',
                helpText:'',
                value:this.state.total_price,
                width:'is-2',
                keyPressValidation: 'only_numbers'
            },
            {
                name:'real_price',
                label:'precio con descuento',
                type:'text',
                helpText:'',
                width:'is-2',
                keyPressValidation: 'only_numbers'
            }],
            data: this.state.data,
            errors: this.state.errors
        }

        return (
            <Layout title={ title } selectedMenu="packages" breadcrumb={breadcrumb}>
                <div className="card">
                    <div className="card-content">
                    <h4 className="subtitle is-4">{ title }</h4>  
                    <div className="columns">
                        <div className="column is-6">
                            <label className="label has-text-grey has-text-weight-semibold">Paquete</label>
                            <Select
                                instanceId
                                value={ selected_package }
                                onChange={ this.selectPackage.bind(this)}
                                options={ packages }
                                />
                        </div>
                        <div className="column is-6">
                            <label className="label has-text-grey has-text-weight-semibold">Vendedores</label>
                            <Select
                                instanceId
                                isMulti
                                closeMenuOnSelect={false}
                                value={ selected_vendors }
                                onChange={ this.selectVendor.bind(this)}
                                options={ vendors }
                            />
                        </div>
                    </div>
                    <Form
                        buttonLabel={ form.button.label }
                        buttonDisplay={ this.state.buttonDisplay }
                        onSubmit={ form.button.onSubmit }
                        fields={ form.fields }
                        data={ form.data }
                        errors={ form.errors }
                    >
                    { this.state.data.sessions.length > 0 ?
                    <div>
                        <hr></hr>
                        <h4 className="subtitle is-4">Sesiones</h4>
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                <thead>
                                    <tr>
                                        <th>Sesiones</th>
                                        <th>Servicios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.data.sessions_name.map((obj, index) => (
                                        <tr key={ index }>
                                            <td>{ obj.num_session }</td>
                                            <td> 
                                            { obj.services[0] != null ? obj.services[0].name + " ": "" }
                                            { obj.services[1] != null ? obj.services[1].name + " ": "" }
                                            { obj.services[2] != null ? obj.services[2].name + " ": "" }
                                            { obj.services[3] != null ? obj.services[3].name + " ": "" }
                                            { obj.services[4] != null ? obj.services[4].name + " ": "" }
                                            { obj.services[5] != null ? obj.services[5].name + " ": "" }
                                            { obj.services[6] != null ? obj.services[6].name + " ": "" }
                                            { obj.services[7] != null ? obj.services[7].name + " ": "" }
                                            { obj.services[8] != null ? obj.services[8].name + " ": "" }
                                            { obj.services[9] != null ? obj.services[9].name + " ": "" }
                                            { obj.services[10] != null ? obj.services[10].name + " ": "" }
                                            </td>
                                            
                                        </tr>
                                    )) }
                                </tbody>
                            </table>
                    </div>
                    : <div></div>
                    }

                    </Form>

                    <style jsx>{`

                        .subtitle{
                            margin-top: 0.5rem;
                            margin-bottom: 1.5rem;
                        }
                        .label-select{
                            font-size:16px;
                            font-weight:600;
                            color: #777;
                        }
                        `
                        }
                    </style>
                </div>
            </div>
        </Layout>
        )
    }
}