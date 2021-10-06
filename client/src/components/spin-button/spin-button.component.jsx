import './spin-button.styles.css';

const SpinButton = ({defaultValue, handleChange, name}) => {
	return (
		// <div className='quantity'>
		// 	{/* <label>Main Chart Height</label> */}
		// 	{/* <label>Display</label> */}
		// 	<input
		// 		type='number'
		// 		min='100'
		// 		max='900'
		// 		step='1'
		// 		onChange={handleChange}
		// 		defaultValue={defaultValue}
		// 	/>
		// </div>

		<input
			type='number'
			min='50'
			max='900'
			step='1'
			onChange={handleChange}
			defaultValue={defaultValue}
			className='spinner'
			name={name}
		/>
	);
};

export default SpinButton;
