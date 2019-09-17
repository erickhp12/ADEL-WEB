import React, { Component } from 'react';

class Error extends Component {
	render() {
		return (
			<error>
                <div className="contenido">
                    <h2> { this.props.titulo } </h2>
                    <label>
                        { this.props.mensaje }
                    </label>
                </div>
                <style jsx>{`
                    .contenido {
                        border: 1px solid #ec000099;
                        background: #ff1f1f1f;
                        text-align: center;
                        margin: 1rem;
                        padding: 0.3rem;
                    }
                    .contenido>h2{
                        font-weight:600;
                    }
                `}</style>
            </error>
		)
	}
}

export default Error
