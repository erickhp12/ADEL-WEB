import React, { Component } from 'react';

class Input extends Component {
	render() {
		return (
			<div className={`column ${this.props.width}`}>
				<label className="label has-text-grey has-text-weight-semibold">{ this.props.label }</label>
				<div className="control">
					<textarea
						value={this.props.value}
						name={this.props.name}
						onChange={this.props.onChange}
						className={`textarea ${this.props.className} ${this.props.error.length > 0 && 'is-danger'}`}
						onBlur={this.props.validate}
					>
					</textarea>
				</div>
				<p className="help has-text-grey">{ this.props.helpText }</p>
				{ this.props.error.map((obj, index) => (
					<p className="help is-danger" key={ index }>{ obj }</p>
				)) }
			</div>
		)
	}
}

export default Input
