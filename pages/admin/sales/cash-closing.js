import Layout from "../../../components/layouts/Layout"
import Flatpickr from 'react-flatpickr'
import { djangofriendlyDateformat } from '../../../filters/filters'
import { addCashClosing, getSalesByCashClosing, getSalesByCashClosingPending } from '../../../services/sales'
import Router from "next/router"


export default class extends React.Component{
    state = {
        total:0,
        time_options: {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
        },
        data: {
            branch_office:null,
            start_date:djangofriendlyDateformat(new Date()) ,
            end_date:djangofriendlyDateformat(new Date()),
            total_real:0,
            comment:0
        },
        ventas:[]
    }

    async componentDidMount() {
        let data = this.state.data
        let branch_office = localStorage.getItem('sucursal')
        data.branch_office = branch_office
        this.getPendingSalesByCashClosing()
        this.setState({ data })
    }

    selectStartDate = (selected_start_date) => {
        let data = this.state.data
        let start_date = djangofriendlyDateformat(selected_start_date[0])
        data.start_date = start_date
        this.setState({ data })
    }

    selectEndDate = (selected_end_date) => {
        let data = this.state.data
        let end_date = djangofriendlyDateformat(selected_end_date[0])
        data.end_date = end_date
        this.setState({ data })
    }

    async ejecutarCorte(){
        try {
            let values = this.state.data
            const resp = await addCashClosing(values)
            let cash_closing_id = resp.data.id
            alertify.success('Corte hecho correctamente')
            Router.pushRoute('cash-closing-detail', {id: cash_closing_id})
        } catch (error) {
            alertify.error('Error al ejecutar la venta')
            console.log(error)
        }
    }

    cambiaTotalCaja = (total_caja) => {
        let data = this.state.data
        data.total_real = total_caja.target.value
        this.setState({ data })
    }

    agregaComentario = (comentario) => {
        let data = this.state.data
        data.comment = comentario.target.value
        this.setState({ data })
    }


    async getPendingSalesByCashClosing () {
        let resp = await getSalesByCashClosingPending()
        let ventas = resp.data

        let items = []
        var total = 0

        ventas.forEach(item => {
            item.items.forEach(element => {
                item = {
                    sale_type: element.sale_type,
                    product_name:element.product_name,
                    unit_price:element.unit_price,
                    qty: element.qty,
                    total: element.total,
                }
                total += parseFloat(element.total)
            items.push(item)
            })
        })
        ventas = items
        // let total = 0
        // if (ventas.length > 0 ){
        //     total = resp.data.total
        // }
        this.setState({ ventas, total })
    }

    render(){

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Caja", url: "cash", active: false }
        ]
        return (
            <Layout title="Ventas" selectedMenu="sales" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">Ejecutar corte</h4>

                        <div className="columns is-multiline">
                            <div className="column is-4">
                                <label className="label-select">Inicio</label>
                                <Flatpickr
                                    onChange={ this.selectStartDate }
                                    options={this.state.time_options}
                                />
                            </div>

                            <div className="column is-4">
                                <label className="label-select">Fin</label>
                                <Flatpickr data-enable-time
                                    value={ this.state.end_time }
                                    onChange={ this.selectEndDate }
                                    options={this.state.time_options}
                                />
                            </div>

                            <div className="column is-2">
                                <label className="label-select">Total en caja</label>
                                <input
                                    type="text"
                                    className="input"
                                    onChange={ this.cambiaTotalCaja }
                                >
                                </input>
                            </div>

                            <div className="column is-12">
                                <label className="label-select">Comentarios</label>

                                <textarea
                                    onChange={ this.agregaComentario }
                                    className="textarea"
                                >
                                </textarea>

                            </div>

                            <div className="column is-1">
                                    <label className="label-select">&nbsp;</label>
                                    <button  className="button is-primary"  onClick={() => this.ejecutarCorte() }>Ejecutar corte</button>
                            </div>
                        </div>

                        { this.state.ventas.length > 0 ?
                            <div>
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
                                                <td>{ item.sale_type == 'product' ? 'producto' :''|| item.sale_type == 'appointment' ? 'cita':'' || item.sale_type == 'package' ? 'paquete' : 'sin definir'}</td>
                                                <td>{ item.product_name }</td>
                                                { item.sale_type != 'product' ? <td>No aplica</td>:
                                                <td className="sesiones">
                                                    { item.qty}
                                                </td>
                                                }
                                                <td>$ { item.unit_price }</td>
                                                <td>$ { item.qty * item.unit_price }</td>
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
                                            <th>${ this.state.total }</th>
                                        </tr>
                                    </tfoot>
                                </table>
                                <button className="button is-info"  onClick={() => this.cobrar() }>Cobrar</button>
                            </div>
                            :
                                <div className="div-wrapper">
                                    <p>No hay elementos en caja</p>
                                </div>
                            } 
                    </div>
                </div>
            </Layout>
        )
    }
}
