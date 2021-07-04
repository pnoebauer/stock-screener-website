import React from 'react';

import {connect} from 'react-redux';

// import {doSetIndicatorConfiguration} from '../../redux/configuration/configuration.actions';

import {getChartIndicatorConfiguration} from '../../redux/chart/chart.selectors';

import ConfigurationForm from '../indicator-configuration-form/indicator-configuration-form.component';

// const mapStateToProps = (state, {indicator}) => ({
// 	configuration: getIndicatorConfiguration(state, indicator),
// });

// const mapDispatchToProps = dispatch => ({
// 	updateIndicatorConfiguration: indicatorConfig =>
// 		dispatch(doSetIndicatorConfiguration(indicatorConfig)),
// });

// const ChartIndicatorConfigurationForm = connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(ConfigurationForm);

const mapStateToProps = (state, {indicatorId}) => ({
	configuration: getChartIndicatorConfiguration(state, indicatorId),
});

// const ChartIndicatorConfigurationForm = ConfigurationForm;

export default connect(mapStateToProps)(ConfigurationForm);

// export default ChartIndicatorConfigurationForm;

// export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationForm);
