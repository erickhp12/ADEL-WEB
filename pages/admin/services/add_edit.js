import Layout from '../../../components/layouts/Layout'
import { addService, getService, updateService } from '../../../services/services'
import { getServiceCategories } from '../../../services/service_categories'
import Router from 'next/router'
import Form from '../../../components/form/Form'

export default class extends React.Component{    
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar servicio' : title='Agregar servicio'
        return { id, title }
    }

    state = {
        data: {},
        service_categories: [],
        errors: {}
    }

    async componentDidMount() {
        try {
            const req = await getServiceCategories()
            const data = req.data.results
            let service_categories = data.map(obj =>{
                return { label: obj.name, value: obj.id }
            })
            service_categories.unshift({
                label:'Seleccionar...', value:'' 
            })
            this.setState({ service_categories })
        } catch (error) {
            console.log(error)
        }

        if (this.props.id){
            try {
                const resp = await getService(this.props.id)
                let data = {
                    id: this.props.id,
                    name: resp.data.name,
                    category: resp.data.category,
                    description: resp.data.description,
                    duration: resp.data.duration,
                    price: resp.data.price
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
            { name: "Servicios", url: "services", active: false },
            { name: title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            await updateService(id, values)
                            alertify.success('Servicio guardado correctamente')
                            Router.pushRoute('services')
                        } catch (error) {
                            alertify.error('Error al guardar servicio')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    } else {
                        try {
                            await addService(values)
                            alertify.success('Servicio agregado correctamente')
                            Router.pushRoute('services')
                        } catch (error) {
                            alertify.error('Error al agregar servicio')
                            const errors = error.response.data
                            console.log(errors)
                            this.setState({ errors })
                        }
                    }
                }
            },
            fields:[{
                name:'category',
                label:'Categoría *',
                type:'select',
                helpText:'',
                width:'is-6',
                options: this.state.service_categories
            },{
                name:'name',
                label:'Nombre *',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'description',
                label:'Descripción *',
                type:'textarea',
                helpText:'',
                width:'is-12'
            },{
                name:'duration',
                label:'Duración (en minutos) *',
                type:'text',
                helpText:'',
                width:'is-6',
                keyPressValidation: 'only_numbers'
            },{
                name:'price',
                label:'Precio *',
                type:'text',
                helpText:'',
                width:'is-6'
            }],
            data: this.state.data,
            errors: this.state.errors
        }

        return (
            <Layout title={ title } selectedMenu="services" breadcrumb={breadcrumb}>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">{ title }</h4>
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
