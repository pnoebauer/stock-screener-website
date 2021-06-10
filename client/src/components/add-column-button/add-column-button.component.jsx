// import React from 'react';

// import {connect} from 'react-redux';

// import {doSetColumns} from '../../redux/stockData/stockData.actions';

// import {GrSettingsOption} from 'react-icons/gr';

// import Modal from '../modal/modal.component';

// import IndicatorSelector from '../indicator-selector/indicator-selector.component';

// import Tooltip from '../tooltip/tooltip.component';

// // import {INDICATORS_TO_API, CUSTOM_INDICATORS} from '../../assets/constants';

// import {
// 	getUsedIndicators,
// 	getUnusedIndicators,
// } from '../../redux/stockData/stockData.selectors';

// import './add-column-button.styles.css';

// class AddColumnButton extends React.Component {
// 	constructor(props) {
// 		// console.log('constructor add')
// 		super(props);
// 		this.state = {
// 			visible: false,
// 		};
// 	}

// 	show = () => {
// 		this.setState({visible: true});
// 	};

// 	hide = () => {
// 		this.setState({visible: false});
// 	};

// 	deriveIndicatorsArr = indicators =>
// 		indicators.map((indicator, index) => ({
// 			name: indicator,
// 			id: indicator,
// 			selected: false,
// 		}));

// 	handleOkCancel = (type, updatedState) => {
// 		this.hide();
// 		if (type === 'ok') {
// 			const columnNames = updatedState.usedIndicators.map(item => {
// 				let config;

// 				// // !!!REQUIRES UPDATING - FOR NOW JUST SET TO THE DEFAULT CONFIGURATION
// 				// // !!!LATER ADD OPTION TO CHANGE THE SETTINGS WHEN ADDING THE COLUMN
// 				// if (Object.keys(CUSTOM_INDICATORS).includes(item.name)) {
// 				// 	config = CUSTOM_INDICATORS[item.name]; //!!!THIS LINE NEEDS TO BE REPLACED ONCE SETTINGS ARE ADDED
// 				// }

// 				return {
// 					name: item.name,
// 					config,
// 				};
// 			});

// 			const columns = updatedState.usedIndicators.map(item => item.name);
// 			this.props.updateColumns(columns);
// 		}
// 	};

// 	render() {
// 		const {usedIndicators, unUsedIndicators} = this.props;

// 		return (
// 			<>
// 				<button
// 					onClick={this.show}
// 					className='add-column-button tooltip'
// 					style={this.props.style}
// 				>
// 					<GrSettingsOption className='add-column-icon' />
// 					<Tooltip tooltipText={'Click to set indicators'} position={'center'} />
// 				</button>

// 				<Modal
// 					visible={this.state.visible}
// 					onClose={this.hide}
// 					width={60}
// 					height={50}
// 					measure={'%'}
// 					showCloseButton={false}
// 					closeOnEsc={false}
// 					closeMaskOnClick={false}
// 					duration={500}
// 				>
// 					<IndicatorSelector
// 						handleOkCancel={this.handleOkCancel}
// 						availableIndicatorsDefault={this.deriveIndicatorsArr(unUsedIndicators)}
// 						usedIndicatorsDefault={this.deriveIndicatorsArr(usedIndicators)}
// 					/>
// 				</Modal>
// 			</>
// 		);
// 	}
// }

// const mapDispatchToProps = dispatch => ({
// 	updateColumns: columnNames => dispatch(doSetColumns(columnNames)),
// });

// const mapStateToProps = state => ({
// 	usedIndicators: getUsedIndicators(state),
// 	unUsedIndicators: getUnusedIndicators(state),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(AddColumnButton);

import React from 'react';

import {connect} from 'react-redux';

import {doSetColumns} from '../../redux/stockData/stockData.actions';

import {GrSettingsOption} from 'react-icons/gr';

import Modal from '../portal-modal/modal.component';
// import Modal from '../modal/modal.component';

import IndicatorSelector from '../indicator-selector/indicator-selector.component';

import Tooltip from '../tooltip/tooltip.component';

import {
	getUsedIndicators,
	getUnusedIndicators,
} from '../../redux/stockData/stockData.selectors';

import './add-column-button.styles.css';

class AddColumnButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			inactive: false,
		};
	}

	show = () => {
		this.setState({visible: true, inactive: false});
	};

	hide = () => {
		this.setState({visible: false, inactive: false});
	};

	deriveIndicatorsArr = indicators =>
		indicators.map((indicator, index) => ({
			name: indicator,
			id: indicator,
			selected: false,
		}));

	handleOkCancel = (type, columns) => {
		//  required to achieve the fade out effect
		this.setState({inactive: true});

		const {updateColumns} = this.props;

		if (type === 'ok') {
			updateColumns(columns);
		}
	};

	render() {
		const {usedIndicators, unUsedIndicators} = this.props;

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

				{this.state.visible ? (
					<Modal
						inactive={this.state.inactive}
						style={{height: '60%', width: '50%'}}
						onClose={this.hide}
					>
						<IndicatorSelector
							handleOkCancel={this.handleOkCancel}
							availableIndicatorsDefault={this.deriveIndicatorsArr(unUsedIndicators)}
							usedIndicatorsDefault={this.deriveIndicatorsArr(usedIndicators)}
						/>
					</Modal>
				) : null}

				{/* <Modal
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
						availableIndicatorsDefault={this.deriveIndicatorsArr(unUsedIndicators)}
						usedIndicatorsDefault={this.deriveIndicatorsArr(usedIndicators)}
					/>
				</Modal> */}
			</>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	updateColumns: columnNames => dispatch(doSetColumns(columnNames)),
});

const mapStateToProps = state => ({
	usedIndicators: getUsedIndicators(state),
	unUsedIndicators: getUnusedIndicators(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddColumnButton);
