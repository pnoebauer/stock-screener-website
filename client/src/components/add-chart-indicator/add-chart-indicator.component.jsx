import React from 'react';

import {connect} from 'react-redux';

import {doAddChartIndicator} from '../../redux/chart/chart.actions';

// import {GrSettingsOption} from 'react-icons/gr';

// import Modal from '../portal-modal/modal.component';

// import IndicatorSelector from '../indicator-selector/indicator-selector.component';

import Tooltip from '../tooltip/tooltip.component';

// import {
// 	// getMainChartIndicatorList,
// 	// getSubChartIndicatorList,
// 	getUsedIndicators,
// 	getUnusedIndicators,
// } from '../../redux/chart/chart.selectors';

import './add-chart-indicator.styles.css';

import {CHART_INDICATORS} from '../../assets/constants';

const chartIndicatorsList = Object.keys(CHART_INDICATORS);

class AddChartIndicator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			shownValue: '',
			indicator: chartIndicatorsList[0],
		};
	}

	handleAddIndicator = e => {
		const {doAddIndicator} = this.props;
		const {indicator, shownValue} = this.state;

		doAddIndicator(indicator);
		// this.setState(
		// 	{
		// 		shownValue: '',
		// 		indicator: chartIndicatorsList[0],
		// 	},
		// 	() => console.log(this.state)
		// );
	};

	onChange = e => {
		// console.log(e.target.value, 'change');
		this.setState({shownValue: e.target.value});
	};

	onKeyUp = e => {
		// console.log(e.nativeEvent, this.state.shownValue, 'nativeEvent');
		// console.log(e.keyCode, 'target');

		if (e.nativeEvent.type === 'keyup' && e.keyCode === undefined) {
			// console.log('blurring');
			this.handleBlur(e);
		}

		if (e.keyCode === 13) {
			if (chartIndicatorsList.includes(this.state.shownValue)) {
				this.setState({indicator: this.state.shownValue});
				e.target.blur();
			}
		}
	};

	handleBlur = e => {
		e.preventDefault();

		// console.log('blur', this.state.shownValue);

		if (chartIndicatorsList.includes(this.state.shownValue)) {
			// console.log('exists click out');
			this.setState({indicator: this.state.shownValue});
			e.target.blur();
		} else {
			e.target.focus();
		}

		// console.log(e, 'blur');
	};

	render() {
		return (
			<div className='add-chart-indicators-container'>
				<input
					list='indicators'
					name='added-indicator'
					id='added-indicator'
					onChange={this.onChange}
					// placeholder={chartIndicatorsList[0]}
					placeholder={'Add chart indicator'}
					onKeyUp={this.onKeyUp}
					onBlur={this.handleBlur}
				/>
				<datalist id='indicators'>
					{chartIndicatorsList.map(indicatorName => (
						<option key={indicatorName} value={indicatorName}>
							{indicatorName}
						</option>
					))}
				</datalist>
				<button
					onClick={this.handleAddIndicator}
					className='add-indicator-button tooltip'
					// style={this.props.style}
				>
					{/* <GrSettingsOption className='chart-indicator-icon' /> */}
					+
					<Tooltip tooltipText={'Click to add indicator'} position={'left'} />
				</button>
			</div>
		);
	}
}

// export default AddChartIndicator;

const mapDispatchToProps = dispatch => ({
	doAddIndicator: indicatorType => dispatch(doAddChartIndicator(indicatorType)),
});

export default connect(null, mapDispatchToProps)(AddChartIndicator);

// const mapStateToProps = state => ({
// 	// mainIndicators: getMainChartIndicatorList(state),
// 	// subIndicators: getSubChartIndicatorList(state),
// 	usedIndicators: getUsedIndicators(state),
// 	unUsedIndicators: getUnusedIndicators(state),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(AddChartIndicator);
