import './spin-button.styles.css';

const SpinButton = ({defaultValue, handleChange}) => {
	// const handleChange = e => {
	// 	console.log('change', e.target.value);
	// };
	return (
		<div className='quantity'>
			<input
				type='number'
				min='100'
				max='900'
				step='1'
				onChange={handleChange}
				defaultValue={defaultValue}
			/>
		</div>
	);
};

export default SpinButton;
