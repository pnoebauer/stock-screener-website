import React from 'react';

import './filter-symbols-form.styles.css';

class FilterSymbolsForm extends React.Component {
	constructor(props) {
		super(props);

		// this.state = {parameter, lookBack, errormessage: ''};
		this.state = {
			operator: '=',
			indicatorLH: this.props.usedIndicators[0],
			indicatorRH: this.props.usedIndicators[0],
		};
	}

	selectionChange = event => {
		// console.log(event.target.value, 'etv');
		// this.setState({operator: event.target.value});

		this.setState({[event.target.name]: event.target.value});
	};

	onTextChange = event => {
		const {name, value} = event.target;
	};

	handleSubmit = event => {
		const {updateFilterRules} = this.props;

		// trigger a fetch call in the parent
		updateFilterRules(this.state);

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
