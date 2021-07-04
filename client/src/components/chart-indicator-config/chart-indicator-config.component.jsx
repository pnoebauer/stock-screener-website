import React from 'react';

import {connect} from 'react-redux';

import {doSetChartIndicatorConfiguration} from '../../redux/chart/chart.actions';

import {getChartIndicatorConfiguration} from '../../redux/chart/chart.selectors';

import isEqual from 'lodash.isequal';

import {INDICATORS_TO_API} from '../../assets/constants';

import './chart-indicator-config.styles.css';

class ChartIndicatorConfigurationForm extends React.Component {
	constructor(props) {
		super(props);
		const {indicator} = this.props;

		const formConfiguration = this.props.configuration;

		// console.log(formConfiguration, 'fc');

		// !!!!!!!DIFFERENT TO INDICATOR-CONFIGURATION-FORM
		let {sourcePath: parameter, windowSize: lookBack} = formConfiguration;
		parameter += 'Price';

		this.state = {parameter, lookBack, errormessage: ''};
	}

	selectionChange = event => {
		this.setState({parameter: event.target.value});
	};

	onTextChange = event => {
		const {name, value} = event.target;
		let err = '';
		if (name === 'lookBack') {
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
		const {indicator, configuration} = this.props;
		const {errormessage, ...formConfiguration} = this.state;

		console.log({formConfiguration, configuration});

		if (
			Number(formConfiguration.lookBack) !== Number(configuration.windowSize) ||
			formConfiguration.parameter.replace('Price', '') !== configuration.sourcePath
		) {
			// action payload
			const payload = {
				windowSize: Number(formConfiguration.lookBack),
				sourcePath: formConfiguration.parameter.replace('Price', ''),
				id: indicator,
			};
			console.log('not equal', {payload});

			this.props.updateIndicatorConfiguration(payload);
		}

		// !!!!!!!DIFFERENT TO INDICATOR-CONFIGURATION-FORM
		// only trigger if the form inputs have changed (compare the global state with the component state)
		// if (!isEqual(formConfiguration, configuration)) {
		// const indicatorConfiguration = {[indicator]: formConfiguration};
		// this.props.updateIndicatorConfiguration(indicatorConfiguration);
		// }

		this.props.closeForm();

		event.preventDefault();
	};

	render() {
		// console.log(this.props, 'props');
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
	configuration: getChartIndicatorConfiguration(state, indicator),
});

const mapDispatchToProps = dispatch => ({
	updateIndicatorConfiguration: indicatorConfig => {
		console.log({indicatorConfig});
		return dispatch(doSetChartIndicatorConfiguration(indicatorConfig));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChartIndicatorConfigurationForm);

// export default ChartIndicatorConfigurationForm;

// export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationForm);
