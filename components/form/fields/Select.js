import React, {Component} from 'react'

class Select extends Component {
	render() {
		let options = this.props.options.map(option => {
			return (<option key={option.value} value={option.value}>{option.label}</option>)
		})

		return (
			<div className={`column ${this.props.width}`}>
				<label className="label has-text-grey has-text-weight-semibold">{ this.props.label }</label>
				<div className="control">
					<div className={`select ${this.props.error.length > 0 && 'is-danger'}`}>
						<select multiple={false}
							value={this.props.value}
							name={this.props.name}
							id={this.props.id}
							onChange={(e) => this.props.onChange(this.props.field, e)}
							className={this.props.width}
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
				<style jsx>{`
					.is-1{
						width:10rem;
					}
					.is-2{
						width:20rem;
					}
					.is-3{
						width:30rem;
					}
					.is-4{
						width:40rem;
					}
					.is-5{
						width:50rem;
					}
					.is-6{
						width:60rem;
					}
					.is-7{
						width:70rem;
					}
					.is-8{
						width:80rem;
					}
					.is-9{
						width:90rem;
					}
					.is-10{
						width:100rem;
					}
				`}
				</style>
			</div>
		)
	}
}

export default Select
