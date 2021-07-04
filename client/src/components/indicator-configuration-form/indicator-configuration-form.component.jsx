import React from 'react';

import {connect} from 'react-redux';

import {doSetIndicatorConfiguration} from '../../redux/configuration/configuration.actions';

import {getIndicatorConfiguration} from '../../redux/configuration/configuration.selectors';

import ConfigurationForm from './configuration-form.component';

const mapStateToProps = (state, {indicator}) => ({
	configuration: getIndicatorConfiguration(state, indicator),
});

const mapDispatchToProps = dispatch => ({
	updateIndicatorConfiguration: indicatorConfig =>
		dispatch(doSetIndicatorConfiguration(indicatorConfig)),
});

const IndicatorConfigurationForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(ConfigurationForm);

export default IndicatorConfigurationForm;

// export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationForm);
