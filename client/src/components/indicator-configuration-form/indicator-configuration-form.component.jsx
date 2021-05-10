import React from 'react';

import {
	API_TO_INDICATORS,
	INDICATORS_TO_API,
	CUSTOM_INDICATORS_C,
} from '../../assets/constants';

class IndicatorConfigurationForm extends React.Component {
	constructor(props) {
		super(props);
		const {indicator} = this.props;
		const config = CUSTOM_INDICATORS_C[indicator];
		// this.state = {value: 'Close', age: null, errormessage: ''};
		const {parameter, lookBack} = config;

		this.state = {parameter, lookBack, errormessage: ''};
	}

	selectionChange = event => {
		// console.log(event.target.value, 'etv');
		this.setState({parameter: event.target.value});
	};

	handleSubmit = event => {
		if (this.state.errormessage === '') {
			console.log('submit', this.state);
		}

		// !this.state.errormessage && console.log('submit2', this.state);

		event.preventDefault();
	};

	onTextChange = event => {
		const {name, value} = event.target;

		let err = '';
		if (name === 'lookBack') {
			if (value != '' && !Number(value)) {
				err = <strong>The lookback period has to be a number</strong>;
			}
		}
		this.setState({errormessage: err});
		this.setState({[name]: value});
	};

	render() {
		console.log(this.state, 's');

		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Select the price parameter for the indicator:
					<p>
						<select
							value={this.state.parameter}
							onChange={this.selectionChange}
							name='selector'
						>
							{['Open Price', 'High Price', 'Low Price', 'Close Price'].map(
								(value, index) =>
									console.log(INDICATORS_TO_API[value], value, 'v') || (
										<option value={INDICATORS_TO_API[value]} key={index}>
											{value}
										</option>
									)
							)}
						</select>
					</p>
				</label>
				<p>Enter the lookback period:</p>
				<input type='text' name='lookBack' onChange={this.onTextChange} />
				{this.state.errormessage}
				<p>
					<input type='submit' value='Submit' />
				</p>
			</form>
		);
	}
}

export default IndicatorConfigurationForm;

// import Dropdown from '../dropdown/dropdown.component';

// class IndicatorConfigurationForm extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			username: '',
// 			age: null,
// 			errormessage: '',
// 		};
// 	}
// 	myChangeHandler = event => {
// 		let nam = event.target.name;
// 		let val = event.target.value;
// 		let err = '';
// 		if (nam === 'age') {
// 			if (val != '' && !Number(val)) {
// 				err = <strong>Your age must be a number</strong>;
// 			}
// 		}
// 		this.setState({errormessage: err});
// 		this.setState({[nam]: val});
// 	};

// 	handleSubmit = event => {
// 		console.log('submit', this.state);
// 		event.preventDefault();
// 	};

// 	render() {
// 		return (
// 			<form onSubmit={this.handleSubmit}>
// 				<div>
// 					<Dropdown
// 						options={['Open', 'High', 'Low', 'Close']}
// 						// gridRow={Symbol.length + 2}
// 						// gridColumn={1}
// 						// key={colIdx.toString()+rowIdx.toString()}
// 						// onChange={this.onRowAdd}
// 						customStyles={{
// 							height: '30px',
// 							width: '150px',
// 							borderBottom: '1px solid black',
// 							borderLeft: '1px solid black',
// 							// marginLeft: '-1px',
// 						}}
// 						// className={'add-row'}
// 						contentEditable={false}
// 					>
// 						Close
// 					</Dropdown>
// 				</div>

// 				<h1>
// 					Hello {this.state.username} {this.state.age}
// 				</h1>
// 				<p>Enter your name:</p>
// 				<input type='text' name='username' onChange={this.myChangeHandler} />
// 				<p>Enter your age:</p>
// 				<input type='text' name='age' onChange={this.myChangeHandler} />
// 				{this.state.errormessage}

// 				<input type='submit' value='Submit' />
// 			</form>
// 		);
// 	}
// }
