import Layout from "../../../components/layouts/Layout"
import Router from "next/router"
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'

import Form from "../../../components/form/Form";
import Error from '../../../components/layouts/Error'
import { djangoDateFormat, timeFormat } from '../../../filters/filters'
import { addAppointment, getAppointment, updateAppointment } from "../../../services/appointments"
import { getPatients } from "../../../services/patients"
import { getAssociates, getAppointmentsAssociate } from "../../../services/associates"
import { getServices } from "../../../services/services"


export default class extends React.Component {

    static async getInitialProps({ query }) {
        let id = query.id;
        let session_id = query.session_id;
        let patient_id = query.id;
        let title = "";
        id ? (title = "Editar cita") : (title = "Agregar cita");
        return { id, title, session_id, patient_id };
    }

    state = {
        nuevo: true,
        index:0,
        service_index: 2,
        selected_service: 2,
        selected_service_str:"",
        selected_associate: 2,
        selected_associate_str:"",
        selected_patient: 2,
        services: [],
        patients: [],
        servicios_duracion: [],
        duration:0,
        branch_office: [],
        associates: [],
        single_start_time:'10:00',
        single_end_time:'12:00',
        time_options: {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            minDate: "9:00",
            maxDate: "20:00"
        },
        data: {
            branch_office:null,
            patient: null,
            services: [],
            status: "pending",
            cost: 0,
            date:djangoDateFormat(new Date()),
            start_time: "10:00",
            end_time: "12:00",
            appointments_associates: []
        },
        errors: {},
        horarios_ocupados:[],
        error_horario:null
    };

    async componentDidMount() {

        let data = this.state.data
        data.branch_office = localStorage.getItem('sucursal')

        // TRAE SERVICIOS
        try {
            const req = await getServices()
            const data = req.data.results
            let servicios_duracion = []

            data.forEach(element => {
                let servicio = {
                    id: element.id,
                    duration: element.duration
                }
                servicios_duracion.push(servicio)
            })
            let services = data.map(obj => {
                return { label: obj.name, value: obj.id };
            })
            services.unshift({
                label: "Seleccionar...", value: ""
            });
            this.setState({ services, servicios_duracion });
        } catch (error) {
            console.log(error);
        }

        // TRAE PACIENTES
        try {
            const req = await getPatients();
            const data = req.data.results

            let patients = data.map(obj => {
                return { label: obj.first_name + " " + obj.last_name, value: obj.id };
            });
            patients.unshift({
                label: "Seleccionar...", value: ""
            });

            this.setState({ patients });
        } catch (error) {
            console.log(error);
        }

        // TRAE CITA
        if (this.props.id) {

            try {
                const resp = await getAppointment(this.props.id)
                let data = {
                    branch_office: localStorage.getItem('sucursal'),
                    patient: resp.data.patient_id,
                    start_time: resp.data.start_time,
                    end_time: resp.data.end_time,
                    date: resp.data.date,
                    appointments_associates: resp.data.services
                }
                let nuevo = false
                this.setState({ data, nuevo });

            } catch (error) {
                console.log(error);
            }
        }
    }

    async actualizaFecha () {
        let data = this.state.data
        data.appointments_associates.forEach(element => {
            element.date = data.date
        })
    }

    addAppointment = () => {
        let data = this.state.data
        let appointments_associates = data.appointments_associate

        const appointment_associate = {
			service: this.state.selected_service.value,
			service_str: this.state.selected_service_str,
            associate: this.state.selected_associate.value,
            associate_str: this.state.selected_associate_str,
            date: djangoDateFormat(this.state.data.date),
            start_time: this.state.single_start_time,
            end_time: this.state.single_end_time
        }
        data.appointments_associates.push(appointment_associate)
        this.setState({ data }, () => console.log(this.state))
    }

    deleteAppointMentAssociate = ( index ) => {
        let data = this.state.data
        let appointments_associates = data.appointments_associates
        data.appointments_associates.splice(index, 1)
        this.setState({ data }, () => console.log(this.state))
    }

    selectService = async(selected_service) => {
        const service = selected_service.value
        const selected_associate = null
        let duration = this.state.servicios_duracion.find(o => o.id === service).duration/60
        let service_index = this.state.services.findIndex(o => o.value === service)
        let selected_service_str = this.state.services[service_index].label
        let associates = []
        try {
            const params = { branch_ofice: 1, services: service }
            const resp = await getAssociates(params)
            associates = resp.data.results.map((associate) => {
                return { value: associate.id, label: associate.first_name + ' ' + associate.last_name }
            })
        } catch (error) {
            console.log(error)
        }
        this.setState({ associates, selected_associate, selected_service, selected_service_str, duration })
    }

    async getAvailableDaysByAsociate (associate) {
        const resp = await getAppointmentsAssociate(associate);
        let horarios_ocupados = []
        resp.data.results.forEach(element => {
            if (element.date == this.state.data.date){
                let horario = {
                    hora_inicio:element.start_time,
                    hora_fin:element.end_time
                }
                horarios_ocupados.push(horario)
            }
        })
        this.setState({ horarios_ocupados })
    }

    selectAssociate = (selected_associate) => {
        const associate = selected_associate.value
        let associate_index = this.state.associates.findIndex(o => o.value === associate)
        let selected_associate_str = this.state.associates[associate_index].label

        this.getAvailableDaysByAsociate(associate)
        this.setState({ selected_associate, selected_associate_str })
    }

    selectStartTime = (start_time) => {
        let single_start_time = timeFormat(start_time[0])
        var fecha_fin = new Date('2019-01-01 ' + single_start_time)
        fecha_fin.setHours(fecha_fin.getHours() + (this.state.duration));
        let single_end_time = timeFormat(fecha_fin)
        this.setState({ single_start_time, single_end_time})
    }

