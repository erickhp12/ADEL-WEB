export default class extends React.Component{
    render () {
        return (
            <footer>
                <span>
                    ADEL © 2018. Todos los derechos reservados.
                </span>
                <style jsx>{`
                    footer {
                        position: absolute;
                        z-index: 1;
                        padding: 1%;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        display: block;
                        text-align: center!important;
                        font-size: .87rem!important;
                        line-height: 0!important;
                        color: #7c8695!important;
                    }
                `}</style>
            </footer>
        )
    }
}