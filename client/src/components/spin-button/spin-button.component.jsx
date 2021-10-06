import Tooltip from '../tooltip/tooltip.component';

import './spin-button.styles.css';

const SpinButton = ({defaultValue, handleChange, name, chartName}) => {
	return (
		<div className='spinner-container tooltip'>
			<Tooltip tooltipText={`Adjust ${chartName} chart`} position={'center'} />
			<input
				type='number'
				min='50'
				max='900'
				step='1'
				onChange={handleChange}
				defaultValue={defaultValue}
				className='spinner '
				name={name}
			/>
		</div>
	);
};

export default SpinButton;
