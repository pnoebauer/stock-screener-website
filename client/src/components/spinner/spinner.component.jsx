import React from 'react';

import {connect} from 'react-redux';

import {getFetchingStatus} from '../../redux/fetching/fetching.selectors';

import './spinner.styles.css';

const Spinner = ({fetchStatus}) => {
	const {pending} = fetchStatus;
	if (pending) {
		return <div id='loader'></div>;
	}
	return null;
};

const mapStateToProps = state => ({
	fetchStatus: getFetchingStatus(state),
});

export default connect(mapStateToProps)(Spinner);
