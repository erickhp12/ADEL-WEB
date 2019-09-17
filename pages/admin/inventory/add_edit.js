import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getBranchOffice } from '../../../services/branch_offices'
import { getInventory, addInventoryAction } from '../../../services/inventory'
import Router from 'next/router'

export default class extends React.Component{
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Ajustar inventario' : title='Iniciar inventario'
        return { id, title }
    }

    state = {
        objects: [],
        data: {
            branch_office_id: this.props.id
        },
        initialized_inventory: null,
        new_product_inventory: [],
        new_stock: []
    }

    async componentDidMount() {
        let branch_office_id = this.props.id
        let req = await getBranchOffice(branch_office_id)
        const branch_office = req.data
        let initialized_inventory = branch_office.initialized_inventory

        this.setState({ initialized_inventory })
        this.getBranchOfficeInventory(branch_office_id)
    }

    getBranchOfficeInventory = async (branch_office_id) => {
        try {
            let new_stock = []
            let req = await getInventory(branch_office_id)
            const objects = req.data
            let new_product_inventory = []
            if (!this.state.initialized_inventory){
                new_product_inventory = objects.map((obj) => {
                    let temp = {
                        'product_inventory': obj.id,
                        'qty': 0,
                        'action_type': 'in',
                        'reason': 'initial inventory'
                    }
                    return temp
                })
            } else {
                new_product_inventory = objects.map((obj, index) => {
                    new_stock.push(objects[index].stock)
                    return {
                        'product_inventory': obj.id,
                        'qty': 0,
                        'action_type': '',
                        'reason': ''
                    }
                })
            }
            this.setState({ objects, new_product_inventory, new_stock }, () => console.log(this.state))
        } catch (error) {
            console.log(error)
        }
    }

	handleKeyPress(validation, e) {
		var charCode = (e.which) ? e.which : e.keyCode;
		switch(validation) {
			case undefined:
				return true
			case 'only_numbers':
				if (charCode >= 48 && charCode <= 57)
					return true
				else
					e.preventDefault()
				break
			case 'read_only':
				e = (e) ? e : window.event;
				e.preventDefault()
				break
			default:
				console.log('Validacion KeyPress no valida')
				return true
		}
	}

    changeStockClick(index, action){
        let new_product_inventory = this.state.new_product_inventory
        let new_stock = this.state.new_stock
        let objects = this.state.objects
        var reason = new_product_inventory[index].reason

        switch(action){
            case '-':
                new_product_inventory[index].qty--
                new_stock[index] -= new_product_inventory[index].qty
                reason = 'missing'
                break
            case '+':
                new_product_inventory[index].qty++
                new_stock[index] -=  new_product_inventory[index].qty
                reason = 'excess'
                break
            default:
                console.log('El parámetro action no es válido')
        }
        this.updateStock(reason,index)
        if (this.state.initialized_inventory)
            this.changesInInventory(reason, index, new_stock, new_product_inventory, objects)
        else
            this.setState({ new_product_inventory, new_stock })
    }

    changeStock = (e) => {
        let new_product_inventory = this.state.new_product_inventory
        let value = e.target.value
        const id = e.target.getAttribute('data-pk')
        let index = new_product_inventory.findIndex(o => o.id == id)
        if(value !== '')
            new_product_inventory[index].qty = parseInt(value)
        else
            new_product_inventory[index].qty = 0
        this.setState({ new_product_inventory })
    }

    save = async(e) => {
        let initialized_inventory = this.state.initialized_inventory
        let new_product_inventory = this.state.new_product_inventory
        try {
            if (initialized_inventory)
            {
                new_product_inventory = new_product_inventory.filter((obj) => {
                    if (obj.qty != 0) return obj
                })
            }
            let req = await addInventoryAction(this.props.id, new_product_inventory)
            alertify.success('Inventario actualizado')
            Router.pushRoute('inventory')
        } catch (error) {
            alertify.error('Error al actualizar inventario')
            console.log(error)
        }
    }

    changeReason = (e, index) => {
        let new_product_inventory = this.state.new_product_inventory
        let new_stock = this.state.new_stock
        let objects = this.state.objects
        const reason = e.target.value
        this.changesInInventory(reason, index, new_stock, new_product_inventory, objects)
    }

    updateStock = (razon, index) => {
        let new_product_inventory = this.state.new_product_inventory
        let new_stock = this.state.new_stock
        let objects = this.state.objects
        var reason = razon
        this.changesInInventory(reason, index, new_stock, new_product_inventory, objects)
    }

    changesInInventory(reason, index, new_stock, new_product_inventory, objects){
        let action_type = null
        switch(reason){
            case 'excess':
                action_type = 'in'
                new_stock[index] = objects[index].stock + new_product_inventory[index].qty
                break
            case 'missing':
                action_type = 'out'
                new_stock[index] = objects[index].stock - new_product_inventory[index].qty
                break
            case 'loss':
                new_stock[index] = objects[index].stock - new_product_inventory[index].qty
                action_type = 'out'
                break
            default:
                action_type = ''
                new_stock[index] = objects[index].stock
        }

        new_product_inventory[index].action_type = action_type
        new_product_inventory[index].reason = reason
        this.setState({ new_product_inventory, new_stock })
    }

    render(){
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Inventario", url: "inventory", active: false },
            { name: "Sucursal", url: "", active: true }
        ]
        return (
            <Layout title="Inventario" selectedMenu="inventory" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">Inventario</h4>

                        <div className="field has-addons is-pulled-right">
                            <div className="control">
                                <input className="input is-radiusless" type="text" placeholder="Buscar..." />
                            </div>
                            <div className="control">
                                <button type="button" className="button is-info is-radiusless">
                                    <span className="icon is-small">
                                        <i className="fas fa-search"></i>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Codigo</th>
                                    <th>Nombre</th>
                                    <th className={!this.state.initialized_inventory?'hide':''}>Stock</th>
                                    { !this.state.initialized_inventory ?
                                        <th>Cantidad</th>
                                    :
                                        <th>Ajuste</th>
                                    }
                                    <th className={!this.state.initialized_inventory?'hide':''}>Nuevo stock</th>
                                    <th className={!this.state.initialized_inventory?'hide':''}>Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.objects.map((obj, index) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.id }</td>
                                        <td>{ obj.product_code }</td>
                                        <td>{ obj.product }</td>
                                        <td className={!this.state.initialized_inventory?'hide':''}>{ obj.stock }</td>
                                        <td className="sesiones">
                                            <button
                                                onClick={(e) => this.changeStockClick(index, '-') }
                                                disabled={ this.state.new_product_inventory[index].qty <= 0}
                                            >-</button>
                                            <input
                                                type="text"
                                                data-pk={ obj.id }
                                                onChange={ (e) => this.changeStock(e)}
                                                onKeyPress={ (e) => this.handleKeyPress('only_numbers', e)}
                                                value={ this.state.new_product_inventory[index].qty }
                                            />
                                            <button onClick={(e) => this.changeStockClick(index, '+') }>+</button>
                                        </td>
                                        <td className={!this.state.initialized_inventory?'hide':''}>{ this.state.new_stock[index] }</td>
                                        <td className={!this.state.initialized_inventory?'hide':''}>
                                            <select onChange={ (e) => this.changeReason(e, index) }>
                                                <option value="">Seleccionar...</option>
                                                <option value="excess">Excendente</option>
                                                <option value="missing">Faltante</option>
                                                <option value="loss">Perdida</option>
                                            </select>
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                        <button className="button is-info" onClick={ (e) => this.save(e) }>Guardar</button>
                    </div>
                </div>

                <style jsx>{`
                            .sesiones {
                                padding: 10px;
                                border: 1px solid #cacaca;
                                border-radius: 4px;
                                margin-bottom:1rem;
                                margin-top:1rem;
                            }

                            .sesiones>input, .sesiones>select, .sesiones>button, textarea {
                                -webkit-appearance: none;
                                -ms-flex-align: center;
                                border: 1px solid transparent;
                                border-radius: 3px;
                                font-size: 1rem;
                                -webkit-box-pack: start;
                                -ms-flex-pack: start;
                                -webkit-justify-content: flex-start;
                                -ms-flex-pack: start;
                                padding-bottom: calc(.375em - 1px);
                                padding-left: calc(.625em - 1px);
                                padding-right: calc(.625em - 1px);
                                padding-top: calc(.375em - 1px);
                                background-color: #fff;
                                border-color: #dbdbdb;
                                color: #363636;
                                cursor: pointer;
                            }

                            .sesiones>input{
                                width:50px;
                                height: 2em;
                            }
                            .sesiones>button {
                                height: 2em;
                            }
    
                            .qty{
                                width:50px;
                            }

                            .minus{
                                font-weight: 700;
                                border-radius: 2px;
                            }

                            .sesiones>button {
                                padding:5px;
                                font-size:16px;
                                font-weight: 500;
                                border-radius:4px;
                            }

                            `
                            }
                        </style>
            </Layout>
        )
    }
}
