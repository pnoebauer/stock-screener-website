import React from 'react';

import {IoFilterCircle} from 'react-icons/io5';

import Modal from '../modal/modal.component';

import FilterSymbolsForm from '../filter-symbols-form/filter-symbols-form.component';

import Tooltip from '../tooltip/tooltip.component';

import {INDICATORS_TO_API, CUSTOM_INDICATORS} from '../../assets/constants';

import './filter-symbols-button.styles.css';

class FilterSymbolsButton extends React.Component {
	constructor(props) {
		// console.log('constructor add')
		super(props);
		this.state = {
			visible: false,
		};
	}

	show = () => {
		this.setState({visible: true});
	};

	hide = () => {
		this.setState({visible: false});
	};

	// deriveIndicatorsArr = indicators =>
	// 	indicators.map((indicator, index) => ({
	// 		name: indicator,
	// 		id: indicator,
	// 		selected: false,
	// 	}));

	handleOkCancel = (type, updatedState) => {
		this.hide();
		if (type === 'ok') {
			const columnNames = updatedState.usedIndicators.map(item => {
				let config;

				// !!!REQUIRES UPDATING - FOR NOW JUST SET TO THE DEFAULT CONFIGURATION
				// !!!LATER ADD OPTION TO CHANGE THE SETTINGS WHEN ADDING THE COLUMN
				if (Object.keys(CUSTOM_INDICATORS).includes(item.name)) {
					config = CUSTOM_INDICATORS[item.name]; //!!!THIS LINE NEEDS TO BE REPLACED ONCE SETTINGS ARE ADDED
				}

				return {
					name: item.name,
					config,
				};
			});
			this.props.handleColumnUpdate(columnNames);
		}
	};

	render() {
		const {usedIndicators} = this.props;
		// // console.log(this.deriveIndicatorsArr(usedIndicatorsDefault))

		// const apiAndCustomIndicators = [
		// 	...Object.keys(INDICATORS_TO_API),
		// 	...Object.keys(CUSTOM_INDICATORS),
		// ];

		// const availableIndicatorsDefault = apiAndCustomIndicators.filter(
		// 	value => !usedIndicatorsDefault.includes(value)
		// );

		return (
			<>
				<button
					onClick={this.show}
					className='filter-symbols-button tooltip'
					style={this.props.style}
				>
					<IoFilterCircle className='filter-symbols-icon' />
					<Tooltip tooltipText={'Click to filter symbols'} position={'center'} />
				</button>

				<Modal
					visible={this.state.visible}
					onClose={this.hide}
					width={60}
					height={50}
					measure={'%'}
					showCloseButton={true}
					closeOnEsc={false}
					closeMaskOnClick={false}
					duration={500}
				>
					<FilterSymbolsForm usedIndicators={usedIndicators} closeForm={this.hide} />
				</Modal>
			</>
		);
	}
}

export default FilterSymbolsButton;
