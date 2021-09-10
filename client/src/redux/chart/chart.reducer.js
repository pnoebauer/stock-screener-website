import {CUSTOM_INDICATORS, CHART_INDICATORS} from '../../assets/constants';

import {ConfigurationTypes} from './chart.types';

const initialState = {
	indicators: [
		{
			type: 'ema',
			windowSize: 30,
			sourcePath: 'high',
			id: 0,
		},
		{
			type: 'sma',
			windowSize: 5,
			sourcePath: 'close',
			id: 1,
		},
		{
			type: 'sma',
			windowSize: 15,
			sourcePath: 'close',
			id: 2,
		},
	],
};

const chartReducer = (state = initialState, action) => {
	// console.log({action});
	switch (action.type) {
		case ConfigurationTypes.SET_CHART_INDICATOR_CONFIGURATION:
			return applySetChartIndicatorConfiguration(state, action);
		case ConfigurationTypes.SET_CHART_INDICATORS:
			return applySetIndicators(state, action);
		case ConfigurationTypes.DELETE_CHART_INDICATOR:
			return applyDeleteIndicator(state, action);
		default:
			return state;
	}
};

const applyDeleteIndicator = (state, action) => {
	const id = action.payload;

	return {
		...state,
		indicators: state.indicators.filter(indicator => indicator.id !== id),
	};
};

const applySetChartIndicatorConfiguration = (state, action) => {
	const indicatorConfigurationObject = action.payload;
	// console.log({indicatorConfigurationObject}, '--------');
	const {id} = indicatorConfigurationObject;

	return {
		...state,
		indicators: state.indicators.map(indicator => {
			if (indicator.id === id) {
				return indicatorConfigurationObject;
				// return {
				// 	...indicator,
				// 	...indicatorConfigurationObject,
				// };
			}
			return indicator;
		}),
	};
};

const applySetIndicators = (state, action) => {
	const updatedIndicatorList = action.payload;

	const currentStateIndicators = [...state.indicators];
	const nextState = {...state, indicators: []};

	const currentIndicators = state.indicators.map(({type}) => type);

	updatedIndicatorList.forEach(indicatorName => {
		const indicator = indicatorName.toLowerCase();
		const indicatorIndex = currentIndicators.indexOf(indicator);

		if (indicatorIndex > -1) {
			nextState.indicators.push(currentStateIndicators.splice(indicatorIndex, 1)[0]);
			currentIndicators.splice(indicatorIndex, 1);
		} else {
			nextState.indicators.push({
				...CHART_INDICATORS[indicator],
				id: nextState.indicators.length + 1,
				type: indicator,
			});
		}
	});

	// console.log({nextState});

	// return state;
	return nextState;
};

export default chartReducer;
