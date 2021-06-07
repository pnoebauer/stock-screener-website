import React from 'react';

import {connect} from 'react-redux';

import isEqual from 'lodash.isequal';

import {INDICATORS_TO_API, CUSTOM_INDICATORS} from '../../assets/constants';

import {doSetIndicatorConfiguration} from '../../redux/configuration/configuration.actions';

import {getIndicatorConfiguration} from '../../redux/configuration/configuration.selectors';

import './indicator-configuration-form.styles.css';

class IndicatorConfigurationForm extends React.Component {
	constructor(props) {
		super(props);
		const {indicator} = this.props;

		const formConfiguration = CUSTOM_INDICATORS[indicator];

		const {parameter, lookBack} = formConfiguration;

		this.state = {parameter, lookBack, errormessage: ''};
	}

	selectionChange = event => {
		// console.log(event.target.value, 'etv');
		this.setState({parameter: event.target.value});
	};

	onTextChange = event => {
		const {name, value} = event.target;

		let err = '';
		if (name === 'lookBack') {
			// if (value != '' && !Number(value)) {
			if (!Number(value)) {
				err = (
					<p>
						<strong>The lookback period has to be a number greater than 0</strong>
					</p>
				);
			}
		}
		this.setState({errormessage: err});
		this.setState({[name]: value});
	};

	handleSubmit = event => {
		// console.log('submit', this.state);

		// const {indicator, updateCustomIndicators} = this.props;
		const {indicator, configuration} = this.props;
		const {errormessage, ...formConfiguration} = this.state;

		// console.log(
		// 	localStorage.getItem(indicator),
		// 	JSON.stringify(formConfiguration),
		// 	localStorage.getItem(indicator) !== JSON.stringify(formConfiguration),
		// 	'sss'
		// );

		// if (localStorage.getItem(indicator) !== JSON.stringify(formConfiguration)) {
		// 	//if the formConfiguration has changed
		// 	localStorage.setItem(indicator, JSON.stringify(formConfiguration));

		// 	const indicatorConfig = {[indicator.toLowerCase()]: formConfiguration};

		// 	CUSTOM_INDICATORS[indicator] = formConfiguration;
		// 	// console.log(indicatorConfig, 'indicatorConfig', CUSTOM_INDICATORS);

		// 	// trigger a fetch call in the parent
		// 	updateCustomIndicators(undefined, indicatorConfig);
		// }

		// only trigger if the form inputs have changed (compare the global state with the component state)
		if (!isEqual(formConfiguration, configuration)) {
			const indicatorConfiguration = {[indicator]: formConfiguration};
			this.props.updateIndicatorConfiguration(indicatorConfiguration);
		}

		this.props.closeForm();

		event.preventDefault();
	};

	render() {
		// console.log(this.state, 's');
		// console.log(this.props.configuration, 'redux formConfiguration', this.props.indicator);

		return (
			<form onSubmit={this.handleSubmit} className='indicator-configuration-form'>
				{this.state.parameter ? (
					<label>
						Select the price parameter for the indicator:
						<p>
							<select
								value={this.state.parameter}
								onChange={this.selectionChange}
								name='selector'
								className='price-parameter-selector'
							>
								{['Open Price', 'High Price', 'Low Price', 'Close Price'].map(
									(value, index) => (
										// console.log(INDICATORS_TO_API[value], value, 'v') ||
										<option value={INDICATORS_TO_API[value]} key={index}>
											{value}
										</option>
									)
								)}
							</select>
						</p>
					</label>
				) : null}
				<p>Enter the lookback period:</p>
				<input
					type='text'
					name='lookBack'
					onChange={this.onTextChange}
					value={this.state.lookBack}
					className='lookback-input'
				/>
				{this.state.errormessage}
				<p className='indicator-configuration-submit-container'>
					<input
						type='submit'
						value='Apply'
						className='indicator-configuration-submit-button'
						disabled={!!this.state.errormessage}
					/>
				</p>
			</form>
		);
	}
}

const mapStateToProps = (state, {indicator}) => ({
	configuration: getIndicatorConfiguration(state, indicator),
});

const mapDispatchToProps = dispatch => ({
	updateIndicatorConfiguration: indicatorConfig =>
		dispatch(doSetIndicatorConfiguration(indicatorConfig)),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorConfigurationForm);
