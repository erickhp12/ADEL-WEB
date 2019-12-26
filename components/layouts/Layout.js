import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'
import Breadcrumb from '../Breadcrumb'

export default class extends React.Component{
    state = { collapsed: false }

    collapse = (e) => {
        e.preventDefault()
    }

    render(){
        return <div className={this.state.collapsed && 'is-collapsed'}>
            <Head>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{this.props.title}</title>

                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.css.map" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css" integrity="" crossOrigin="anonymous" />
                <link rel="stylesheet" href="/static/css/bulma-timeline.min.css" />

                <link rel="stylesheet" href="/static/css/form.css" />
                <link rel="stylesheet" href="/static/css/style.css" />
                <link rel="stylesheet" href="/static/css/common.css" />
                <link rel="stylesheet" href="/static/css/colors.css" />

                <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>

                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/css/alertify.min.css"/>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/css/themes/default.min.css"/>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/css/themes/semantic.min.css"/>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/css/themes/bootstrap.min.css"/>
                <script src="//cdn.jsdelivr.net/npm/alertifyjs@1.11.2/build/alertify.min.js"></script>

                <link rel="stylesheet" type="text/css" href="https://npmcdn.com/flatpickr/dist/themes/airbnb.css"></link>
            </Head>
            <div id="main" className="page-container">
                <Header collapse={this.collapse} selectedMenu={this.props.selectedMenu} />
                <main className="main-content bgc-grey-100">
                    <Breadcrumb items={this.props.breadcrumb} title={this.props.title} />
                    { this.props.children }
                </main>
                {/* <Footer /> */}
            </div>

            <style jsx>{`
                .main-content{
                    background: #f3f3f3;
                    height:100vh;
                    position: absolute;
                    width: 100%;
                }
            `}</style>
        </div>
    }
}
