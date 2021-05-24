import React from 'react';

import {API_TO_INDICATORS} from '../../assets/constants';

import './indicator-configuration-display.styles.css';

const IndicatorConfigurationDisplay = ({id, configuration}) => {
	const {parameter, lookBack} = configuration;

	const display = `${
		API_TO_INDICATORS[parameter]
			? API_TO_INDICATORS[parameter].replace(' Price', '')
			: 'Lookback'
	}-${lookBack}`;

	return (
		<div className='indicator-configuration-display' id={id} name='screen-header'>
			{display}
		</div>
	);
};

export default IndicatorConfigurationDisplay;
