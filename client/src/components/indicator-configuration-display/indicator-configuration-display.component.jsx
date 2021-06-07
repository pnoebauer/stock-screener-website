import React from 'react';
import {connect} from 'react-redux';

import {API_TO_INDICATORS} from '../../assets/constants';

import {getIndicatorConfiguration} from '../../redux/configuration/configuration.selectors';

import './indicator-configuration-display.styles.css';

const IndicatorConfigurationDisplay = ({indicator, configuration}) => {
	const {parameter, lookBack} = configuration;

	const display = `${
		API_TO_INDICATORS[parameter]
			? API_TO_INDICATORS[parameter].replace(' Price', '')
			: 'Lookback'
	}-${lookBack}`;

	return (
		<div className='indicator-configuration-display' id={indicator} name='screen-header'>
			{display}
		</div>
	);
};

const mapStateToProps = (state, {indicator}) => ({
	configuration: getIndicatorConfiguration(state, indicator),
});

export default connect(mapStateToProps)(IndicatorConfigurationDisplay);
