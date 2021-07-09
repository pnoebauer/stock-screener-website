import React from 'react';

import {connect} from 'react-redux';

import {doSetChartIndicatorConfiguration} from '../../redux/chart/chart.actions';

import {getChartIndicatorConfiguration} from '../../redux/chart/chart.selectors';

import isEqual from 'lodash.isequal';

import {INDICATORS_TO_API, CHART_INDICATORS} from '../../assets/constants';
// import {CUSTOM_INDICATORS} from '../../assets/constants';

import './chart-indicator-config.styles.css';

class ChartIndicatorConfigurationForm extends React.Component {
	constructor(props) {
		super(props);
		const {indicator} = this.props;

		const formConfiguration = this.props.configuration;

		let {type, sourcePath: parameter, windowSize: lookBack} = formConfiguration;
		parameter += 'Price';

		console.log({type});

		this.state = {type, parameter, lookBack, errormessage: ''};
	}

	selectionChange = event => {
		// console.log(event.target.name);
		const {name, value} = event.target;
		this.setState({[name]: value});
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
			formConfiguration.parameter.replace('Price', '') !== configuration.sourcePath ||
			formConfiguration.type !== configuration.type
		) {
			// action payload
			const payload = {
				windowSize: Number(formConfiguration.lookBack),
				sourcePath: formConfiguration.parameter.replace('Price', ''),
				id: indicator,
				type: formConfiguration.type,
			};
			console.log('not equal', {payload});

			this.props.updateIndicatorConfiguration(payload);
		}

		this.props.closeForm();

		event.preventDefault();
	};

	render() {
		// console.log(this.props, 'props');
		return (
			<form onSubmit={this.handleSubmit} className='indicator-configuration-form'>
				<label>
					Select the indicator type:
					<p>
						<select
							value={this.state.type}
							onChange={this.selectionChange}
							name='type'
							className='indicator-type-selector'
						>
							{Object.keys(CHART_INDICATORS).map((value, index) => (
								// console.log(INDICATORS_TO_API[value], value, 'v') ||
								<option value={value} key={index}>
									{value.toUpperCase()}
								</option>
							))}
						</select>
					</p>
				</label>

				{this.state.parameter ? (
					<label>
						Select the price parameter for the indicator:
						<p>
							<select
								value={this.state.parameter}
								onChange={this.selectionChange}
								name='parameter'
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
		// console.log({indicatorConfig});
		return dispatch(doSetChartIndicatorConfiguration(indicatorConfig));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChartIndicatorConfigurationForm);

// export default ChartIndicatorConfigurationForm;

// export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationForm);
