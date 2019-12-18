import React, { Component } from "react";

/**
 * Componente que muestra un modal de confirmación.
 * 
 * Props que recibe:
 * + activo: booleano que indica si el modal esta visible o no.
 * + color: Clase css que define el color de fondo del titulo y del boton aceptar, pueden ser las siguientes:
 *      - is-primary, is-link, is-info, is-success, is-warning, is-danger, is-dark
 * + titulo: Titulo del modal.
 * + contenido: Texto del modal.
 * + botonCancelarTexto: Texto del boton para cancelar.
 * + botonOkTexto: Texto del boton para aceptar.
 * + botonOkClick: Funcion que ejecuta el padre cuando se da click en el boton aceptar.
 * + cerrarModal: Funcion que ejecuta el padre cuando se cierra el modal.
 */
class ModalConfirmacion extends Component {
    state = {
        activo: ""
    };

    abrirModal = () => {
        this.setState({ activo: "is-active" });
    };

    cerrarModal = () => {
        this.setState({ activo: "" });
        this.props.cerrarModal()
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.activo) this.abrirModal();
    }

    botonOkClick = () => {
        this.cerrarModal()
        this.props.botonOkClick()
    }

    render() {
        const {
            titulo = "Titulo",
            contenido = "Contenido",
            botonOkTexto = "Ok",
            botonCancelarTexto = "Cancelar",
            color = "" // is-primary, is-link, is-info, is-success, is-warning, is-danger, is-dark
        } = this.props;
        return (
            <div className={`modal is-success ${this.state.activo}`}>
                <div className="modal-background" onClick={this.cerrarModal} />
                <div className="modal-content">
                    <article className={`message ${color} ${this.state.activo && 'activo'}`}>
                        <div className="message-header">
                            <p>{titulo}</p>
                        </div>
                        <div className="message-body has-text-centered">
                            <p>{contenido}</p>
                            <p className="buttons">
                                <button
                                    type="button"
                                    className={`button ${color}`}
                                    onClick={this.botonOkClick}
                                >
                                    {botonOkTexto}
                                </button>
                                <button
                                    type="button"
                                    className="button"
                                    onClick={this.cerrarModal}
                                >
                                    {botonCancelarTexto}
                                </button>
                            </p>
                        </div>
                    </article>
                </div>
                <button
                    type="button"
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={this.cerrarModal}
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
                `}</style>
            </div>
        );
    }
}

export default ModalConfirmacion;