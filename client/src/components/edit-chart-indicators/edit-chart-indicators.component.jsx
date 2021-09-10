import React from 'react';

import {connect} from 'react-redux';

import {doSetIndicators} from '../../redux/chart/chart.actions';

import {GrSettingsOption} from 'react-icons/gr';

import Modal from '../portal-modal/modal.component';

import IndicatorSelector from '../indicator-selector/indicator-selector.component';

import Tooltip from '../tooltip/tooltip.component';

import {
	// getMainChartIndicatorList,
	// getSubChartIndicatorList,
	getUsedIndicators,
	getUnusedIndicators,
} from '../../redux/chart/chart.selectors';

import './edit-chart-indicators.styles.css';

class EditChartIndicatorsButton extends React.Component {
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
			name: indicator.toUpperCase(),
			id: `${indicator.toUpperCase()} ${index}`,
			key: `${indicator.toUpperCase()} ${index}`,
			selected: false,
		}));

	handleOkCancel = (type, indicatorList) => {
		//  required to achieve the fade out effect
		this.setState({inactive: true});

		console.log({indicatorList});

		const {doSetIndicators} = this.props;

		if (type === 'ok') {
			doSetIndicators(indicatorList);
		}
	};

	render() {
		// const {mainIndicators, subIndicators, usedIndicators, unUsedIndicators} = this.props;
		const {usedIndicators, unUsedIndicators} = this.props;
		// console.log({mainIndicators});
		// console.log({usedIndicators, unUsedIndicators});

		return (
			<>
				<button
					onClick={this.show}
					className='chart-indicator-button tooltip'
					// style={this.props.style}
				>
					<GrSettingsOption className='chart-indicator-icon' />
					<Tooltip tooltipText={'Click to edit indicators'} position={'center'} />
				</button>

				{this.state.visible ? (
					<Modal
						inactive={this.state.inactive}
						style={{height: '60%', width: '50%'}}
						onClose={this.hide}
					>
						<IndicatorSelector
							handleOkCancel={this.handleOkCancel}
							// availableIndicatorsDefault={this.deriveIndicatorsArr(mainIndicators)}
							// usedIndicatorsDefault={this.deriveIndicatorsArr(mainIndicators)}
							availableIndicatorsDefault={this.deriveIndicatorsArr(unUsedIndicators)}
							usedIndicatorsDefault={this.deriveIndicatorsArr(usedIndicators)}
						/>
					</Modal>
				) : null}
			</>
		);
	}
}

// export default EditChartIndicatorsButton;

const mapDispatchToProps = dispatch => ({
	doSetIndicators: indicatorList => dispatch(doSetIndicators(indicatorList)),
});

const mapStateToProps = state => ({
	// mainIndicators: getMainChartIndicatorList(state),
	// subIndicators: getSubChartIndicatorList(state),
	usedIndicators: getUsedIndicators(state),
	unUsedIndicators: getUnusedIndicators(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditChartIndicatorsButton);
