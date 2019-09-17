import React, { Component } from 'react';
import Flatpickr from 'react-flatpickr'

class Input extends Component {
	render() {
		return (
			<div className="field">
				<label className="label has-text-grey has-text-weight-semibold">{ this.props.label }</label>
				<div className="control">
					<Flatpickr
						type={this.props.type}
						value={this.props.value} 
						name={this.props.name}
						onChange={ this.props.onChange }
						className={`input ${this.props.className} ${this.props.error.length > 0 && 'is-danger'}`}
						onBlur={this.props.validate}
						onKeyPress={this.props.onKeyPress}
						options={this.props.options}
					/>

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
