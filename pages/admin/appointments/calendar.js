import Head from 'next/head'
import Select from 'react-select'
import BigCalendar from "react-big-calendar"
import moment from 'moment'
import { getAssociates, getAppointmentsAssociate, updateAssociateAppointmentStatus } from '../../../services/associates'
import { getAppointments, updateAppointmentStatus } from '../../../services/appointments'
import ModalConfirmacion from '../../../components/ModalConfirmacion'
import { friendlyFullDateformat, timeFormat } from '../../../filters/filters'

import {Router} from '../../../routes'

moment.locale('es');

const localizer = BigCalendar.momentLocalizer(moment)

export default class extends React.Component {
  state = {
    modalVisible: false,
    objects: [],
    asociados:[],
    citas:[],
    citasAsociados:[],
    eventos:[],
    id:0,
    status:'',
    tipo:'cita',
    textoModal:'',
    tituloModal:'',
    textoConfirmacion:'',
    colorModal:'is-success'
  }

  componentDidMount = () =>{
    this.cargaDatos()
  }

  async cargaDatos () {
    let citasAsociados = []
    let citas = []
    
    //TRAE ASOCIADOS
    const respAsociados = await getAssociates()
    const data = respAsociados.data.results
    let asociados = data.map(obj => {
      return { label: obj.first_name + ' ' + obj.last_name, value: obj.id }
    })
    const req = await getAppointmentsAssociate(0)
    const resp = await getAppointments()
    const oCitasAsociados = req.data.results
    const oCitas = resp.data.results
    
    //ITERACION DE CITAS ASOCIADOS
    oCitasAsociados.forEach(object => {
        let citaAsociado = {
            id:object.id,
            tipo:'asociado',
            title:object.associate + ' - ' + object.appointment.substring(12),
            start: new Date( object.date + ' ' + object.start_time.substring(0,5)),
            end: new Date(object.date + ' ' + object.end_time.substring(0,5)),
            status: object.status
        }
        citasAsociados.push(citaAsociado)
    })

    //ITERACION DE CITAS
    oCitas.forEach(object => {
      let cita = {
          id:object.id,
          tipo:'cita',
          title:object.patient.first_name + ' ' + object.patient.last_name,
          start: new Date( object.date + ' ' + object.start_time.substring(0,5)),
          end: new Date(object.date + ' ' + object.end_time.substring(0,5)),
          status: object.status
      }
      citas.push(cita)
    })

    let eventos = citas
    this.setState({ eventos, citasAsociados, citas, asociados })
  }

  async actualizarStatus (id, status, tipo) {
    let nuevo_status = 'effected'
    status === 'effected' ? nuevo_status = 'canceled': 'effected'
    let jsonStatus = { status: nuevo_status}
    try {
        if( tipo == 'asociado'){
          await updateAssociateAppointmentStatus(id,jsonStatus)
        } else if (tipo == 'cita'){
          await updateAppointmentStatus(id,jsonStatus)
        }
        alertify.success('Cita efectuada')
        this.cargaDatos()
    } catch (error) {
        alertify.error('Cita cancelada')
        const error_mensaje = error
        this.setState({error_mensaje})
    }
  }

  async selectAssociate (selected_associate) {
    const req = await getAppointmentsAssociate(selected_associate.value)
    const objects = req.data.results
    let citasAsociados = []
    objects.forEach(object => {
        let citaAsociado = {
            title:object.associate + ' - ' + object.appointment.substring(12),
            start: new Date( object.date + ' ' + object.start_time.substring(0,5)),
            end: new Date(object.date + ' ' + object.end_time.substring(0,5)),
            status: object.status
        }
        citasAsociados.push(citaAsociado)
    })
    let eventos = citasAsociados
    this.setState({ eventos })
  }

