import React from 'react';

import {RiSettings5Fill} from 'react-icons/ri';

import Tooltip from '../tooltip/tooltip.component';

import './configuration-button.styles.css';

const ConfigurationButton = ({openConfigModal, tooltip}) => {
	let tooltipText = '';

	if (tooltip) {
		tooltipText =
			tooltip === 'indicator'
				? 'Click to adjust the indicator settings'
				: 'Click to adjust all intervals';
	}

	return (
		<button
			onClick={openConfigModal}
			className={`config-button ${tooltip ? 'tooltip' : ''}`}
		>
			<RiSettings5Fill className='config-icon' />
			<Tooltip tooltipText={tooltipText} position={'center'} />
		</button>
	);
};

export default ConfigurationButton;
