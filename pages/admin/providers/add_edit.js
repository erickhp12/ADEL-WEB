import Layout from '../../../components/layouts/Layout'
import {
    addProvider,
    getProvider,
    updateProvider
} from '../../../services/providers'
import Router from 'next/router'
import Form from '../../../components/form/Form'

export default class extends React.Component{    
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar proveedor' : title='Agregar proveedor'
        return { id, title }
    }

    state = {
        data: {
            is_active:true,
        },
        errors: {}
    }

    async componentDidMount() {
        if (this.props.id){
            try {
                const resp = await getProvider(this.props.id)
                let data = {
                    id: this.props.id,
                    name: resp.data.name,
                    is_active: resp.data.is_active,
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
            { name: "Proveedores", url: "providers", active: false },
            { name: title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            await updateProvider(id, values)
                            alertify.success('Proveedor guardado correctamente')
                            Router.pushRoute('providers')
                        } catch (error) {
                            alertify.error('Error al guardar proveedor')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    } else {
                        try {
                            await addProvider(values)
                            alertify.success('Proveedor agregado correctamente')
                            Router.pushRoute('providers')
                        } catch (error) {
                            alertify.error('Error al agregar proveedor')
                            const errors = error.response.data
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
                name:'is_active',
                label:'Activo',
                type:'checkbox',
                helpText:'',
                width:'is-2'
            }],
            data: this.state.data,
            errors: this.state.errors
        }

        return (
            <Layout title={ title } selectedMenu="providers" breadcrumb={breadcrumb}>
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
