import Layout from '../../../components/layouts/Layout'
import { addSpecialty, getSpecialty, updateSpecialty } from '../../../services/specialties'
import Router from 'next/router'
import Form from '../../../components/form/Form'

export default class extends React.Component{    
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar especialidad' : title='Agregar especialidad'
        return { id, title }
    }

    state = {
        data: {},
        errors: {}
    }

    async componentDidMount() {
        if (this.props.id){
            try {
                const resp = await getSpecialty(this.props.id)
                let data = {
                    id: this.props.id,
                    name: resp.data.name,
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
            { name: "Especialidades", url: "services", active: false },
            { name: title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            await updateSpecialty(id, values)
                            alertify.success('Especialidad guardada correctamente')
                            Router.pushRoute('services')
                        } catch (error) {
                            alertify.error('Error al guardar especialidad')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    } else {
                        try {
                            await addSpecialty(values)
                            alertify.success('Especialidad agregado correctamente')
                            Router.pushRoute('services')
                        } catch (error) {
                            alertify.error('Error al agregar especialidad')
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
