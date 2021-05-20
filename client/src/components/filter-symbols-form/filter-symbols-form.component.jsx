import React from 'react';

import {
	API_TO_INDICATORS,
	INDICATORS_TO_API,
	CUSTOM_INDICATORS,
} from '../../assets/constants';

import './filter-symbols-form.styles.css';

class FilterSymbolsForm extends React.Component {
	constructor(props) {
		super(props);
		// const {indicator} = this.props;

		// const config =
		// 	JSON.parse(localStorage.getItem(indicator)) || CUSTOM_INDICATORS[indicator];

		// const config = CUSTOM_INDICATORS[indicator];

		// const {parameter, lookBack} = config;

		// this.state = {parameter, lookBack, errormessage: ''};
		this.state = {operator: '', indicatorLH: '', indicatorRH: ''};
	}

	selectionChange = event => {
		// console.log(event.target.value, 'etv');
		// this.setState({operator: event.target.value});

		this.setState({[event.target.name]: event.target.value});
	};

	onTextChange = event => {
		const {name, value} = event.target;

		// let err = '';
		// if (name === 'lookBack') {
		// 	// if (value != '' && !Number(value)) {
		// 	if (!Number(value)) {
		// 		err = (
		// 			<p>
		// 				<strong>The lookback period has to be a number greater than 0</strong>
		// 			</p>
		// 		);
		// 	}
		// }
		// this.setState({errormessage: err});
		// this.setState({[name]: value});
	};

	handleSubmit = event => {
		// console.log('submit', this.state);

		// const {indicator, updateCustomIndicators} = this.props;
		// const {errormessage, ...config} = this.state;

		// console.log(indicator, config);

		// console.log(
		// 	localStorage.getItem(indicator),
		// 	JSON.stringify(config),
		// 	localStorage.getItem(indicator) !== JSON.stringify(config),
		// 	'sss'
		// );

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
		const {usedIndicators} = this.props;

		return (
			<form onSubmit={this.handleSubmit} className='filter-symbols-form'>
				<label>
					Select the price parameter for the indicator:
					<p>
						{/* <input type='text' /> */}
						<select
							value={this.state.indicatorLH}
							onChange={this.selectionChange}
							name='indicatorLH'
							className='operator'
						>
							{usedIndicators.map((value, index) => (
								// console.log(INDICATORS_TO_API[value], value, 'v') ||
								<option value={value} key={index}>
									{value}
								</option>
							))}
						</select>
						<select
							value={this.state.operator}
							onChange={this.selectionChange}
							name='operator'
							className='operator'
						>
							{['>', '>=', '=', '<=', '<'].map((value, index) => (
								<option value={value} key={index}>
									{value}
								</option>
							))}
						</select>
						<select
							value={this.state.indicatorRH}
							onChange={this.selectionChange}
							name='indicatorRH'
							className='operator'
						>
							{usedIndicators.map((value, index) => (
								// console.log(INDICATORS_TO_API[value], value, 'v') ||
								<option value={value} key={index}>
									{value}
								</option>
							))}
						</select>

						{/* <input type='text' /> */}
					</p>
				</label>
				<p>Enter the lookback period:</p>
				<input
					type='text'
					name='lookBack'
					// onChange={this.onTextChange}
					// value={this.state.lookBack}
					className='lookback-input'
				/>
				{/* {this.state.errormessage} */}
				<p>
					<input
						type='submit'
						value='Apply'
						className='filter-symbols-submit-button'
						// disabled={!!this.state.errormessage}
					/>
				</p>
			</form>
		);
	}
}

export default FilterSymbolsForm;
