import Layout from '../../../components/layouts/Layout'
import { getSale } from '../../../services/sales'
import { friendlyDateformat } from '../../../filters/filters'

export default class extends React.Component{
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Detalle de venta' : title='Detalle de venta'
        return { id, title }
    }

    state = {
        data:{
            company:"0",
            branch_office:0,
            branch_office_str:"0",
            created_at:null,
            total_venta:0,
            items:[],
            vendors:[]
        },

    }

    async componentDidMount() {
        if (this.props.id){
            try{
                const resp = await getSale(this.props.id)

                let data = {
                    id: this.props.id,
                    branch_office: resp.data.branch_office,
                    branch_office_str: resp.data.branch_office,
                    total: resp.data.total,
                    created_at: resp.data.created_at,
                    vendors: resp.data.vendors,
                    items: resp.data.items
                }
                let ventas = data.items
                let total_venta = 0

                ventas.forEach(venta => {
                    total_venta += parseInt(venta.total)
                })
                this.setState({ data, total_venta })
            } catch (error) {
                console.log(error)
            }
        }
    }

    render(){

        const { id, title } = this.props
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Ventas", url: "sales", active: false },
            { name: title, url: "", active: true }
        ]
        return (
            <Layout title="Detalle de venta" selectedMenu="sales" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">

                    <div className="columns">
                        <article className="column is-6 message is-info">
                            <div className="message-header">
                                <p>Datos de venta</p>
                            </div>
                            <div className="message-body">
                                <div className="columns">
                                    <label className="column is-2">Sucursal: </label>
                                    <label className="column is-10">{ this.state.data.branch_office_str } </label>
                                </div>
                                <div className="columns">
                                    <label className="column is-2">Total: </label>
                                    <label className="column is-10">${ this.state.total_venta } </label>
                                </div>
                                <div className="columns">
                                    <label className="column is-2">Fecha: </label>
                                    <label className="column is-10">{ friendlyDateformat(this.state.data.created_at) } </label>
                                </div>
                            </div>
                        </article>
                        <article className="column is-6 message is-info">
                            <div className="message-header">
                                <p>Vendedores</p>
                            </div>
                            <div className="message-body">
                                { this.state.data.vendors.map((obj, index) => (
                                <div key={index} className="columns is-4">
                                    <label className="column is-2">Nombre:</label>
                                    <label className="column is-10">{ obj.first_name } { obj.last_name} </label>
                                </div>
                                ))}
                            </div>
                        </article>
                    </div>

                        <h4 className="subtitle is-4">Venta unitaria</h4>

                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Tipo de venta</th>
                                    <th>Concepto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>total</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.data.items.map((obj) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.sale_type == 'product' ? 'Producto':obj.sale_type == 'package' ? 'Paquete':obj.sale_type == 'appointment'? 'Cita': 'Sin definir'}</td>
                                        <td>{ obj.product_name }</td>
                                        <td>{ obj.unit_price }</td>
                                        {/* <td> { obj.product != null ? obj.product.name: "No aplica" } </td> */}
                                        <td>{ obj.qty }</td>
                                        <td>{ obj.unit_price * obj.qty }</td>
                                    </tr>
                                )) }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><b>Total</b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>${ this.state.total_venta }</td>
                                </tr>
                            </tfoot>
                        </table>
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
