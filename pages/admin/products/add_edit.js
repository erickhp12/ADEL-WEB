import Layout from '../../../components/layouts/Layout'
import { addProduct, getProduct, updateProduct } from '../../../services/products'
import Router from 'next/router'
import Form from '../../../components/form/Form'

export default class extends React.Component{    
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar producto' : title='Agregar producto'
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
                const resp = await getProduct(this.props.id)
                let data = {
                    id: this.props.id,
                    product_code: resp.data.product_code,
                    name: resp.data.name,
                    price: resp.data.price,
                    is_active: resp.data.is_active
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
            { name: "Productos", url: "products", active: false },
            { name: title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            await updateProduct(id, values)
                            alertify.success('Producto guardado correctamente')
                            Router.pushRoute('products')
                        } catch (error) {
                            const errors = error.response.data
                            alertify.error('Error al guardar producto')
                            this.setState({ errors })
                        }
                    } else {
                        try {
                            await addProduct(values)
                            alertify.success('Producto agregado correctamente')
                            Router.pushRoute('products')
                        } catch (error) {
                            const errors = error.response.data
                            alertify.error('Error al agregar producto')
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
            },
            {
                name:'product_code',
                label:'Código *',
                type:'text',
                helpText:'',
                width:'is-4',
                keyPressValidation: 'only_numbers'
            },{
                name:'price',
                label:'Precio *',
                type:'text',
                helpText:'',
                width:'is-2',
                keyPressValidation: 'only_numbers'
            },{
                name:'is_active',
                label:'Activo',
                type:'checkbox',
                helpText:'',
                width:'is-12'
            }],
            data: this.state.data,
            errors: this.state.errors
        }

        return (
            <Layout title={ title } selectedMenu="products" breadcrumb={ breadcrumb }>
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
