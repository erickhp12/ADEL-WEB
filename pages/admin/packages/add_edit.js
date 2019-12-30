import Layout from '../../../components/layouts/Layout'
import { addPackage, getSinglePackage, updatePackage } from '../../../services/packages'
import { getServices } from '../../../services/services'
import Router from 'next/router'
import Form from '../../../components/form/Form'

export default class extends React.Component{
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar paquete' : title='Agregar paquete'
        return { id, title }
    }

    state = {
        data: {
            is_active: true,
            sessions: [{
                "num_session": 1,
                "services": []
            }]
        },
        extra_data: {
            service_selected: null,
        },
        num_sessions: 1,
        services: [],
        selected_services: [],
        total_sessions: [],
        normal_prices: [],
        normal_total_price: 0,
        promotion_price: 0,
        errors: {},
        temp:[[]]
    }

    async componentDidMount() {
        try {
            const req = await getServices()
            const services = req.data.results
            this.setState({ services })
        } catch (error) {
            console.log(error)
        }

        if (this.props.id){
            try {
                const resp = await getSinglePackage(this.props.id)
                let sessions = resp.data.sessions
                let data = {
                    id: this.props.id,
                    name: resp.data.name,
                    description: resp.data.description,
                    validity_start: resp.data.validity_start,
                    validity_end: resp.data.validity_end,
                    discount_type: resp.data.discount_type,
                    discount: resp.data.discount,
                    is_active: resp.data.is_active,
                    sessions
                }

                const num_sessions = sessions.length
                let services = this.state.services
                let temp = []

                let selected_services_ids = []
                sessions.forEach((session) => {
                    selected_services_ids = selected_services_ids.concat(session.services)
                })
                selected_services_ids = [...new Set(selected_services_ids)]
                let selected_services = []
                selected_services_ids.forEach((id) =>{
                    let index = services.findIndex(o => o.id === id)
                    selected_services.push(services[index])
                    services.splice(index, 1)
                })

                sessions.forEach((session) => {
                    let array = []
                    selected_services.forEach((sel_ser) => {
                        array.push(0)
                    })
                    temp.push(array)
                    session.services.forEach((service_id) => {
                        let index = selected_services.findIndex(o => o.id === service_id)
                        array[index] = service_id
                    })
                })

                this.setState({
                    data,
                    num_sessions,
                    services,
                    selected_services,
                    temp
                }, () => this.calculateModifications())
            } catch (error) {
                console.log(error)
            }
        }
    }

	handleChange(e) {
		let extra_data = this.state.extra_data
		extra_data[e.target.name] = e.target.value
		this.setState({ 'extra_data': extra_data })
    }

    calculateModifications = () => {
        let selected_services = this.state.selected_services
        let total_sessions = this.state.total_sessions
        let normal_prices = this.state.normal_prices
        let normal_total_price = 0
        let promotion_price = 0
        let discount = this.state.data.discount
        let temp = this.state.temp

        selected_services.forEach((sel_ser, index) => {
            let total = 0
            temp.forEach((obj) => {
                if (obj[index] != 0) total++
            })
            total_sessions[index] = total
            let normal_price = total * parseFloat(sel_ser.price)
            normal_prices[index] = normal_price
            normal_total_price += normal_price
        })

        if (this.state.data.discount_type != undefined && this.state.data.discount != undefined){
            if (this.state.data.discount_type === 'percentage')
                promotion_price = normal_total_price - ((normal_total_price * discount) / 100)
            else if (this.state.data.discount_type === 'direct')
                promotion_price = normal_total_price - discount
            else
                console.log('Tipo de descuento no válido')
        }
        else
            promotion_price = normal_total_price
        
        this.setState({
            total_sessions,
            normal_prices,
            normal_total_price,
            promotion_price
        })
    }

    changeProtocol(index, sel_ser_index, service_id){
        console.log('hola')
        let data = this.state.data
        let sessions = data.sessions
        let temp = this.state.temp

        if (temp[index][sel_ser_index] == 0)
            temp[index][sel_ser_index] = service_id
        else
            temp[index][sel_ser_index] = 0

        sessions[index].services = temp[index].filter((value) => {
            return value != 0
        })
        data.sessions = sessions
        this.setState({ data, temp }, () => this.calculateModifications())
    }

    addService(){
        let data = this.state.data
        let extra_data = this.state.extra_data
        let services = this.state.services
        let selected_services = this.state.selected_services
        let service_selected = extra_data.service_selected
        let temp = this.state.temp
        let total_sessions = this.state.total_sessions
        let normal_prices = this.state.normal_prices
        
        if (service_selected == null) return false

        let service = Object.assign({}, services[service_selected])
        selected_services.push(service)

        temp.forEach((obj, index) => {
            temp[index].push(0)
        })

        services.splice(service_selected, 1)
        total_sessions.push(0)
        normal_prices.push(0)

        service_selected = null
        document.getElementsByName('service_selected')[0].options[0].selected = 'selected'

        extra_data['service_selected'] = service_selected

        this.setState({
            extra_data,
            services,
            selected_services,
            total_sessions,
            normal_prices,
            temp
        })
    }

    removeService(index){
        let data = this.state.data
        let services = this.state.services
        let selected_services = this.state.selected_services
        let total_sessions = this.state.total_sessions
        let normal_prices = this.state.normal_prices
        let temp = this.state.temp

        services.push(selected_services[index])
        selected_services.splice(index, 1)
        total_sessions.splice(index, 1)
        normal_prices.splice(index, 1)
        temp.forEach((obj, session_index) => {
            temp[session_index].splice(index, 1)
        })

        this.setState({
            services,
            selected_services,
            total_sessions,
            normal_prices,
            temp
        }, () => this.calculateModifications())
    }

    changeSessions(value){
        console.log('holaaa')
        let data = this.state.data
        let num_sessions = this.state.num_sessions
        let sessions = data.sessions
        let selected_services = this.state.selected_services
        let temp = this.state.temp
        if (num_sessions == 1 && value == '-'){
            console.log('No es posible tener menos de una sesión en el paquete')
            return false
        }
        switch(value){
            case '+':
                num_sessions++
                const session = {
                    "num_session": num_sessions,
                    "services": []
                }
                sessions.push(session)
                
                let temp_session = []
                selected_services.forEach((obj) => {
                    temp_session.push(0)
                })
                temp.push(temp_session)
                
                break
            case '-':
                num_sessions--
                let last_index = this.state.data.sessions.length - 1
                sessions.splice(last_index, 1)
                temp.splice(last_index, 1)
                break
            default:
                console.log('el parámetro de la función changeSessions no es aceptado.')
                return false
        }
        this.setState({
            num_sessions,
            temp
        }, () => this.calculateModifications())
    }

    render(){
        const { id, title } = this.props

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false,
            title:"PAQUETES",total:this.state.total_records },
            { name: "Paquetes", url: "", active: true },
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            values['edition_description'] = this.state.extra_data.edition_description
                            await updatePackage(id, values)
                            alertify.success('Paquete Guardado correctamente')
                            Router.pushRoute('packages')
                        } catch (error) {
                            alertify.error('Error al guardar paquete')
                            const errors = error.response.data
                            this.setState({ errors })
                            console.log(error)
                        }
                    } else {
                        try {
                            await addPackage(values)
                            alertify.success('Paquete agregado correctamente')
                            Router.pushRoute('packages')
                        } catch (error) {
                            alertify.error('Error al agregar paquete')
                            console.log(error)
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
                name:'description',
                label:'Descripción *',
                type:'textarea',
                helpText:'',
                width:'is-12'
            },{
                name:'validity_start',
                label:'Inicio paquete *',
                type:'datepicker',
                helpText:'',
                width:'is-2'
            },{
                name:'validity_end',
                label:'Fin paquete *',
                type:'datepicker',
                helpText:'',
                width:'is-2'
            },{
                name:'discount_type',
                label:'Tipo descuento',
                type:'select',
                helpText:'',
                options:[
                    { label:'Seleccionar...', value:'' },
                    { label:'Porcentaje', value:'percentage' },
                    { label:'Cantidad', value:'direct' }
                ],
                width:'is-3',
                fun: this.calculateModifications
            },{
                name:'discount',
                label:'Descuento',
                type:'text',
                helpText:'',
                width:'is-3',
                fun: this.calculateModifications
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
            <Layout title={ title } selectedMenu="packages" breadcrumb={breadcrumb}>
                <div className="card">
                    <div className="card-content">
                    <h4 className="subtitle is-4">{ title }</h4>  
                    <Form
                        buttonLabel={ form.button.label }
                        onSubmit={ form.button.onSubmit }
                        fields={ form.fields }
                        data={ form.data }
                        errors={ form.errors }
                    >
                    
                    <hr/>
                    <h4 className="subtitle is-4">Sesiones</h4>

                    <div className="sesiones">
                        <input type="button" disabled={ this.state.num_sessions == 1 } onClick={(e) => this.changeSessions('-')} value="-" />
                        <input type="text" defaultValue={ this.state.num_sessions } />
                        <input type="button" onClick={(e) => this.changeSessions('+')} value="+" />

                        <select name="service_selected" onChange={(e) => this.handleChange(e)}>
                            <option value="">Seleccionar...</option>
                            { this.state.services.map((service, index) => (
                                <option value={ index } key={ index }>{ service.name }</option>
                            )) }
                        </select>
                        <button onClick={(e) => this.addService() }>Agregar</button>
                        <label>Precio total normal  <b>${ this.state.normal_total_price }</b></label>
                        <label>Precio promoción <b>${ this.state.promotion_price }</b></label>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Protocolo</th>
                                { this.state.selected_services.map((service, index) => (
                                    <th key={ index }>
                                        { service.name }
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <button onClick={(e) => this.removeService(index)} className="button is-small is-danger is-outlined">X</button>
                                    </th>
                                )) }
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Precio por sesión</td>
                                { this.state.selected_services.map((sel_ser, sel_ser_index) => (
                                    <td key={ sel_ser_index}>{ sel_ser.price }</td>
                                )) }
                            </tr>
                            { this.state.data.sessions.map((session, index) => (
                                <tr key={ index }>
                                    <td>Sesión # { index + 1 }</td>
                                    { this.state.selected_services.map((sel_ser, sel_ser_index) => (
                                        <td key={ sel_ser_index}>
                                            { this.state.temp[index][sel_ser_index] == 0 ?
                                            <i className="far fa-square" onClick={(e) => this.changeProtocol(index, sel_ser_index, sel_ser.id)}></i>
                                            :
                                            <i className="fas fa-square" onClick={(e) => this.changeProtocol(index, sel_ser_index, sel_ser.id)}></i>
                                            }
                                        </td>
                                    )) }
                                </tr>
                            )) }
                            <tr>
                                <td>Sesiones totales</td>
                                { this.state.total_sessions.map((obj, index) => (
                                    <td key={ index}>{ obj }</td>
                                )) }
                            </tr>
                            <tr>
                                <td>Precio normal</td>
                                { this.state.normal_prices.map((obj, index) => (
                                    <td key={ index}>{ obj }</td>
                                )) }
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className="comentarios">
                        <h1>Comentarios sobre la edicion</h1>
                        <textarea rows="4" name="edition_description" onChange={(e) => this.handleChange(e)}></textarea>
                    </div>
                    </Form>

                    <style jsx>{`
                        .sesiones, .totales {
                            background: white;
                            padding: 10px;
                            border: 1px solid #cacaca;
                            border-radius: 4px;
                            margin-bottom:1rem;
                            margin-top:1rem;
                        }

                        .comentarios {
                            margin-top: 1rem;
                        }

                        .sesiones>label {
                            margin-left:2rem;
                        }

                        .sesiones>select, .sesiones>button {
                            margin-left:2rem;
                        }

                        .sesiones>select, .sesiones>button {
                            margin-left:2rem;
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

                        .sesiones>input, .sesiones>select, .sesiones>button {
                            height: 2em;
                        }

                        textarea {
                            width:100%;
                        }

                        .sesiones>button {
                            padding:5px;
                            color: white;
                            font-size:16px;
                            font-weight: 500;
                            border-radius:4px;
                            background: #209cee;
                        }

                        table {
                            width: 100%;
                            background: white;
                            border: 1px solid #cacaca;
                            margin-top: 0.5rem;
                            padding: 1rem;
                        }

                        tr, th, td {
                            border: 1px solid #cacaca;
                            padding:5px;
                            padding-left: 10px;
                        }
                        `
                        }
                    </style>
                </div>
            </div>
        </Layout>
        )
    }
}