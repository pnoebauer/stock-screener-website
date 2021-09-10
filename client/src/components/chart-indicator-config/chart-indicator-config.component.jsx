import React from 'react';

import {connect} from 'react-redux';

import {
	doSetChartIndicatorConfiguration,
	doDeleteChartIndicator,
} from '../../redux/chart/chart.actions';

import {getChartIndicatorConfiguration} from '../../redux/chart/chart.selectors';

import isEqual from 'lodash.isequal';

import {
	INDICATORS_TO_API,
	CHART_INDICATORS,
	MAIN_CHART_INDICATORS,
} from '../../assets/constants';

import './chart-indicator-config.styles.css';

function camelCaseToTitleCase(text) {
	const result = text.replace(/([A-Z])/g, ' $1');
	const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
	return finalResult;
}

class ChartIndicatorConfigurationForm extends React.Component {
	constructor(props) {
		super(props);
		const {indicatorId} = this.props;

		const formConfiguration = this.props.configuration;

		// let {type, sourcePath, windowSize, fast, slow, signal} = formConfiguration;
		let {id, ...config} = formConfiguration;
		// console.log({config, indicatorId}, 'state');

		// this.state = {type, sourcePath, windowSize, fast, slow, signal, errormessage: ''};
		this.state = {...config, errormessage: ''};

		this.chartType = MAIN_CHART_INDICATORS.includes(formConfiguration.type)
			? 'main'
			: 'sub';
	}

	selectionChange = event => {
		// console.log(event.target.name);
		const {name, value} = event.target;
		this.setState({[name]: value});
	};

	onTextChange = event => {
		const {name, value} = event.target;
		let err = '';

		if (!Number(value)) {
			err = (
				<p>
					<strong>Enter a number greater than 0</strong>
				</p>
			);
		}

		this.setState({errormessage: err});
		this.setState({[name]: value});
	};

	handleDelete = event => {
		const {indicatorId, deleteIndicator} = this.props;
		// console.log(indicatorId);
		deleteIndicator(indicatorId);
	};

	handleSubmit = event => {
		const {indicatorId, configuration} = this.props;
		const {errormessage, ...formConfiguration} = this.state;

		console.log({formConfiguration, configuration});

		let payload = {type: formConfiguration.type, id: indicatorId};

		Object.keys(CHART_INDICATORS[formConfiguration.type]).forEach(key => {
			// console.log(typeof CHART_INDICATORS[formConfiguration.type][key], 'values', key);
			if (!formConfiguration[key]) {
				payload[key] = CHART_INDICATORS[formConfiguration.type][key];
			} else {
				payload[key] =
					typeof CHART_INDICATORS[formConfiguration.type][key] === 'number'
						? Number(formConfiguration[key])
						: formConfiguration[key];
			}
		});

		this.props.updateIndicatorConfiguration(payload);

		this.props.closeForm();

		event.preventDefault();
	};

	render() {
		// console.log(this.props.configuration.type, this.chartType, 'props');

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
							{Object.keys(CHART_INDICATORS).map((value, index) => {
								if (
									(this.chartType === 'main' && MAIN_CHART_INDICATORS.includes(value)) ||
									(this.chartType === 'sub' && !MAIN_CHART_INDICATORS.includes(value))
								) {
									return (
										<option value={value} key={index}>
											{value.toUpperCase()}
										</option>
									);
								}
								return null;
							})}
						</select>
					</p>
				</label>

				<p style={{fontWeight: 'bold'}}>Set the indicator configuration</p>

				{CHART_INDICATORS[this.state.type].sourcePath ? (
					<label>
						<div className='config-parameter-header'>Price Parameter</div>

						<div className='config-parameter'>
							<select
								value={
									this.state.sourcePath ?? CHART_INDICATORS[this.state.type].sourcePath
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
						</div>
					</label>
				) : null}

				{Object.keys(CHART_INDICATORS[this.state.type]).map(configType => {
					// console.log(this.state.type, {configType});
					if (configType === 'sourcePath') return null;

					if (configType === 'movingAverageType') {
						return (
							<div key={configType} className='config-parameter'>
								<label>
									Moving average type
									<div className='config-parameter-header'>
										<select
											value={
												this.state[configType] ??
												CHART_INDICATORS[this.state.type][configType]
											}
											onChange={this.selectionChange}
											name={configType}
											className='price-parameter-selector'
										>
											{['SMA', 'EMA', 'WMA', 'TMA'].map((value, index) => (
												// console.log(INDICATORS_TO_API[value], value, 'v') ||
												<option value={value.toLowerCase()} key={index}>
													{value}
												</option>
											))}
										</select>
									</div>
								</label>
							</div>
						);
					}
					// return null;
					else {
						return (
							<div key={configType} className='config-parameter'>
								{/* <div className='config-parameter-header'>{configType}</div> */}
								<div className='config-parameter-header'>
									{camelCaseToTitleCase(configType)}
								</div>

								{/* <div className='config-parameter-header'>Lookback period</div> */}
								<input
									type='text'
									name={configType}
									onChange={this.onTextChange}
									value={
										this.state[configType] ??
										CHART_INDICATORS[this.state.type][configType]
									}
									className='windowSize-input'
									required
								/>
								{this.state.errormessage}
							</div>
						);
					}
				})}

				<p className='indicator-configuration-button-container'>
					<input
						type='submit'
						value='Delete Indicator'
						className='indicator-configuration-delete-button'
						onClick={this.handleDelete}
					/>
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
	updateIndicatorConfiguration: indicatorConfig =>
		dispatch(doSetChartIndicatorConfiguration(indicatorConfig)),
	deleteIndicator: id => dispatch(doDeleteChartIndicator(id)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChartIndicatorConfigurationForm);

// export default ChartIndicatorConfigurationForm;

// export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationForm);
