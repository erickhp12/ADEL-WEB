import Layout from '../../../components/layouts/Layout'
import { getSalesByCashClosing } from '../../../services/sales'
import { friendlyDateformat, timeFormat, currencyformat } from '../../../filters/filters'

export default class extends React.Component{
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Detalle de corte' : title='Detalle de corte'
        return { id, title }
    }

    state = {
        total:0,
        ventas:[],
        diferencia:0,
        data : {
            comment:null,
            branch_office:null,
            start_date:null,
            end_date:null,
            total:0,
            total_real:0
        }
    }

    async componentDidMount() {
        if (this.props.id){
            try{
                let resp = await getSalesByCashClosing(this.props.id)
                let ventas = resp.data.sales
                let items = []
                let data = {
                    comment: resp.data.comment,
                    branch_office: resp.data.branch_office,
                    start_date: resp.data.start_date,
                    end_date: resp.data.end_date,
                    total: resp.data.total,
                    total_real: resp.data.total_real
                }
                let diferencia = data.total - data.total_real

                ventas.forEach(item => {
                    item.items.forEach(element => {
                        item = {
                            sale_type: element.sale_type,
                            product_name:element.product_name,
                            unit_price:element.unit_price,
                            qty: element.qty,
                            total: element.total,
                        }
                    items.push(item)
                    })
                })
                ventas = items
                let total = 0
                if (ventas.length > 0 ){
                    total = resp.data.total
                }
                this.setState({ data, ventas, total, diferencia })
            } catch (error) {
                console.log(error)
            }
        }
    }

    render(){

        const { id, title } = this.props
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Lista de cortes", url: "cash-closing-list", active: false },
            { name: title, url: "", active: true }
        ]
        return (
            <Layout title="Detalle de corte" selectedMenu="reports" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <div className="columns">
                        <article className={`column is-12 message ${this.state.diferencia == "0" && 'is-info'} ${this.state.diferencia != "0" && 'is-danger'} `}>
                            <div className="message-header">
                                <p>Detalle de corte - Sucursal { this.state.data.branch_office }</p>
                            </div>
                            <div className="message-body">
                                <div className="columns">
                                    <label className="column is-2">Total: </label>
                                    <label className="column is-3">{ currencyformat(parseFloat(this.state.data.total)) }</label>
                                    <label className="column is-2">Fecha inicio: </label>
                                    <label className="column is-3">{ friendlyDateformat(this.state.data.start_date) } { timeFormat(this.state.data.start_date) } </label>
                                </div>
                                <div className="columns">
                                    <label className="column is-2">Total en caja: </label>
                                    <label className="column is-3">{ currencyformat(parseFloat(this.state.data.total_real)) } </label>
                                    <label className="column is-2">Fecha final: </label>
                                    <label className="column is-3">{ friendlyDateformat(this.state.data.end_date) } { timeFormat(this.state.data.end_date) }</label>
                                </div>
                                <div className="columns is-multiline">
                                    <label className="column is-2">Diferencia: </label>
                                    <label className="column is-10">{ currencyformat(parseFloat(this.state.diferencia)) }</label>
                                    <label className="column is-2">Comentarios: </label>
                                    <label className="column is-10">{ this.state.data.comment } </label>
                                </div>
                            </div>
                        </article>
                    </div>
                        { this.state.ventas.length > 0 ?
                            <div>
                                <h4 className="subtitle is-4">Ventas</h4>
                                <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tipo de venta</th>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.ventas.map((item, index) => (
                                            <tr key={ index }>
                                                <td>{ index + 1 }</td>
                                                <td>{ item.sale_type }</td>
                                                <td>{ item.product_name }</td>
                                                { item.sale_type != 'product' ? <td>No aplica</td>:
                                                <td className="sesiones">
                                                    { item.qty}
                                                </td>
                                                }
                                                <td> { currencyformat(parseFloat(item.unit_price)) }</td>
                                                <td> { currencyformat(parseFloat(item.qty * item.unit_price)) }</td>
                                            </tr>
                                        )) }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th>Venta total</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th>{ currencyformat(parseFloat(this.state.total)) } </th>
                                        </tr>
                                    </tfoot>
                                </table>
                                <button className="button is-info"  onClick={() => this.cobrar() }>Cobrar</button>
                            </div>
                            :
                                <div className="div-wrapper">
                                    <p>No hay elementos en corte</p>
                                </div>
                            }
                    </div>
                </div>
                <style jsx>{`
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
