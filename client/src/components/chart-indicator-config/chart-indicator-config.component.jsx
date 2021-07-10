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
		const {indicatorId} = this.props;

		const formConfiguration = this.props.configuration;

		// let {type, sourcePath, windowSize, fast, slow, signal} = formConfiguration;
		let {id, ...config} = formConfiguration;
		console.log({config, indicatorId}, 'state');

		// this.state = {type, sourcePath, windowSize, fast, slow, signal, errormessage: ''};
		this.state = {...config, errormessage: ''};
	}

	selectionChange = event => {
		// console.log(event.target.name);
		const {name, value} = event.target;
		this.setState({[name]: value});
	};

	onTextChange = event => {
		const {name, value} = event.target;
		let err = '';
		// if (name === 'windowSize') {
		if (!Number(value)) {
			err = (
				<p>
					<strong>Enter a number greater than 0</strong>
				</p>
			);
		}
		// }
		this.setState({errormessage: err});
		this.setState({[name]: value});
	};

	handleSubmit = event => {
		const {indicatorId, configuration} = this.props;
		const {errormessage, ...formConfiguration} = this.state;

		console.log({formConfiguration, configuration});

		// if (
		// 	Number(formConfiguration.windowSize) !== Number(configuration.windowSize) ||
		// 	formConfiguration.sourcePath !== configuration.sourcePath ||
		// 	formConfiguration.type !== configuration.type
		// ) {
		// action payload
		// const payload = {
		// 	windowSize: Number(formConfiguration.windowSize),
		// 	sourcePath: formConfiguration.sourcePath,
		// 	id: indicatorId,
		// 	type: formConfiguration.type,
		// 	// fast: formConfiguration.fast,
		// 	// slow: formConfiguration.slow,
		// 	// signal: formConfiguration.signal,
		// };

		// console.log(Object.keys(CHART_INDICATORS[formConfiguration.type]), 'keys');

		let payload = {type: formConfiguration.type, id: indicatorId};

		Object.keys(CHART_INDICATORS[formConfiguration.type]).forEach(key => {
			// console.log(typeof CHART_INDICATORS[formConfiguration.type][key], 'values', key);
			payload[key] =
				typeof CHART_INDICATORS[formConfiguration.type][key] === 'number'
					? Number(formConfiguration[key])
					: formConfiguration[key];
		});

		// const payload = {
		// 	...formConfiguration,
		// 	windowSize: Number(formConfiguration.windowSize),
		// 	id: indicatorId,
		// 	// fast: formConfiguration.fast,
		// 	// slow: formConfiguration.slow,
		// 	// signal: formConfiguration.signal,
		// };
		// console.log({payload});

		// this.props.updateIndicatorConfiguration(payload);
		// }

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

				{CHART_INDICATORS[this.state.type].sourcePath ? (
					<label>
						Select the price parameter for the indicator:
						<p>
							<select
								value={
									this.state.sourcePath || CHART_INDICATORS[this.state.type].sourcePath
								}
								onChange={this.selectionChange}
								name='sourcePath'
								className='price-parameter-selector'
							>
								{['Open Price', 'High Price', 'Low Price', 'Close Price'].map(
									(value, index) => (
										// console.log(INDICATORS_TO_API[value], value, 'v') ||
										<option value={value.replace(' Price', '').toLowerCase()} key={index}>
											{value}
										</option>
									)
								)}
							</select>
						</p>
					</label>
				) : null}

				{CHART_INDICATORS[this.state.type].windowSize ? (
					<>
						<p>Enter the lookback period:</p>
						<input
							type='text'
							name='windowSize'
							onChange={this.onTextChange}
							value={
								this.state.windowSize || CHART_INDICATORS[this.state.type].windowSize
							}
							className='windowSize-input'
							required
						/>
						{this.state.errormessage}
					</>
				) : null}

				{this.state.type === 'macd' ? (
					<>
						<p>Enter the fast period:</p>
						<input
							type='text'
							name='fast'
							onChange={this.onTextChange}
							value={this.state.fast || CHART_INDICATORS[this.state.type].fast}
							className='windowSize-input'
							required
						/>
						<p>Enter the slow period:</p>
						<input
							type='text'
							name='slow'
							onChange={this.onTextChange}
							value={this.state.slow || CHART_INDICATORS[this.state.type].slow}
							className='windowSize-input'
							required
						/>
						<p>Enter the signal:</p>
						<input
							type='text'
							name='signal'
							onChange={this.onTextChange}
							value={this.state.signal || CHART_INDICATORS[this.state.type].signal}
							className='windowSize-input'
							required
						/>
						{this.state.errormessage}
					</>
				) : null}

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

const mapStateToProps = (state, {indicatorId}) => ({
	configuration: getChartIndicatorConfiguration(state, indicatorId),
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
