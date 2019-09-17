import Layout from '../../components/layouts/Layout'
import { getBranchOffices } from '../../services/branch_offices'
import { getProfile, getUserPermissions } from '../../services/users'
import { Link } from '../../routes'
import Router from 'next/router'
import { hasPermission } from '../../components/permission';

export default class extends React.Component {

    state = {
        branch_offices:[]
    }

    async componentDidMount() {
        // TRAE SUCURSALES
        try {
            const req = await getBranchOffices()
            const branch_offices = req.data.results
            this.setState({ branch_offices })
            if ( localStorage.getItem('permisos') == null)
                this.cargaPermisos()
        } catch (error) {
            console.log(error);
        }
    }

    async cargaPermisos (){
        const perfil = await getProfile()
        const resp = await getUserPermissions(perfil.data.id)
        let permisos = resp.data.user_permissions
        let arrayPermisos = []
        permisos.forEach(permiso => {
            let jsonPermiso = {
                id:permiso
            }
            arrayPermisos.push(jsonPermiso)
            localStorage.setItem('permisos',JSON.stringify(arrayPermisos))
        })

        this.setState({ permisos })
    }

    setBranchOffice = (id) => {
        localStorage.setItem('sucursal',id)
        alertify.success('Sucursal asignada correctamente')
        Router.pushRoute('appointments')
    }
    
    render(){

        return (
            <Layout title="ADEL">
                <div className="columns">
                    <div className="column card title is-offset-2 is-8">
                        <p> Elegir sucursal </p>
                    </div>
                </div>
                    { this.state.branch_offices.length > 0 ?
                    <div className="columns is-multiline">
                       { this.state.branch_offices.map((obj) => (
                           <div onClick={ (e) => this.setBranchOffice(obj.id)} className='column card is-offset-4 subtitle is-4' key={ obj.id }>
                            <p className="buttons is-centered">
                                <a  className="button is-medium is-dark is-outlined tooltip" data-tooltip="Elegir">
                                    <span className="icon is-small">
                                        <i className="fas fa-building"></i>
                                    </span>
                                    <span> { obj.name }</span>
                                </a>
                            </p>
                        </div>
                       ))}
                    </div>
                    :
                    <div className="columns">
                        { hasPermission(16) ?
                        <Link route="add_branch_office">
                            <div className='column card is-offset-4 subtitle is-4'>
                                <p className="buttons is-centered">
                                    <a  className="button is-medium is-dark is-outlined tooltip" data-tooltip="Elegir">
                                        <span className="icon is-small">
                                            <i className="fas fa-building"></i>
                                        </span>
                                        <span> Crear sucursal </span>
                                    </a>
                                </p>
                            </div>
                        </Link>
                        :<a></a> }
                    </div>
                    }

                <style jsx>{`
                    .title {
                        margin-bottom: 0.5rem;
                        text-align: center;
                        font-size: 25px;
                    }
                    .subtitle {
                        text-align: center;
                        font-size: 18px;
                        font-weight: 600;
                        height:4.5rem;
                    }
                `}
                </style>
            </Layout>
        )
    }
}
