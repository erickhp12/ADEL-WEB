import React, {Component} from 'react'

class Select extends Component {
	render() {
		let options = this.props.options.map(option => {
			return (<option key={option.value} value={option.value}>{option.label}</option>)
		})

		return (
			<div className="field">
				<label className="label has-text-grey has-text-weight-semibold">{ this.props.label }</label>
				<div className="control">
					<div className={`select is-multiple ${this.props.error.length > 0 && 'is-danger'}`}>
						<select multiple={true}
							// value={this.props.value}
							name={this.props.name}
							onChange={this.props.onChange}
							className={this.props.className}
							onBlur={this.props.validate}
						>
							{ options }
						</select>
					</div>
				</div>
				<p className="help has-text-grey">{ this.props.helpText }</p>
				{ this.props.error.map((obj, index) => (
					<p className="help is-danger" key={ index }>{ obj }</p>
				)) }
			</div>
		)
	}
}

export default Select
