import Layout from '../../../components/layouts/Layout'
import Form from '../../../components/form/Form'
import { friendlyDateformat } from '../../../filters/filters'
import { Link } from '../../../routes'
import Router from 'next/router'

import { getAppointments } from '../../../services/appointments'
import {
    addPatient, getPatient, updatePatient,
    savePatientsAddress, savePatientsPersonalInfo, savePatientsNotes,
    deletePatientsNote, addMedicalHistory, deleteMedicalHistory, getPatientPackages
} from '../../../services/patients'

export default class extends React.Component {
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar paciente > ': title='Agregar paciente'
        return { id, title }
    }

    state = {
        data: {
            is_active:true
        },
        data2: {
            country:'mexico'
        },
        data3: {},
        data4: {},
        data5: {},
        errors: {},
        errors2: {},
        errors3: {},
        errors4: {},
        errors5: {},
        notes: [],
        citas: [],
        paquetesPaciente:[],
        medical_history: [],
        selected_tab: 1,
        patient_id:this.props.id
    }

    async componentDidMount() {
        if (this.props.id){
            try {
                const resp = await getPatient(this.props.id)
                let data = {
                    id: this.props.id,
                    first_name: resp.data.first_name,
                    last_name: resp.data.last_name,
                    email: resp.data.email,
                    phone_number: resp.data.phone_number,
                    is_active: resp.data.is_active
                }
                const params = { patient: this.props.id }
                const respCitas = await getAppointments(params)

                const respPaquetesPaciente = await getPatientPackages(params)

                let data2 = {}
                if (resp.data.address != null)
                    data2 = resp.data.address

                let data3 = {}
                if (resp.data.personal_information != null)
                    data3 = resp.data.personal_information

                let citas = {}
                    if (respCitas.data.results != null)
                        citas = respCitas.data.results

                let paquetesPaciente = {}
                    if (respPaquetesPaciente.data.results != null)
                        paquetesPaciente = respPaquetesPaciente.data.results

                let notes = resp.data.notes
                let medical_history = resp.data.medical_history

                this.setState({
                    data,
                    data2,
                    data3,
                    notes,
                    citas,
                    paquetesPaciente,
                    medical_history
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    async deleteNote(index, id) {
        try {
            await deletePatientsNote(this.props.id, id)
            let notes = this.state.notes
            notes.splice(index, 1)
            this.setState({ notes })
        } catch (error) {
            console.log(error)
        }
    }

    async deleteMedicalHistory(index, id) {
        try {
            await deleteMedicalHistory(this.props.id, id)
            let medical_history = this.state.medical_history
            medical_history.splice(index, 1)
            this.setState({ medical_history })
        } catch (error) {
            console.log(error)
        }
    }

    clickInTab(selected_tab){
        this.setState({ selected_tab })
    }

    render(){
        const { id, title } = this.props

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Pacientes", url: "patients", active: false },
            { name: title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            await updatePatient(id, values)
                            Router.pushRoute('patients')
                            this.clickInTab(2)
                        } catch (error) {
                            alertify.error('Error al guardar')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    } else {
                        try {
                            const resp = await addPatient(values)
                            const patient_id = resp.data.id
                            this.setState({ patient_id })
                            Router.pushRoute('edit_patient', {id: patient_id})
                            alertify.success('Agregado correctamente');
                            this.clickInTab(2)
                        } catch (error) {
                            alertify.error('Error al guardar')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    }
                }
            },
            fields:[{
                name:'first_name',
                label:'Nombre(s) *',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'last_name',
                label:'Apellido(s) *',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'email',
                label:'Correo electrónico',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'phone_number',
                label:'Número de teléfono *',
                type:'text',
                keyPressValidation: 'only_numbers',
                helpText:'',
                width:'is-6'
            },{
                name:'is_active',
                label:'Activo',
                type:'checkbox',
                helpText:'',
                width:'is-6'
            }],
            data: this.state.data,
            errors: this.state.errors
        }

        var form2 = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    try {
                        await savePatientsAddress(this.state.patient_id, values)
                        alertify.success('Guardado correctamente')
                        this.clickInTab(3)
                    } catch (error) {
                        alertify.error('Error al guardar')
                        const errors2 = error.response.data
                        this.setState({ errors2 })
                    }
                }
            },
            fields:[{
                name:'street_address',
                label:'Dirección',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'zip_code',
                label:'Código postal',
                type:'text',
                keyPressValidation: 'only_numbers',
                helpText:'',
                width:'is-6'
            },{
                name:'city',
                label:'Ciudad',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'state',
                label:'Estado',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'country',
                label:'País',
                type:'select',
                helpText:'',
                options:[
                    { label:'Seleccionar...', value:'' },
                    { label:'México', value:'mexico' },
                    { label:'Estados Unidos', value:'us' }
                ],
                width:'is-6'
            }],
            data: this.state.data2,
            errors: this.state.errors2
        }

        var form3 = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                        try {
                            await savePatientsPersonalInfo(this.state.patient_id, values)
                            alertify.success('Guardado correctamente')
                            this.clickInTab(4)
                        } catch (error) {
                            alertify.error('Error al guardar')
                            const errors3 = error.response.data
                            this.setState({ errors3 })
                        }
                }
            },
            fields:[
            {
                name:'date_of_birthday',
                label:'Fecha de nacimiento (AAAA-MM-DD) *',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'place_of_birth',
                label:'Lugar de nacimiento *',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'occupation',
                label:'Ocupación',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'civil_status',
                label:'Estado Civil *',
                type:'select',
                helpText:'',
                options:[
                    { label:'Seleccionar...', value:'' },
                    { label:'Casado', value:'married' },
                    { label:'Soltero', value:'single' },
                    { label:'Divorciado', value:'divorced' },
                    { label:'Viudo', value:'widowed' },
                    { label:'Otro', value:'other' }
                ],
                width:'is-6'
            },{
                name:'scholarship',
                label:'Escolaridad',
                type:'text',
                helpText:'',
                width:'is-6'
            },
            {
                name:'gender',
                label:'Género *',
                type:'select',
                helpText:'',
                options:[
                    { label:'Seleccionar...', value:'' },
                    { label:'Masculino', value:'male' },
                    { label:'Femenino', value:'female' }
                ],
                width:'is-6'
            },{
                name:'religion',
                label:'Religión',
                type:'text',
                helpText:'',
                width:'is-6'
            }],
            data: this.state.data3,
            errors: this.state.errors3
        }

        var form4 = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            let resp = await savePatientsNotes(this.state.patient_id, values)
                            const note = resp.data
                            let notes = this.state.notes
                            notes.push(note)
                            this.setState({
                                notes,
                                data4: {},
                                errors4: {}
                            })
                            alertify.success('Guardado correctamente')
                        } catch (error) {
                            alertify.error('Error al guardar')
                            const errors4 = error.response.data
                            this.setState({ errors4 })
                        }
                    }
                }
            },
            fields:[{
                name:'note',
                label:'Nota',
                type:'textarea',
                helpText:''
            }],
            data: this.state.data4,
            errors: this.state.errors4
        }

        var form5 = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            let formData = new FormData()
                            Object.keys(values).forEach((key) => {
                                formData.append(key, values[key])
                            })
                            let resp = await addMedicalHistory(id, formData)
                            const obj = resp.data
                            let medical_history = this.state.medical_history
                            medical_history.push(obj)
                            this.setState({
                                medical_history,
                                data5: {},
                                errors5: {}
                            })
                            alertify.success('Guardado correctamente')
                        } catch (error) {
                            alertify.error('Error al guardar')
                            const errors5 = error.response.data
                            this.setState({ errors5 })
                        }
                    }
                }
            },
            fields:[{
                    name:'image',
                    label:'Imagen',
                    type:'file',
                    helpText:'',
                    className:'archivo',
                    width:'is-12'
                },{
                name:'description',
                label:'Descripción',
                type:'textarea',
                helpText:'',
                width:'is-12'
            }],
            data: this.state.data5,
            errors: this.state.errors5
        }

        return (
            <Layout title={ title } selectedMenu="patients" breadcrumb={breadcrumb}>
                <div className="card">
                    <div className="card-content">
                        <h4 className="subtitle is-4">{ title } <b>{ this.state.data.first_name } { this.state.data.last_name }</b></h4>
                        <div className={id?'tabs is-small':'tabs is-small hide'}>
                            <ul id="tabs">
                                <li className={this.state.selected_tab == 1?'is-active':''} onClick={(e) => this.clickInTab(1)}><a>General</a></li>
                                <li className={this.state.selected_tab == 2?'is-active':''}onClick={(e) => this.clickInTab(2)}><a>Dirección</a></li>
                                <li className={this.state.selected_tab == 3?'is-active':''} onClick={(e) => this.clickInTab(3)}><a>Información personal</a></li>
                                <li className={this.state.selected_tab == 4?'is-active':''} onClick={(e) => this.clickInTab(4)}><a>Notas</a></li>
                                <li className={this.state.selected_tab == 5?'is-active':''} onClick={(e) => this.clickInTab(5)}><a>Historial clínico</a></li>
                                <li className={this.state.selected_tab == 6?'is-active':''} onClick={(e) => this.clickInTab(6)}><a>Citas</a></li>
                                <li className={this.state.selected_tab == 7?'is-active':''} onClick={(e) => this.clickInTab(7)}><a>Paquetes</a></li>
                            </ul>
                        </div>
                        <div className={this.state.selected_tab == 1?'':'hide'} id="tab_general">
                            <Form
                                buttonLabel={ form.button.label }
                                onSubmit={ form.button.onSubmit }
                                fields={ form.fields }
                                data={ form.data }
                                errors={ form.errors }
                            />
                        </div>
                        <div className={this.state.selected_tab == 2?'':'hide'} id="tab_address">
                            <Form
                                buttonLabel={ form2.button.label }
                                onSubmit={ form2.button.onSubmit }
                                fields={ form2.fields }
                                data={ form2.data }
                                errors={ form2.errors }
                            />
                        </div>
                        <div className={this.state.selected_tab == 3?'':'hide'} id="tab_personal_info">
                            <Form
                                buttonLabel={ form3.button.label }
                                onSubmit={ form3.button.onSubmit }
                                fields={ form3.fields }
                                data={ form3.data }
                                errors={ form3.errors }
                            />
                        </div>
                        <div className={this.state.selected_tab == 4?'':'hide'} id="tab_notes">
                            { this.state.notes.length > 0 ?
                                this.state.notes.map((note, index) => (
                                    <div className="div-wrapper" key={ note.id }>
                                        <div><b>{ friendlyDateformat(note.created_at) }</b></div>
                                        <div>{ note.note }</div>
                                        <button className="button is-small is-danger" onClick={(e) => this.deleteNote(index, note.id)}>
                                            Eliminar
                                        </button>
                                    </div>
                                ))
                            :
                                <div className="div-wrapper">
                                    <p>No hay notas</p>
                                </div>
                            }
                            <Form
                                buttonLabel={ form4.button.label }
                                onSubmit={ form4.button.onSubmit }
                                fields={ form4.fields }
                                data={ form4.data }
                                errors={ form4.errors }
                            />
                        </div>
                        <div className={this.state.selected_tab == 5?'':'hide'} id="tab_medical_history">
                            { this.state.medical_history.length > 0 ?
                                this.state.medical_history.map((obj, index) => (
                                    <div className="div-wrapper" key={ obj.id }>
                                        <div>{ obj.description }</div>
                                        <img src={ obj.image } alt=""/>
                                        <button className="button is-small is-danger" onClick={(e) => this.deleteMedicalHistory(index, obj.id)}>
                                            Eliminar
                                        </button>
                                    </div>
                                ))
                            :
                                <div className="div-wrapper">
                                    <p>No hay historial clínico</p>
                                </div>
                            }
                            <Form
                                buttonLabel={ form5.button.label }
                                onSubmit={ form5.button.onSubmit }
                                fields={ form5.fields }
                                data={ form5.data }
                                errors={ form5.errors }
                            />
                        </div> 
                        <div className={this.state.selected_tab == 6?'':'hide'} id="tab_appointments">
                        { this.state.citas.length > 0 ?
                            <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                <thead>
                                    <tr>
                                        <th>Sucursal</th>
                                        <th>Fecha</th>
                                        <th>Hora inicio</th>
                                        <th>Hora fin</th>
                                        <th>Estatus</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                { this.state.citas.map((obj, index) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.branch_office}</td>
                                        <td>{ friendlyDateformat(obj.date) }</td>
                                        <td>{ (obj.start_time).substring(0,5) }</td>
                                        <td>{ (obj.end_time).substring(0,5) }</td>
                                        <td>{ obj.status == 'effected' ? 'Efectuada':'Pendiente' }</td>
                                        <td>
                                            <p className="buttons is-centered">
                                                <Link route="edit_appointment" params={{ id: obj.id }}>
                                                    <a className="button is-small is-primary is-outlined tooltip" data-tooltip="Editar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-pen"></i>
                                                        </span>
                                                        <span>Editar</span>
                                                    </a>
                                                </Link>
                                            </p>
                                        </td>
                                    </tr>
                                )) }
                                </tbody>
                            </table>
                            :
                            <div className="div-wrapper">
                                <p>No hay citas asignadas a este paciente</p>
                            </div>
                        }
                            <Link route="add_appointment">
                                <button className="button is-info">Agregar cita</button>
                            </Link>
                        </div>

                        <div className={this.state.selected_tab == 7?'':'hide'} id="tab_packages">
                        { this.state.paquetesPaciente.length > 0 ?
                            <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                <thead>
                                    <tr>
                                        <th>Sucursal</th>
                                        <th>Paquete</th>
                                        <th>Parcialidades</th>
                                        <th>Precio </th>
                                        <th>Estatus</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                { this.state.paquetesPaciente.map((obj, index) => (
                                    <tr key={obj.id}>
                                        <td>{ obj.branch_office }</td>
                                        <td>{ obj.name }</td>
                                        <td>{ obj.partialities }</td>
                                        <td>{ obj.real_price }</td>
                                        <td>{ obj.status }</td>
                                        <td>
                                            <p className="buttons is-centered">
                                                <Link route="package_detail" params={{ patient_package_id: obj.id|| 0 }}>
                                                    <a className="button is-small is-primary is-outlined tooltip" data-tooltip="Editar">
                                                        <span className="icon is-small">
                                                            <i className="fas fa-eye"></i>
                                                        </span>
                                                        <span>Ver</span>
                                                    </a>
                                                </Link>
                                            </p>
                                        </td>
                                    </tr>
                                )) }
                                </tbody>
                            </table>
                            :
                                <div className="div-wrapper">
                                    <p>No hay paquetes asignados a este paciente</p>
                                </div>
                            }
                            <Link route="patient_package"  params={{id:id || 0}}>
                                <button className="button is-info">Asignar paquete</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .div-wrapper{
                        border: 1px solid #cacaca;
                        padding: 0.5rem;
                        margin-bottom: 0.5rem;
                    }
                `}
                </style>
            </Layout>
        )
    }
}