import React, { Component } from 'react';

class Input extends Component {
	render() {

		return (
			<div className={`column ${this.props.width}`}>
				<label>{ this.props.label }</label>
				<input
					type={this.props.type}
					name={this.props.name}
					onChange={this.props.onChange}
					className={this.props.className}
					onBlur={this.props.validate}
				/>
				<p className="help-text">{ this.props.helpText }</p>
				{ this.props.error.map((obj, index) => (
					<p className="error-text" key={ index }>{ obj }</p>
                )) }
			</div>
		)
	}
}

export default Input
