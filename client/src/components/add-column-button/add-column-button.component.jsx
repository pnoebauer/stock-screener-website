import React from 'react';

import {GrSettingsOption} from 'react-icons/gr';

import Modal from '../modal/modal.component';

import IndicatorSelector from '../indicator-selector/indicator-selector.component';

import Tooltip from '../tooltip/tooltip.component';

import {INDICATORS_TO_API, CUSTOM_INDICATORS} from '../../assets/constants';

import './add-column-button.styles.css';

class AddColumnButton extends React.Component {
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

	deriveIndicatorsArr = indicators =>
		indicators.map((indicator, index) => ({
			name: indicator,
			id: indicator,
			selected: false,
		}));

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
		const {usedIndicatorsDefault} = this.props;
		// console.log(this.deriveIndicatorsArr(usedIndicatorsDefault))

		const apiAndCustomIndicators = [
			...Object.keys(INDICATORS_TO_API),
			...Object.keys(CUSTOM_INDICATORS),
		];

		const availableIndicatorsDefault = apiAndCustomIndicators.filter(
			value => !usedIndicatorsDefault.includes(value)
		);

		return (
			<>
				<button
					onClick={this.show}
					className='add-column-button tooltip'
					style={this.props.style}
				>
					<GrSettingsOption className='add-column-icon' />
					<Tooltip tooltipText={'Click to set indicators'} position={'center'} />
				</button>

				<Modal
					visible={this.state.visible}
					onClose={this.hide}
					width={60}
					height={50}
					measure={'%'}
					showCloseButton={false}
					closeOnEsc={false}
					closeMaskOnClick={false}
					duration={500}
				>
					<IndicatorSelector
						handleOkCancel={this.handleOkCancel}
						availableIndicatorsDefault={this.deriveIndicatorsArr(
							availableIndicatorsDefault
						)}
						usedIndicatorsDefault={this.deriveIndicatorsArr(usedIndicatorsDefault)}
					/>
				</Modal>
			</>
		);
	}
}

export default AddColumnButton;