  asignarColores = (event) => {
    var backgroundColor = '#209cee';
    if ( event.status == 'pending'){
      backgroundColor = '#209cee'
    } else if ( event.status == 'effected'){
      backgroundColor = '#4caf50'
    } else if ( event.status == 'canceled'){
      backgroundColor = 'red'
    }
    var style = {
        backgroundColor: backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
    }
    if (event.start < new Date() && event.status == 'pending'){

      var style = {
        backgroundColor: '#ffc',
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block'
      }
    }
    return {
        style: style
    }
  }

  muestraCitas = (tipo) => {
    let eventos = []
    if (tipo == '1'){
      eventos = this.state.citasAsociados
    } else {
      eventos = this.state.citas
    }
    this.setState({ eventos })
  }

  abrirModal = (event) => {
    let id = event.id
    let status = event.status
    let tipo = event.tipo
    let modalVisible = true
    let colorModal = ''
    let textoConfirmacion = ''
    let textoModal = 'Cita de ' + event.title
    let tituloModal = friendlyFullDateformat(event.start) + ' - ' + timeFormat(event.end)
    // if (event.status === 'effected'){
    //   colorModal = 'is-info'
    //   textoConfirmacion = 'Cancelar cita'
    // } else if (event.status === 'canceled' || event.status === 'pending'){
    colorModal = 'is-info'
    textoConfirmacion = 'Pagar cita'
    // }
    this.setState({ modalVisible, textoModal, colorModal, id, status, tipo, tituloModal, textoConfirmacion })
  }

  cerrarModal = () => {
    this.setState({ modalVisible: false });
  }

  actualizaStatus = () => {
    Router.pushRoute('cash')
    // this.actualizarStatus(this.state.id, this.state.status, this.state.tipo)
  }

  render() {
    const { asociados, modalVisible, textoModal, colorModal, tituloModal, textoConfirmacion } = this.state
    const breadcrumb = [
        { name: "ADEL", url: "admin", active: false },
        { name: "Citas", url: "appointments", active: false }
    ]

    return (
      // <Layout title="Calendario" selectedMenu="appointments" breadcrumb={ breadcrumb }>
        <div className="card">
          <div className="card-content">
            <div className="columns is-12 multiline">
              <div className="field has-addons column is-4">
                  <button onClick={ (e) => this.muestraCitas('1')} className="button is-info is-outlined is-radiusless">
                    <span>Ver por asociados</span>
                    </button>
                    <button onClick={ (e) => this.muestraCitas('2')} className="button is-info is-outlined is-radiusless">
                        <span>Ver por pacientes</span>
                    </button>
                </div>
              <div className="column seleccionar is-3">
                    <Select
                      instanceId
                      placeholder="filtrar por asociado"
                      onChange={ this.selectAssociate.bind(this)}
                      options={ asociados }
                    />
                </div>
            </div>
            <div className="calendarWrapper">
              <Head>
              <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Calendario</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css.map" />
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossOrigin="anonymous" />
                <link rel="stylesheet" href="/static/css/style.css" />
                <link rel="stylesheet" href="/static/css/bulma-timeline.min.css" />

                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/css/alertify.min.css"/>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/css/themes/default.min.css"/>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/css/themes/semantic.min.css"/>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/css/themes/bootstrap.min.css"/>
                <script src="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/alertify.min.js"></script>
                <link rel="stylesheet" href="/static/css/react-big-calendar.css" />
              </Head>
              <BigCalendar
                localizer={localizer}
                events={this.state.eventos}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={(this.asignarColores)}
                onSelectEvent={this.abrirModal}
              />
            </div>
            <div className="modal-wrapper">  
              <ModalConfirmacion
                activo={modalVisible}
                titulo={tituloModal}
                contenido={textoModal}
                botonOkTexto={textoConfirmacion}
                color={colorModal}
                botonOkClick={this.actualizaStatus}
                cerrarModal={this.cerrarModal}
                />
            </div>
          </div> 
        <style jsx>{`
            .calendarWrapper{
              height:85vh;
              margin-top: -1rem;
              margin-bottom: 2rem;
            }
            .seleccionar {
              z-index: 20;
            }
            .modal-wrapper{
              z-index: 100;
            }
          `}
        </style>
        </div>

        // </Layout>
        )
    }
}
