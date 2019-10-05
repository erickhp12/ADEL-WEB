import { Link } from '../routes'

/**
 * Cobstruye el Breadcrumb con la ruta recibida
 * @param {array} items Propiedad que contiene el arreglo de objetos necesario para construir el breadcrumb. Ej: 
 *  [
 *      { name: "ADEL", url: "/", active: false },
 *      { name: "Productos", url: "tienda", active: false },
 *      { name: producto.name, url: "/", active: true }
 *  ]
 */
const Breadcrumb = ( { items = [{name: "", url:"/", active:false, title:""}]} ) => (
    <nav className="breadcrumb columns" aria-label="breadcrumbs">
        <div className="column is-4">
        <ul>
            {
                items.map((item, index) => {
                    return (
                        <li key={`crumb${index}`} className={item.active && 'is-active'}>
                            { item.url ?
                                <Link route={item.url}>
                                    <a>{item.name}</a>
                                </Link>
                            :
                                <a>{item.name}</a>
                            }
                        </li>
                    )
                })
            }
        </ul>
        </div>
        <div className="column is-4 menu-title">
            <h1>{items[0].title}&nbsp;&nbsp;
            {
                items[0].total > 0 ?
                <span className="tag is-info">{items[0].total}</span>:
                <span></span>
            }
            </h1>
        </div>
        <style jsx>{`
            .breadcrumb {
                font-size: 1rem;
                min-height: 20px;
                margin-top: 1%;
                margin-left: 1.5%;
                background:white;
                width:97.5%;
                border:1px solid #DDD;
                border-radius: 4px;
            }
            .breadcrumb:not(:last-child) {
                margin-bottom: 0;
            }
            .breadcrumb a {
                color: #333;
                font-weight:500;
                font-size:16px;
            }
            .breadcrumb li.is-active a {
                color: #2db2b2;
            }
            .breadcrumb li+li::before {
                color: #CCC;
                content: "<";
            }
            .menu-title h1, menu-title span{
                text-align:center;
                font-weight:800;
            }
        `}</style>
    </nav>
)
export default Breadcrumb