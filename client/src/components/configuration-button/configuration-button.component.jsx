import React from 'react';

import {RiSettings5Fill} from 'react-icons/ri';

import './configuration-button.styles.css';

const ConfigurationButton = ({openConfigModal}) => (
	<button onClick={openConfigModal} className='config-button'>
		<RiSettings5Fill className='config-icon' />
	</button>
);

export default ConfigurationButton;
