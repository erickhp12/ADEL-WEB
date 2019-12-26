import Router from 'next/router'

import Layout from '../../../components/layouts/Layout'
import { addCategory, getCategory, updateCategory } from '../../../services/service_categories'
import Form from '../../../components/form/Form'

export default class extends React.Component{    
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar categoría' : title='Agregar categoría'
        return { id, title }
    }

    state = {
        data: {},
        errors: {}
    }

    async componentDidMount() {
        if (this.props.id){
            try {
                const resp = await getCategory(this.props.id)
                let data = {
                    id: this.props.id,
                    name: resp.data.name
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
            { name: "ADEL", url: "admin", active: false,
            title:id > 0 ? this.state.data.name : title},
            { name: "Servicios", url: "services", active: false },
            { name: id > 0 ? title : title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            await updateCategory(id, values)
                            alertify.success('Categoria guardada correctamente')
                            Router.pushRoute('services')
                        } catch (error) {
                            alertify.error('Error al guardar categoria')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    } else {
                        try {
                            await addCategory(values)
                            alertify.success('Categoria agregada correctamente')
                            Router.pushRoute('services')
                        } catch (error) {
                            alertify.error('Error al agregar categoria')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    }
                }
            },
            fields:[{
                name:'name',
                label:'Nombre',
                type:'text',
                helpText:'',
                width:'full'
            }],
            data: this.state.data,
            errors: this.state.errors
        }

        return (
            <Layout title={ title } selectedMenu="services" breadcrumb={breadcrumb}>
                <div className="card">
                    <div className="card-content">
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
