import React from 'react';
import './tooltip.styles.css';

const Tooltip = ({tooltipText, position}) => (
	<span className={`tooltiptext top ${position}`}>{tooltipText}</span>
);

export default Tooltip;
