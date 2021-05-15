import React from 'react';

import {
	API_TO_INDICATORS,
	INDICATORS_TO_API,
	CUSTOM_INDICATORS,
	INTERVALS,
} from '../../assets/constants';

import './configure-all-intervals-form.styles.css';

class IntervalConfigurationForm extends React.Component {
	constructor(props) {
		super(props);

		// const config =
		// 	JSON.parse(localStorage.getItem(indicator)) || CUSTOM_INDICATORS[indicator];

		this.state = {Interval: INTERVALS[0]};
	}

	selectionChange = event => {
		// console.log(event.target.value, 'etv');
		this.setState({Interval: event.target.value});
	};

	handleSubmit = event => {
		// const {indicator, updateCustomIndicators} = this.props;
		const {Interval} = this.state;

		console.log(Interval, 'int');

		this.props.setAllIntervals(Interval);

		// if (localStorage.getItem(indicator) !== JSON.stringify(config)) {
		// 	//if the config has changed
		// 	localStorage.setItem(indicator, JSON.stringify(config));

		// 	const indicatorConfig = {[indicator.toLowerCase()]: config};

		// 	CUSTOM_INDICATORS[indicator] = config;
		// 	// console.log(indicatorConfig, 'indicatorConfig', CUSTOM_INDICATORS);

		// 	// trigger a fetch call in the parent
		// 	updateCustomIndicators(undefined, indicatorConfig);
		// }

		this.props.closeForm();

		event.preventDefault();
	};

	render() {
		// console.log(this.state, 's');

		return (
			<form onSubmit={this.handleSubmit} className='configure-all-intervals-form'>
				<label>
					Select interval for all symbols:
					<p>
						<select
							value={this.state.Interval}
							onChange={this.selectionChange}
							name='selector'
							className='interval-type-selector'
						>
							{INTERVALS.map((value, index) => (
								// console.log( value, 'v') ||
								<option value={value} key={index}>
									{value}
								</option>
							))}
						</select>
					</p>
				</label>

				<p>
					<input
						type='submit'
						value='Apply'
						className='interval-configuration-submit-button'
					/>
				</p>
			</form>
		);
	}
}

export default IntervalConfigurationForm;