    selectEndTime = (end_time) => {
        let single_end_time = timeFormat(end_time[0])
        this.setState({ single_end_time })
    }

    render() {
        const { id, title } = this.props;
        let { associates,  selected_associate,  selected_service, services } = this.state

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Citas", url: "appointments", active: false },
            { name: title, url: "", active: true }
        ];

        var form = {
            button: {
                label: "Guardar",
                onSubmit: async (event, values) => {
                if (!this.state.nuevo) {
                    try {
                        this.actualizaFecha()
                        await updateAppointment(id, values);
                        alertify.success('Cita guardada correctamente')
                        Router.pushRoute("appointments");
                    } catch (error) {
                        alertify.error('Error al guardar')
                        const errors = error.response.data

                        this.setState({ errors })
                    }
                    } else {
                        try {
                            this.actualizaFecha()
                            await addAppointment(values);
                            alertify.success('Cita agregada correctamente')
                            Router.pushRoute("appointments");
                        } catch (error) {
                            alertify.error('Error al agregar cita')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    }
                }
            },
            fields: [
                {
                    name: "patient",
                    label: "Paciente",
                    type: "select",
                    helpText: "",
                    id:'pacientes',
                    width:'is-5',
                    options: this.state.patients
                },{
                    name: "date",
                    label: "Fecha de cita",
                    type: "datepicker",
                    helpText: "",
                    width:'is-4',
                },{
                    name: "start_time",
                    label: "Inicio",
                    type: "timepicker",
                    helpText: "",
                    width:'is-1',
                    options: this.state.time_options
                },{
                    name: "end_time",
                    label: "Fin",
                    type: "timepicker",
                    helpText: "",
                    width:'is-1',
                    options: this.state.time_options
                }
            ],
            data: this.state.data,
            errors: this.state.errors
        };

      return (
        <Layout title={title} selectedMenu="appointments" breadcrumb={breadcrumb}>
            <div className="card">
                <div className="card-content">
                    <h4 className="subtitle is-4">{title}</h4>
                    <Form
                        buttonLabel={form.button.label}
                        onSubmit={form.button.onSubmit}
                        fields={form.fields}
                        data={form.data}
                        errors={form.errors}
                    >

                    <hr/>
                    { this.state.horarios_ocupados.length > 0 ?
                    <div className="contenedor-horarios">
                        <h4 className="subtitle is-12"> Horarios ocupados</h4>
                        <article className="columns contenedor is-multiline message is-dark">
                        { this.state.horarios_ocupados.map((obj, index) => (
                            <div key={ index } className="column is-2 contenido message-body">
                            { obj.hora_inicio.substring(0, 5) } - { obj.hora_fin.substring(0, 5) }
                            </div>
                        )) }
                        </article>
                    </div>
                    : <div></div>
                    }

                    <div className="columns">
                        <div className="column is-4">
                            <label className="label-select">Servicio</label>
                            <Select
                                instanceId
                                value={ selected_service }
                                onChange={ this.selectService }
                                options={ services }
                            />
                        </div>

                        <div className="column is-4">
                            <label className="label-select">Asociado</label>
                            <Select
                                instanceId
                                value={ selected_associate }
                                onChange={ this.selectAssociate }
                                options={ associates }
                            />
                        </div>

                        <div className="column is-1">
                            <label className="label-select">Inicio</label>
                            <Flatpickr data-enable-time
                                value={ this.state.single_start_time }
                                onChange={ this.selectStartTime }
                                options={this.state.time_options}
                                />
                        </div>

                        <div className="column is-1">
                                <label className="label-select">Fin</label>
                                <Flatpickr data-enable-time
                                    value={ this.state.single_end_time }
                                    onChange={ this.selectEndTime }
                                    options={this.state.time_options}
                                />
                        </div>

                        <div className="column is-1">
                                <label className="label-select">&nbsp;</label>
                                <button  className="button is-primary" onClick={ this.addAppointment }>Agregar</button>
                        </div>
                    </div>

                    { this.state.data.appointments_associates.length > 0 ?
                    <div>
                        <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                            <thead>
                                <tr>
                                    <th>Servicio</th>
                                    <th>Asociado</th>
                                    <th>Hora inicio</th>
                                    <th>Hora fin</th>
                                    <th>Status</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            { this.state.data.appointments_associates.map((obj, index) => (
                                <tr key={ index }>
                                    <td>{ obj.service_str }</td>
                                    <td>{ obj.associate_str }</td>
                                    <td>{ (obj.start_time).substring(0,5) }</td>
                                    <td>{ (obj.end_time).substring(0,5) }</td>
                                    <td>{ obj.status === 'effected' ? 'efectuada' : obj.status == 'pending' ? 'pendiente': 'sin definir' }</td>
                                    <td>
                                        <p className="buttons is-centered">
                                            <a onClick={ (e) => this.deleteAppointMentAssociate(index)} className="button is-small is-danger tooltip" data-tooltip="Borrar">
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
                    </div>
                    : <div></div>
                    }
                </Form>
                {this.state.error_horario != null ?
                    <Error
                        titulo="error"
                        mensaje = {this.state.error_horario}
                    /> :<span></span>
                }
              <style jsx>{`
                .table{
                    margin-top:1rem;
                }
                .contenedor-horarios{
                    background:white;
                    margin-bottom:1rem;
                }
                .contenedor {
                    background:white;
                }
                .contenido{
                    margin-right: 1rem;
                    margin-bottom:1rem;
                    background: #eaeaea;
                    text-align: center;
                    font-weight: 600;
                }
                .subtitle{
                    text-align: center;
                    font-size: 22px;
                    font-weight: 600;
                }
              `}
              </style>
            </div>
          </div>
        </Layout>
      );
    }
}