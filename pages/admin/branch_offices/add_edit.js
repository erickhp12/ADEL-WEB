import Layout from '../../../components/layouts/Layout'
import { addBranchOffice, getBranchOffice, updateBranchOffice } from '../../../services/branch_offices'
import Router from 'next/router'
import Form from '../../../components/form/Form'

export default class extends React.Component{    
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar sucursal' : title='Agregar sucursal'
        return { id, title }
    }

    state = {
        data: {
            country:'mexico'
        },
        errors: {}
    }

    async componentDidMount() {
        if (this.props.id){
            try {
                const resp = await getBranchOffice(this.props.id)
                let data = {
                    id: this.props.id,
                    name: resp.data.name,
                    phone_number: resp.data.phone_number,
                    street_address: resp.data.street_address,
                    zip_code: resp.data.zip_code,
                    state: resp.data.state,
                    city: resp.data.city,
                    country: resp.data.country
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
            { name: "ADEL", url: "admin", active: false,title:"Agregar Sucursal",total:0 },
            { name: "Sucursales", url: "branch_offices", active: false },
            { name: title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            await updateBranchOffice(id, values)
                            alertify.success('Sucuarsal guardada correctamente')
                            Router.pushRoute('branch_offices')
                        } catch (error) {
                            alertify.error('Error al guardar sucursal')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    } else {
                        try {
                            await addBranchOffice(values)
                            alertify.success('Sucursal agregada correctamente')
                            Router.pushRoute('branch_offices')
                        } catch (error) {
                            alertify.error('Error al agregar sucursal')
                            const errors = error.response.data
                            console.log(errors)
                            this.setState({ errors })
                        }
                    }
                }
            },
            fields:[{
                name:'name',
                label:'Nombre *',
                type:'text',
                helpText:'',
                width:'is-12'
            },{
                name:'street_address',
                label:'Dirección *',
                type:'text',
                helpText:'',
                width:'is-12'
            },{
                name:'phone_number',
                label:'Número de télefono *',
                type:'text',
                keyPressValidation: 'only_numbers',
                helpText:'',
                width:'is-6'
            },{
                name:'zip_code',
                label:'Código postal *',
                type:'text',
                keyPressValidation: 'only_numbers',
                helpText:'',
                width:'is-6'
            },{
                name:'city',
                label:'Ciudad *',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'state',
                label:'Estado *',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'country',
                label:'País',
                type:'select',
                helpText:'',
                options:[
                    { label:'Seleccionar...', value:'' },
                    { label:'México', value:'mexico' },
                    { label:'Estados Unidos', value:'us' }
                ],
                width:'is-6'
            }],
            data: this.state.data,
            errors: this.state.errors
        }

        return (
            <Layout title={ title } selectedMenu="branch_offices" breadcrumb={breadcrumb}>
                <div className="card form-50-card">
                    <div className="card-content form-50-card-content">
                        <Form
                            buttonLabel={ form.button.label }
                            onSubmit={ form.button.onSubmit }
                            fields={ form.fields }
                            data={ form.data }
                            errors={ form.errors }
                        />
                    </div>
                </div>
            </Layout>
        )
    }
}
