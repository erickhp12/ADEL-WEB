import Layout from '../../../components/layouts/Layout'
import { Link } from '../../../routes'
import { getPackage, getPackageEdition } from '../../../services/packages'

import { dateFormat, timeFormat } from '../../../filters/filters'

export default class extends React.Component{
    static async getInitialProps ({ query }) {
        let id = query.id
        return { id }
    }

    state = {
        object: {},
        objects: []
    }

    async componentDidMount() {
        try {
            let req = await getPackageEdition(this.props.id)
            const objects = req.data.reverse()
            req = await getPackage(this.props.id)
            const object = req.data
            this.setState({ objects, object })
        } catch (error) {
            console.log(error)
        }   
    }



    render(){
        const breadcrumb = [
            { name: "ADEL", url: "admin", active: false },
            { name: "Paquetes", url: "packages", active: false },
            { name: "Ediciones", url: "", active: true }
        ]
        return (
            <Layout title="Ediciones" selectedMenu="packages" breadcrumb={ breadcrumb }>
                <div className="card">
                    <div className="card-content">
                    { this.state.objects.length > 0 ?
                        <div className="timeline">
                            <header className="timeline-header">
                                <span className="tag is-medium is-primary">Actual</span>
                            </header>
                            { this.state.objects.map((obj) => (
                                <div className="timeline-item" key={obj.id}>
                                    <div className="timeline-marker is-icon">
                                        <i className="fas fa-pencil-alt"></i>
                                    </div>
                                    <div className="timeline-content">
                                        <p className="heading">Edición realizada el <b>{ dateFormat(obj.date) }</b> a las <b>{ timeFormat(obj.date) }</b> por <b>{ obj.user }</b>
                                         </p>
                                        <p>{ obj.description}</p>
                                        <table className="table is-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Campo</th>
                                                    <th>Antes</th>
                                                    <th>Despues</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { obj.changes.map((change, index) => (
                                                    <tr key={ index }>
                                                        <td><code>{ change.change }</code></td>
                                                        <td><code>{ change.value_before }</code></td>
                                                        <td><code>{ change.value_after }</code></td>
                                                    </tr>
                                                )) }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )) }
                            <div className="timeline-header">
                                <span className="tag is-medium is-primary">Inicio</span>
                            </div>
                        </div>
                        :
                        <div className="div-wrapper">No hay ediciones para este paquete</div>
                        }
                    </div>
                </div>
                <style jsx>{`
                .div-wrapper{
                    text-align:center;
                    font-size:20px;
                    font-weight:600;
                }
                `}
                </style>
            </Layout>
        )
    }
}
