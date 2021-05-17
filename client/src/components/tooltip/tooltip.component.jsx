import React, {useState} from 'react';
import './tooltip.styles.css';

const Tooltip = ({tooltipText}) => <span className='tooltiptext top'>{tooltipText}</span>;

export default Tooltip;
