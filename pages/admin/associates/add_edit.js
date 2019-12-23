import Layout from '../../../components/layouts/Layout'
import Router from 'next/router'
import Select from 'react-select'
import Form from '../../../components/form/Form'
import Error from '../../../components/layouts/Error'
import { addAssociate, getAssociate, updateAssociate, getAssociateWorkDays,
    addAssociateWorkDays,deleteAssociateWorkDays, getAppointmentsAssociate,
    updateAssociateAppointmentStatus, getSpecialties } from '../../../services/associates'
import { getBranchOffices } from '../../../services/branch_offices'
import { getServices } from '../../../services/services'
import { getIncentives, payComission, addIncentiveSetting, getIncentiveSetting, updateIncentiveSetting } from '../../../services/incentives'
import { friendlyDateformat } from '../../../filters/filters'

export default class extends React.Component {

    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar asociado > ' : title='Agregar asociado'
        return { id, title }
    }

    state = {
        services:[],
        selected_services:[],
        specialties:[],
        selected_specialties:[],
        branch_offices: [],
        comisiones: {},
        dias: [],
        agenda: [],
        incentivos:[],
        nuevo:true,
        total_comisiones:0,
        total_porcentaje_comisiones:0,
        data: {
            is_active:true,
            services:[],
            specialties:[]
        },
        diaTrabajo:{
            day: 1,
            start_time: "09:00",
            end_time: "20:00"
        },
        time_options: {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            minDate: "9:00",
            maxDate: "20:00"
        },
        errors: {},
        errors2: {},
        errors3: {},
        error_mensaje:null,
        error_mensaje2:null,
        error_mensaje3:null,
        selected_tab: 1
    }

    async componentDidMount() {
        let data = this.state.data
        data.branch_office = localStorage.getItem('sucursal')

        //TRAE SUCURSALES
        try {
            const req = await getBranchOffices()
            const data = req.data.results
            let branch_offices = data.map(obj =>{
                return { label: obj.name, value: obj.id }
            })
            branch_offices.unshift({
                label:'Seleccionar...', value:'' 
            })
            this.setState({ branch_offices })
        } catch (error) {
            console.log(error)
        }

        //TRAE SERVICIOS
        try {
            const req = await getServices()
            const data = req.data.results
            let services = data.map(obj =>{
                return { label: obj.name, value: obj.id }
            })
            this.setState({ services })
        } catch (error) {
            console.log(error)
        }

        //TRAE ESPECIALIDADES
        try {
            const req = await getSpecialties()
            const data = req.data.results
            let specialties = data.map(obj =>{
                return { label: obj.name, value: obj.id }
            })
            this.setState({ specialties })
        } catch (error) {
            console.log(error)
        }

        if (this.props.id){

            //TRAE INFORMACION DE ASOCIADO
            try {
                const resp = await getAssociate(this.props.id)
                const selected_services = resp.data.services
                let services = []
                selected_services.forEach(s => {
                    services.push(s.value)
                })
                const selected_specialties = resp.data.specialties
                let specialties = []
                selected_specialties.forEach(s => {
                    specialties.push(s.value)
                })
                let data = {
                    id: this.props.id,
                    branch_office: resp.data.branch_office_id,
                    email: resp.data.email,
                    first_name: resp.data.first_name,
                    last_name: resp.data.last_name,
                    is_active: resp.data.is_active,
                    phone_number: resp.data.phone_number,
                    services,
                    specialties
                }

                this.setState({ data, selected_services, selected_specialties })
            } catch (error) {
                console.log(error)
            }

            // TRAE CONFIGURACION DE COMISIONES
            try {
                const respComisiones = await getIncentiveSetting(this.props.id)
                const params = { associate: this.props.id }
                const req = await getIncentives(params)
                let incentivos = req.data.results
                let total_comisiones = 0
                let total_porcentaje_comisiones = 0
                incentivos.forEach(element => {
                    total_comisiones += parseInt(element.total)
                    total_porcentaje_comisiones += parseInt(element.amount)
                })
                let comisiones = {
                    associate: respComisiones.data.associate,
                    sales_percentage: respComisiones.data.sales_percentage,
                    comission_percentage: respComisiones.data.comission_percentage
                }
                let nuevo = false;
                this.setState({ comisiones, nuevo, incentivos, total_comisiones, total_porcentaje_comisiones})
            } catch(error){
                let incentivos =[]
                let comisiones = {
                    associate: this.props.id,
                    sales_percentage: 0,
                    comission_percentage: 0
                }
                this.setState({ comisiones, incentivos })
            }

            // TRAE DIAS DE TRABAJO
            try {
                const req = await getAssociateWorkDays(this.props.id)
                const dias = req.data

                this.setState({dias})
            } catch(error){
                console.log(error)
             }

            // TRAE AGENDA
            try {
                const req = await getAppointmentsAssociate(this.props.id)
                const agenda = req.data.results
                this.setState({ agenda })
            } catch(error){
                console.log(error)
             }
        }
    }

    selectService = async(selected_services) => {
        let { data } = this.state
        let services = []

        selected_services.forEach(s => {
            services.push(s.value)
        });
        data.services = services

        this.setState({
            data, selected_services
        })
    }

    selectSpecialty = async(selected_specialties) => {
        let { data } = this.state
        let specialties = []

        selected_specialties.forEach(s => {
            specialties.push(s.value)
        });
        data.specialties = specialties

        this.setState({
            data, selected_specialties
        })
    }

    async pagarComision(comision){
        comision.effected = true
        await payComission(comision.pk, comision)
        const req = await getIncentives()
        const incentivos = req.data.results
        this.setState({ incentivos })
    }

    clickInTab(selected_tab){
        this.setState({ selected_tab })
    }

    async deleteWorkday(id, index) {
        try {
            await deleteAssociateWorkDays(this.props.id, id)
            let dias = this.state.dias
            dias.splice(index, 1)
            this.setState({ dias })
        } catch (error) {
            const error_mensaje = error
            this.setState({error_mensaje})
        }
    }

    async updateAppointmentStatus(id, status, index) {
        let nuevo_status = 'effected'
        status === 'effected' ? nuevo_status = 'canceled': 'effected'
        let jsonStatus = { status: nuevo_status}
        try {
            await updateAssociateAppointmentStatus(id,jsonStatus)
            alertify.success('Cita efectuada')
            const req = await getAppointmentsAssociate(this.props.id)
            const agenda = req.data.results
            this.setState({ agenda })
        } catch (error) {
            alertify.error('Cita cancelada')
            const error_mensaje = error
            this.setState({error_mensaje})
        }
    }

    render(){
        const { id, title } = this.props
        const { services, selected_services, specialties, selected_specialties, data } = this.state

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false,
            title: id > 0 ? this.state.data.first_name +" "+ this.state.data.last_name : title },
            { name: "Asociados", url: "associates", active: false },
            { name: id > 0 ? title.substring(title.length-2,-3) : title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            await updateAssociate(id, values)
                            this.clickInTab(2)
                            alertify.success('Asociado guardado correctamente')
                        } catch (error) {
                            alertify.error('Error al guardar asociado')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    } else {
                        try {
                            let resp = await addAssociate(values)
                            const associate_id = resp.data.id
                            this.setState({ associate_id })
                            Router.pushRoute('edit_associate', {id: associate_id})
                            alertify.success('Agregado correctamente');
                            this.clickInTab(2)
                        } catch (error) {
                            alertify.error('Error al agregar asociado')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    }
                }
            },
            fields:[{
                name:'first_name',
                label:'Nombre(s)',
                type:'text',
                helpText:'',
                width:'is-5'
            },{
                name:'last_name',
                label:'Apellidos',
                type:'text',
                helpText:'',
                width:'is-5'
            },{
                name:'is_active',
                label:'Activo',
                type:'checkbox',
                helpText:'',
                width:'is-2'
            },{
                name:'email',
                label:'Correo electrónico',
                type:'text',
                helpText:'',
                width:'is-5'
            },{
                name:'phone_number',
                label:'Número de teléfono',
                type:'text',
                keyPressValidation: 'only_numbers',
                helpText:'',
                width:'is-5'
            }],
            data: this.state.data,
            errors: this.state.errors
        }

        var form2 = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {

                    if (!this.state.nuevo){
                        try {
                            await updateIncentiveSetting(id, values)
                            this.clickInTab(3)
                            alertify.success('Comisiones asignadas correctamente')
                        } catch (error) {
                            console.log(error)
                        }
                    } else {
                        try {
                            await addIncentiveSetting(values)
                            this.clickInTab(3)
                            alertify.success('Comisiones asignadas correctamente')
                        } catch (error) {
                            const errors2 = error.response.data
                            this.setState({ errors2 })
                            console.log(error)
                        }
                    }

                }
            },
            fields:[{
                name:'comission_percentage',
                label:'Porcentaje de comision',
                type:'text',
                helpText:'',
                width:'is-3'
            },{
                name:'sales_percentage',
                label:'Porcentaje de venta',
                type:'text',
                helpText:'',
                width:'is-offset-1 is-3'
            }],
            data: this.state.comisiones,
            errors: this.state.errors2
        }

        var form3 = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    try {
                        await addAssociateWorkDays(id, values)
                        const req = await getAssociateWorkDays(id)
                        const dias = req.data
                        const error_mensaje3 = null

                        this.setState({dias, error_mensaje3})
                    } catch (error) {
                        const error_mensaje3 = "Horario no disponible"
                        this.setState({ error_mensaje3 })
                    }
                }
            },
            fields:[{
                name:'day',
                label:'Dia',
                type:'select',
                helpText:'',
                options:[
                    { label:'Seleccionar...', value:'' },
                    { label:'Lunes', value:'1' },
                    { label:'Martes', value:'2' },
                    { label:'Miércoles', value:'3' },
                    { label:'Jueves', value:'4' },
                    { label:'Viernes', value:'5' },
                    { label:'Sábado', value:'6' },
                    { label:'Domingo', value:'7' }
                ],
                width:'is-4'
            },{
                name: "start_time",
                label: "Hora de entrada",
                type: "timepicker",
                helpText: "",
                width:'is-2',
                options: this.state.time_options
            },{
                name: "end_time",
                label: "Hora salida",
                type: "timepicker",
                helpText: "",
                width:'is-2',
                options: this.state.time_options
          }],
            data: this.state.diaTrabajo,
            errors: this.state.errors3
        }

        return (
            <Layout title={ id > 0 ? title.substring(title.length-2,-3) : title } selectedMenu="associates" breadcrumb={breadcrumb}>
            <div className="card height-60">
                <div className="card-content height-100">
                    <div className={id?'tabs is-small':'tabs is-small'}>
                        <ul id="tabs">
                            <li className={this.state.selected_tab == 1?'is-active':''}onClick={(e) => this.clickInTab(1)}><a>General</a></li>
                            <li className={this.state.selected_tab == 2?'is-active':''}onClick={(e) => this.clickInTab(2)}><a>Comisiones</a></li>
                            <li className={this.state.selected_tab == 3?'is-active':''}onClick={(e) => this.clickInTab(3)}><a>Días de trabajo</a></li>
                            <li className={this.state.selected_tab == 4?'is-active':''}onClick={(e) => this.clickInTab(4)}><a>Agenda</a></li>
                        </ul>
                    </div>
                    <div className={this.state.selected_tab == 1?'':'hide'} id="tab_general">
                        <Form
                            buttonLabel={ form.button.label }
                            onSubmit={ form.button.onSubmit }
                            fields={ form.fields }
                            data={ form.data }
                            errors={ form.errors }
                        >
                        <div className="columns">
                            <div className="column is-5">
                                <label className="label-select">Servicios *</label>
                                <Select
                                    instanceId
                                    isMulti
                                    closeMenuOnSelect={ true }
                                    value={ selected_services }
                                    onChange={ this.selectService.bind(this)}
                                    options={ services }
                                />
                            </div>
                            <div className="column is-5">
                                <label className="label-select">Especialidades</label>
                                <Select
                                    instanceId
                                    isMulti
                                    closeMenuOnSelect={ true }
                                    value={ selected_specialties }
                                    onChange={ this.selectSpecialty.bind(this)}
                                    options={ specialties }
                                />
                            </div>
                        </div>
                        </Form>
                        { this.state.error_mensaje != null ?
                        <Error
                            titulo="error"
                            mensaje = {this.state.error_mensaje}
                        />
                        :<span></span>
                    }
                    </div>
                    <div className={this.state.selected_tab == 2?'':'hide'} id="tab_comissions">
                        <Form
                            buttonLabel={ form2.button.label }
                            onSubmit={ form2.button.onSubmit }
                            fields={ form2.fields }
                            data={ form2.data }
                            errors={ form2.errors }
                        />
                        <br></br>
                        <h4 className="subtitle is-4">Comisiones</h4>
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Porcentaje</th>
                                    <th>Total venta</th>
                                    <th>Comisión</th>
                                    <th>Concepto</th>
                                    <th>Fecha</th>
                                    <th>Pagado</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.incentivos.map((obj) => (
                                <tr key={obj.pk}>
                                    <td>{ parseInt(obj.percentage) }%</td>
                                    <td>${ obj.total }</td>
                                    <td>${ obj.amount }</td>
                                    <td>{ obj.comment }</td>
                                    <td>{ friendlyDateformat(obj.created_at) }</td>
                                    <td>{ obj.effected == true ?
                                        <button className="button is-small is-success tooltip disabled" data-tooltip="Pagado">
                                            <span>Pagado</span>
                                        </button>
                                    :
                                    <button onClick={ (e) => this.pagarComision(obj) } className="button is-small is-success is-outlined tooltip" data-tooltip="Pagar">
                                        <span className="icon is-small">
                                            <i className="fas fa-money-bill-alt"></i>
                                        </span>
                                        <span>pagar</span>
                                    </button>
                                    }</td>
                                </tr>
                                )) }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><b> Total </b></td>
                                    <td><b> ${ this.state.total_comisiones}</b></td>
                                    <td><b> ${ this.state.total_porcentaje_comisiones } </b></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                        { this.state.error_mensaje2 != null ?
                        <Error
                            titulo="error"
                            mensaje = {this.state.error_mensaje2}
                        />
                        :<span></span>
                    }
                    </div>
                    <div className={this.state.selected_tab == 3?'':'hide'} id="days">
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Día</th>
                                    <th>Horario</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.dias.map((obj, index) => (
                                    <tr key={ index }>
                                        <td>{ obj.day_str }</td>
                                        <td>{ (obj.start_time).substring(0,5) } - { (obj.end_time).substring(0,5) }</td>
                                        <td>
                                            <p className="buttons is-centered">
                                                <a onClick={ (e) => this.deleteWorkday(obj.id, index)} className="button is-small is-danger tooltip" data-tooltip="Borrar">
                                                    <span className="icon is-small">
                                                        <i className="fas fa-trash"></i>
                                                    </span>
                                                </a>
                                            </p>
                                        </td> 
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                        <h4 className="subtitle is-4">Agregar día</h4>
                        <Form
                            buttonLabel={ form3.button.label }
                            onSubmit={ form3.button.onSubmit }
                            fields={ form3.fields }
                            data={ form3.data }
                            errors={ form3.errors }
                        />
                        { this.state.error_mensaje3 != null ?
                        <Error
                            titulo="error"
                            mensaje = {this.state.error_mensaje3}
                        />
                        :<span></span>}
                    </div>
                    <div className={this.state.selected_tab == 4?'':'hide'} id="tab_agenda">
                        {this.state.agenda.length > 0 ? 
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Servicio</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Status</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.agenda.map((obj, index) => (
                                    <tr key={ index }>
                                        <td>{ obj.appointment }</td>
                                        <td>{ obj.service }</td>
                                        <td>{ friendlyDateformat(obj.date) }</td>
                                        <td>{ obj.start_time.substring(0,5) } - { obj.end_time.substring(0,5) }</td>
                                        <td>{ obj.status == 'effected' ? 'Efectuada' : obj.status === 'canceled' ? 'Cancelada':'Pendiente' }</td>
                                        <td>
                                            { obj.status === 'pending' || obj.status === 'canceled' ?
                                            <a onClick={ (e) => this.updateAppointmentStatus(obj.id, obj.status, index)} className="button is-small is-success is-outlined tooltip" data-tooltip="Efectuar">
                                                <span className="icon is-small">
                                                    <i className="fas fa-check"></i>
                                                </span>
                                                <span>Efectuar</span>
                                            </a>
                                        :
                                            <a onClick={ (e) => this.updateAppointmentStatus(obj.id, obj.status, index)} className="button is-small is-danger is-outlined tooltip" data-tooltip="Cancelar">
                                                <span className="icon is-small">
                                                    <i className="fas fa-check"></i>
                                                </span>
                                                <span>Cancelar</span>
                                            </a>
                                        }
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                        :
                            <div className="div-wrapper">No hay citas pendientes</div>
                        }
                        { this.state.error_mensaje4 != null ?
                        <Error
                            titulo="error"
                            mensaje = {this.state.error_mensaje4}
                        />
                        :<span></span>
                    }
                    </div>
                </div>
            </div>
            <style jsx>{`
                .div-wrapper{
                    font-size:20px;
                    font-weight:600;
                    text-align:center;
                }
            `}
            </style>
            </Layout>
        )
    }
}
