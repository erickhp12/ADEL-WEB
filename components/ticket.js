import React, { Component } from "react"

class Ticket extends Component {
    state = {
        activo: ""
    }

    abrirTicket = () => {
        this.setState({ activo: "is-active" })
    }

    cerrarTicket = () => {
        this.setState({ activo: "" })
        this.props.cerrarTicket()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activo) this.abrirTicket()
    }

    botonOkClick = () => {
        this.cerrarTicket()
        window.print()
    }

    render() {
        const {
            titulo = "",
            children = null,
            botonConfirmacion = "",
            botonCancelar = "",
            color = "is-dark",
            ticketVisible =""
        } = this.props

        return (
            <div className={`modal ${this.state.activo}`}>
                <div className="modal-background" onClick={this.cerrarTicket} />
                <div className="modal-content">
                    <article className={`message ${color} ${this.state.activo && 'activo'}`}>
                        <div className="message-header">
                            <p>{titulo}</p>
                        </div>
                        <div className="message-body has-text-centered">
                            { children }
                            <p className="buttons">
                                <button
                                    type="button"
                                    className={`button ${color}`}
                                    onClick={this.botonOkClick}
                                >
                                    {botonConfirmacion}
                                </button>
                                <button
                                    type="button"
                                    className="button"
                                    onClick={this.cerrarTicket}
                                >
                                {botonCancelar}
                                </button>
                            </p>
                        </div>
                    </article>
                </div>
                <button
                    type="button"
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={this.cerrarTicket}
                />
                <style jsx>{`
                    .buttons {
                        justify-content: center;
                        margin-top: 1rem;
                    }
                    .activo {
                        animation-name: animScale;
                        animation-duration: 0.25s;
                    }
                    @keyframes animScale {
                        0% {
                            opacity: 0;
                            transform: translate3d(0, 40px, 0)
                                scale3d(0.1, 0.6, 1);
                        }
                        100% {
                            opacity: 1;
                            transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
                        }
                    }
                    @media print {
                        button {
                            display:none;
                        }
                        .message{
                            border:1px solid white;
                        }
                     }
                `}</style>
            </div>
        );
    }
}

export default Ticket;