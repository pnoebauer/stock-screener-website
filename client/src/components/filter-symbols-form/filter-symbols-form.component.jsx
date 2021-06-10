import React from 'react';

import {connect} from 'react-redux';

import {doSetFilterRules} from '../../redux/filtering/filtering.actions';

import {getFilterRules} from '../../redux/filtering/filtering.selectors';

import RulesSelector from '../rules-selector/rules-selector.component';

import './filter-symbols-form.styles.css';

class FilterSymbolsForm extends React.Component {
	constructor(props) {
		super(props);

		const {filterRules} = this.props;

		this.state = {
			rules: filterRules,
		};

		this.defaultRule = {
			operator: '=',
			indicatorLH: this.props.usedIndicators[0],
			indicatorRH: this.props.usedIndicators[0],
		};

		// // this.state = {parameter, lookBack, errormessage: ''};
		// this.state = {
		// 	rules: [this.defaultRule],
		// };
	}

	selectionChange = event => {
		// console.log(event.target.name, event.target.value, 'etv');

		const [name, rowIndex] = event.target.name.split('-');

		this.setState((state, props) => {
			return {
				rules: state.rules.map((item, index) => {
					// console.log(index, 'in');
					if (index === Number(rowIndex)) {
						// console.log(index, 'i');
						return {...item, [name]: event.target.value};
					}
					return item;
				}),
			};
		});
	};

	onDelete = event => {
		event.preventDefault();

		this.setState(state => {
			return {
				rules: state.rules.filter((item, index) => index !== Number(event.target.name)),
			};
		});
	};

	addRule = event => {
		event.preventDefault();
		this.setState(state => {
			return {
				rules: [...state.rules, this.defaultRule],
			};
		});
	};

	handleSubmit = event => {
		event.preventDefault();

		const {setFilterRules} = this.props;

		setFilterRules(this.state.rules);

		this.props.closeForm();
	};

	render() {
		const {usedIndicators} = this.props;

		return (
			<form onSubmit={this.handleSubmit} className='filter-symbols-form'>
				<label className='filter-rule-label'>
					Enter rules for filtering symbols:
					<div className='rule-selection-container'>
						{this.state.rules.map((rule, index) => (
							<RulesSelector
								usedIndicators={usedIndicators}
								rule={rule}
								selectionChange={this.selectionChange}
								id={index}
								key={index}
								onDelete={this.onDelete}
							/>
						))}
					</div>
					<button className='add-filter-rule-button' onClick={this.addRule}>
						+
					</button>
				</label>

				<p className='submit-button-paragraph'>
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

const mapStateToProps = state => ({
	filterRules: getFilterRules(state),
});

const mapDispatchToProps = dispatch => ({
	setFilterRules: rules => dispatch(doSetFilterRules(rules)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterSymbolsForm);
