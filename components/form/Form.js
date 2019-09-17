import React, { Component } from 'react'
import Input from './fields/Input'
import InputFile from './fields/InputFile'
import Select from './fields/Select'
import SelectMultiple from './fields/SelectMultiple'
import TextArea from './fields/TextArea'
import DatePicker from './fields/DatePicker'
import TimePicker from './fields/TimePicker'
import { djangoDateFormat, timeFormat } from '../../filters/filters'

class Form extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.props.onSubmit
		this.buttonLabel = this.props.buttonLabel || 'Aceptar'
		this.buttonDisplay = this.props.buttonDisplay || 'display'
		this.noError = []
		this.state = {
			'formData': this.props.data || {},
			'fields': this.props.fields || [],
			'buttonDisplay': this.props.buttonDisplay || 'display',
			'errors': this.props.errors || {}
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			formData: nextProps.data,
			fields: nextProps.fields,
			buttonDisplay: nextProps.buttonDisplay,
			errors: nextProps.errors
		})
	}

	handleChange = (field, e) => {
		var formData = this.state.formData
		
		if (field.type === 'datepicker')
			formData[field.name] = djangoDateFormat(e[0])
		else if (field.type == 'timepicker')
			formData[field.name] = timeFormat(e[0])
		else if (field.type == 'checkbox')
			formData[e.target.name] = e.target.checked
		else if(field.type == 'file')
			formData[e.target.name] = e.target.files[0]
		else
			formData[e.target.name] = e.target.value

		this.setState({ 'formData': formData }, () => {
			if(field.fun)
				field.fun()
		})

		if(field.validateOnChange)
			this.validate(field.name, field.validateOnChange)

	}

	handleKeyPress(validation, e) {
		var charCode = (e.which) ? e.which : e.keyCode;
		switch(validation) {
			case undefined:
				return true
			case 'only_numbers':
				if (charCode >= 48 && charCode <= 57)
					return true
				else
					e.preventDefault()
				break
			case 'read_only':
				e = (e) ? e : window.event;
				e.preventDefault()
				break
			default:
				console.log('Validacion KeyPress no valida')
				return true
		}
	}

	getValue(field) {
		switch(field.type) {
			case 'select-multiple':
				return this.state.formData[field.name] || []
			case 'checkbox':
				return this.state.formData[field.name] || false
			default:
				return this.state.formData[field.name] || ''
		}
	}

	getErrors(key) {
		var errors = this.state.errors
		if(!errors[key])
			errors[key]=[]
		return errors[key] || this.noError
	}

	validate(key, validateFn) {
		if(validateFn){
			var error = validateFn(this.state.formData[key])
			var errors = this.state.errors
			
			if(!errors[key])
				errors[key]={}

			errors[key] = []
			this.setState({ 'errors': errors })
		}
	}

	getField(field){
		let htmlField = ''

		switch(field.type) {
			case 'select':
				htmlField = (
					<Select
						key={field.name}
						label={field.label}
						name={field.name}
						className={field.className}
						width={field.width}
						value={this.getValue(field)}
						options={field.options}
						id={field.id}
						onChange={this.handleChange}
						validate={this.validate.bind(this, field.name, field.validate)}
						helpText={field.helpText}
						error={this.getErrors(field.name)}
						field={field}
					/>)
				break;
			case 'select-multiple':
				htmlField = (
					<SelectMultiple
						key={field.name}
						label={field.label}
						name={field.name}
						className={field.className}
						value={this.getValue(field)}
						options={field.options}
						onChange={this.handleChange.bind(this, field)}
						validate={this.validate.bind(this, field.name, field.validate)}
						helpText={field.helpText}
						error={this.getErrors(field.name)}
					/>)
				break;
			case 'textarea':
				htmlField = (
					<TextArea
						key={field.name}
						label={field.label}
						name={field.name}
						className={field.className}
						width={field.width}
						value={this.getValue(field)}
						onChange={this.handleChange.bind(this, field)}
						validate={this.validate.bind(this, field.name, field.validate)}
						helpText={field.helpText}
						error={this.getErrors(field.name)}
					/>
				)
				break
			case 'file':
				htmlField = (
					<InputFile
						key={field.name}
						label={field.label}
						name={field.name}
						className={field.className}
						type={field.type}
						onChange={this.handleChange.bind(this, field)}
						validate={this.validate.bind(this, field.name, field.validate)}
						helpText={field.helpText}
						error={this.getErrors(field.name)}
					/>
				)
				break
			case 'datepicker':
				htmlField = (
					<DatePicker
						key={field.name}
						label={field.label}
						name={field.name}
						value={this.getValue(field)}
						type={field.type}
						className={field.className}
						width={field.width}
						onChange={this.handleChange.bind(this, field)}
						validate={this.validate.bind(this, field.name, field.validate)}
						onKeyPress={this.handleKeyPress.bind(this, field.keyPressValidation)}
						helpText={field.helpText}
						options={field.options}
						error={this.getErrors(field.name)}
					/>
				)
				break
			case 'timepicker':
				htmlField = (
					<TimePicker
						key={field.name}
						label={field.label}
						name={field.name}
						value={this.getValue(field)}
						type={field.type}
						className={field.className}
						width={field.width}
						onChange={this.handleChange.bind(this, field)}
						validate={this.validate.bind(this, field.name, field.validate)}
						onKeyPress={this.handleKeyPress.bind(this, field.keyPressValidation)}
						helpText={field.helpText}
						options={field.options}
						error={this.getErrors(field.name)}
					/>
				)
				break
			default:
				htmlField = (
					<Input
						key={field.name}
						label={field.label}
						name={field.name}
						value={this.getValue(field)}
						type={field.type}
						className={field.className}
						width={field.width}
						onChange={this.handleChange.bind(this, field)}
						validate={this.validate.bind(this, field.name, field.validate)}
						onKeyPress={this.handleKeyPress.bind(this, field.keyPressValidation)}
						helpText={field.helpText}
						error={this.getErrors(field.name)}
					/>
				)
		}

		return htmlField;
	}

	render() {
		var fields = this.state.fields.map(field =>{
			return this.getField(field)
		})

		return (
			<div>

				<div className="columns is-multiline">
				{ fields }
				</div>

				{ this.props.children }
				<div className="field is-grouped mt075">
					<p className="control">
						<button
							className={`button is-info ${this.state.buttonDisplay}`}
							onClick={(e) => this.onSubmit(e, this.state.formData)}>
							{this.buttonLabel}
						</button>
					</p>
					{/* TODO: BOTON PARA CANCELAR
					<p className="control">
						<button className="button is-danger" onClick={(e) => this.onSubmit(e, this.state.formData)}>
							{this.buttonLabel}
						</button>
					</p> */}
				</div>
				<style jsx>{`
					.display {
						display:block;
					}
					.noDisplay {
						display:none;
					}
					.mt075 {
						margin-top: 0.75rem;
					}
				`}</style>
			</div>
		)
	}
}

export default Form
