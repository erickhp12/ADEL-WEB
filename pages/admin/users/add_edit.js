import Layout from '../../../components/layouts/Layout'
import Router from 'next/router'
import Form from '../../../components/form/Form'
import { addUser, getUser, getUserPermissions, getPermissions, addPermission, deletePermission, updateUser } from '../../../services/users'


export default class extends React.Component {
    static async getInitialProps ({ query }) {
        let id = query.id
        let title = ''
        id ? title='Editar usuario > ' : title='Agregar usuario'
        return { id, title }
    }

    state = {
        generalInformation: {
            is_active:true,
        },
        permissions:[],
        userPermissions:[],
        permisosDisponibles:[],
        errors: {},
        errors2: {},
        errors3: {},
        errors4: {},
        errors5: {},
        selected_tab: 1
    }

    async componentDidMount() {

        if (this.props.id){
            try {
                const resp = await getUser(this.props.id)
                const respPermisos = await getPermissions()
                const respUsuarioPermisos = await getUserPermissions(this.props.id)
                var userPermissions = respUsuarioPermisos.data.user_permissions
                let permissions = respPermisos.data
                let permisosDisponibles = []

                let generalInformation = {
                    id: this.props.id,
                    first_name: resp.data.first_name,
                    last_name: resp.data.last_name,
                    email: resp.data.email,
                    phone_number: resp.data.phone_number,
                    is_active: resp.data.is_active
                }

                permissions.sort((a, b) =>{
                    if(a.name < b.name) { return -1 }
                    if(a.name > b.name) { return 1 }
                    return 0
                })

                permissions.forEach(permission => {
                    let permiso = {
                        id: permission.id,
                        name: permission.name,
                        permission_type: permission.permission_type,
                        active:false
                    }
                    permisosDisponibles.push(permiso)
                })

                permisosDisponibles.forEach(permiso => {  
                    let perm = userPermissions.find(o => o == permiso.id)
                    if (perm == permiso.id)
                        permiso.active = true
                })

                this.setState({
                    generalInformation, permissions, userPermissions, permisosDisponibles
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    clickInTab(selected_tab){
        this.setState({ selected_tab })
    }

    filtraTabla () {
        var value = document.getElementById('myInput').value
        let permisos = this.state.permisosDisponibles
        console.log('VALOR ' + value)
        let permiso = permisos.find(o => o.name == 'Cita')
        console.log(permisos)
        let permisosDisponibles = []
        if (permiso != null){
            console.log('HOLA')
            permisosDisponibles.push(permiso)
        }
        console.log(permisosDisponibles)
        this.setState({ permisosDisponibles })
    }

    asignaNombre(tipo){
        let texto = null
        texto = tipo.search('add')
        if (texto != -1){
            return 'Agregar'
        }
        texto = tipo.search('change')
        if (texto != -1){
            return 'Editar'
        }
        texto = tipo.search('delete')
        if (texto != -1){
            return 'Eliminar'
        }
    }

    async agregaPermiso(obj) {
        let userPermissions = this.state.userPermissions
        userPermissions.push(obj.id)
        obj.active = true
        let jsonPermisos = { 'user_permissions': userPermissions}
        await addPermission(this.props.id, jsonPermisos)
        this.setState({ userPermissions})
        return obj
    }

    async eliminaPermiso(obj) {
        let userPermissions = this.state.userPermissions
        let index = userPermissions.findIndex(o => o == obj.id)
        userPermissions.splice(index,1)
        obj.active = false
        let jsonPermisos = { 'user_permissions': userPermissions}
        await addPermission(this.props.id, jsonPermisos)
        this.setState({ userPermissions})
        return obj
    }

    render(){
        const { id, title } = this.props

        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Usuarios", url: "users", active: false },
            { name: title, url: "", active: true }
        ]

        var form = {
            button:{
                label:'Guardar',
                onSubmit: async (event, values) => {
                    if (id){
                        try {
                            await updateUser(id, values)
                            alertify.success('Usuario guardado correctamente')
                            Router.pushRoute('users')
                        } catch (error) {
                            alertify.error('Error al guardar usuario')
                            const errors = error.response.data
                            this.setState({ errors })
                        }
                    } else {
                        try {
                            const resp = await addUser(values)
                            const user_id = resp.data.id
                            alertify.success('Usuario agregado correctamente')
                            Router.pushRoute('edit_user', {id: user_id})
                        } catch (error) {
                            alertify.error('Error al agregar usuario')
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
                width:'is-6'
            },{
                name:'last_name',
                label:'Apellido(s)',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'email',
                label:'Correo electrónico *',
                type:'text',
                helpText:'',
                width:'is-6'
            },{
                name:'password',
                label:'Contrasena',
                type:'password',
                helpText:'',
                width:'is-6'
            },{
                name:'phone_number',
                label:'Número de teléfono',
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
            data: this.state.generalInformation,
            errors: this.state.errors
        }

        return (
            <Layout title={ title } selectedMenu="users" breadcrumb={breadcrumb}>
                <div className="card form-card-70">
                    <div className="card-content">
                        <h4 className="subtitle is-4">{ title } <b>{ this.state.generalInformation.first_name } { this.state.generalInformation.last_name }</b></h4>
                        <div className={id?'tabs is-small':'tabs is-small hide'}>
                            <ul id="tabs">
                                <li className={this.state.selected_tab == 1?'is-active':''} onClick={(e) => this.clickInTab(1)}><a>General</a></li>
                                <li className={this.state.selected_tab == 2?'is-active':''}onClick={(e) => this.clickInTab(2)}><a>Permisos</a></li>
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
                        <div className={this.state.selected_tab == 2 ?'':'hide'} id="tab_permissions" >
                            <div className="columns">
                                <div className="column is-12">
                                    {/* <input
                                        type="text"
                                        className="input"
                                        id="myInput"
                                        onKeyUp={e => this.filtraTabla()} 
                                        title="Type in a name">
                                    </input>
                                    <br/><br/> */}
                                    <table className="table is-fullwidth is-striped is-hoverable is-bordered">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Permiso</th>
                                                <th>Tipo</th>
                                                <th>Accion</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        { this.state.permisosDisponibles.map((obj) => (
                                            <tr key={obj.id}>
                                                <td>{ obj.id }</td>
                                                <td>{ obj.name }</td>
                                                <td>{ this.asignaNombre(obj.permission_type) }</td>
                                                <td>
                                                {obj.active ?
                                                    <button onClick={e => this.eliminaPermiso(obj)} className='button is-small is-success'>
                                                        <span> Activo</span>
                                                    </button>
                                                    :
                                                    <button onClick={e => this.agregaPermiso(obj)} className='button is-small is-info is-outlined'>
                                                        <span> Inactivo</span>
                                                    </button>
                                                }
                                                </td>
                                            </tr>
                                        )) }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}
