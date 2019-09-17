import Layout from "../../../components/layouts/Layout"
import Router from "next/router"
import Select from 'react-select'
import Form from "../../../components/form/Form"
import Flatpickr from 'react-flatpickr'
import Error from '../../../components/layouts/Error'

import { djangoDateFormat, timeFormat,  } from '../../../filters/filters'
import { addAppointment } from "../../../services/appointments"
import { getAssociates, getAppointmentsAssociate } from "../../../services/associates"
import { getSessionServices } from "../../../services/packages"



export default class extends React.Component {

    static async getInitialProps({ query }) {
        let id = query.id;
        let session_id = query.session_id;
        let patient_package_id = query.patient_package_id;
        let patient_id = query.patient_id;
        let title = "";
        id ? (title = "Asignar cita") : (title = "Asignar cita");
        return { id, title, session_id, patient_id, patient_package_id};
    }

    state = {
        services: [],
        patients: [],
        branch_office: [],
        associates: [],
        associates: [],
        selected_associate:null,
        selected_date:null,
        selected_start_time:null,
        selected_end_time:null,
        servicios_duracion: [],
        duration:0,
        start_time: "12:00",
        end_time: "12:00",
        data: {
            branch_office:null,
            patient: null,
            date: new Date(),
            start_time: "12:00",
            end_time: "12:00",
            services: [],
            status: "pending",
            cost: 0,
            appointments_associates: []
        },
        date_options: {
            defaultDate:new Date()
        },
        time_options: {
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            minDate: "9:00",
            maxDate: "20:00"
        },
        index:0,
        errors: {},
        horarios_ocupados:[],
        error_horario:null
    };

    async componentDidMount() {
        let data = this.state.data
        data.branch_office = localStorage.getItem('sucursal')

        // TRAE ASOCIADOS
        try {
            const req = await getAssociates();
            const data = req.data.results

            let associates = data.map(obj => {
                return { label: obj.first_name +" "+ obj.last_name, value: obj.id };
            });

            associates.unshift({
                label: "Seleccionar...", value: ""
            });
            this.setState({ associates });
        } catch (error) {
            console.log(error);
        }

        if (this.props.session_id){
            let data = {
                branch_office: localStorage.getItem('sucursal'),
                patient: this.props.patient_id,
                package_session: this.props.session_id,
                start_time: "12:00",
                end_time: "12:00",
                services: [],
                date: djangoDateFormat(new Date()),
                status: "pending",
                cost: 0,
                appointments_associates: [],
                services:[]
            }
            const resp = await getSessionServices(this.props.session_id)

            let services = []
            let id = 0

            resp.data[0].services.forEach(service => {
                let appointments_associates = {}
                appointments_associates.id = id
                appointments_associates.service = service.id
                appointments_associates.service_str = service.name
                appointments_associates.associate = 1
                appointments_associates.date = djangoDateFormat(new Date())
                appointments_associates.start_time = this.state.start_time
                appointments_associates.end_time = this.state.end_time
                appointments_associates.status = 'pending'
                id+=1
                services.push(appointments_associates)
            });
            data.appointments_associates = services

            this.setState({ data })
        }
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

    selectIndex = (index) => {
        this.setState({ index })
    }

    selectAssociate = (selected_associate) => {
        let data = this.state.data
        data.appointments_associates[this.state.index].associate = selected_associate.value
        data.appointments_associates[this.state.index].date = data.date
        this.getAvailableDaysByAsociate(selected_associate.value)
        this.setState({ data, selected_associate })
    }

    selectStartTime = (selected_start_time) => {
        let data = this.state.data
        data.appointments_associates[this.state.index].start_time = timeFormat(selected_start_time[0])
        data.appointments_associates[this.state.index].date = data.date
        this.setState({ data, selected_start_time })
    }

    selectEndTime = (selected_end_time) => {
        let data = this.state.data
        data.appointments_associates[this.state.index].end_time = timeFormat(selected_end_time[0])
        data.appointments_associates[this.state.index].date = data.date
        this.setState({ data, selected_end_time })
    }

    render() {
        const { id, title } = this.props
        const { associates, time_options } = this.state

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Citas", url: "appointments", active: false },
            { name: title, url: "", active: true }
        ];

        var form = {
            button: {
            label: "Guardar",
            onSubmit: async (event, values) => {
                try {
                    await addAppointment(values);
                    alertify.success('Cita agregada correctamente')
                    Router.pushRoute('/admin/paquete/paciente/detalle/' + this.props.patient_package_id +'/');
                } catch (error) {
                    alertify.error('Horario no disponible para este asociado')
                    const errors = error.response.data
                    this.setState({ errors })
              }
          }
        },
        fields: [
            {
                name: "date",
                label: "Fecha de cita",
                type: "datepicker",
                helpText: "",
                width:'is-4'
            },{
                name: "start_time",
                label: "Hora de inicio",
                type: "timepicker",
                helpText: "",
                width:'is-2',
                options: this.state.time_options
            },{
                name: "end_time",
                label: "Hora de final",
                type: "timepicker",
                helpText: "",
                width:'is-2',
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
                </Form>
                <hr></hr>
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
                
                    <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                        <tbody>
                            <tr className="columns">
                                <th className="column is-3">Servicio</th>
                                <th className="column is-5">Asociado</th>
                                <th className="column is-2">Hora</th>
                                <th className="column is-2">Fin</th>
                            </tr>
                            { this.state.data.appointments_associates.map((obj, index) => (
                                <tr className="columns" key={obj.id}>
                                    <td className="column is-3" >{ obj.service_str }</td>
                                    <td  className="column is-5" onClick={(e) => this.selectIndex(index)}>
                                        <Select
                                            instanceId
                                            onChange={ this.selectAssociate }
                                            options={ associates }
                                        />
                                    </td>
                                    <td className="column is-2"  onClick={(e) => this.selectIndex(index)}>
                                        <Flatpickr onChange={ this.selectStartTime } options={ time_options } />
                                    </td>
                                    <td className="column is-2"  onClick={(e) => this.selectIndex(index)} >
                                        <Flatpickr onChange={ this.selectEndTime } options={ time_options }/>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                    {this.state.error_horario != null ?
                        <Error
                        titulo="error"
                        mensaje = {this.state.error_horario}
                        />:<span></span>
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
                    margin-bottom:1rem;
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