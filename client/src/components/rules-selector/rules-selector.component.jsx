import React from 'react';

import './rules-selector.styles.css';

const RulesSelector = ({usedIndicators, rule, selectionChange, id, onDelete}) => {
	const {indicatorLH, indicatorRH, operator} = rule;

	// console.log(indicatorLH, indicatorRH, operator, 'c');
	return (
		<p className='rule-selection-row'>
			<select
				value={indicatorLH}
				onChange={selectionChange}
				className='indicator-rule-selector'
				name={`indicatorLH-${id}`}
			>
				{usedIndicators.map((value, index) => (
					<option value={value} key={index}>
						{value}
					</option>
				))}
			</select>
			<select
				value={operator}
				onChange={selectionChange}
				className='operator'
				name={`operator-${id}`}
			>
				{['>', '>=', '=', '<=', '<'].map((value, index) => (
					<option value={value} key={index}>
						{value}
					</option>
				))}
			</select>
			<select
				value={indicatorRH}
				onChange={selectionChange}
				className='indicator-rule-selector'
				name={`indicatorRH-${id}`}
			>
				{usedIndicators.map((value, index) => (
					<option value={value} key={index}>
						{value}
					</option>
				))}
			</select>
			<button className='delete-rule-button' onClick={onDelete} name={id}>
				X
			</button>
		</p>
	);
};

export default RulesSelector;
