import React from 'react';

import {connect} from 'react-redux';

import {doSetSortingConfiguration} from '../../redux/sorting/sorting.actions';

import Modal from '../portal-modal/modal.component';
// import Modal from '../modal/modal.component';

import IndicatorConfigurationForm from '../indicator-configuration-form/indicator-configuration-form.component';

import IntervalConfigurationForm from '../configure-all-intervals-form/configure-all-intervals-form.component';

import ConfigurationButton from '../configuration-button/configuration-button.component';

import IndicatorConfigurationDisplay from '../indicator-configuration-display/indicator-configuration-display.component';

import {CUSTOM_INDICATORS} from '../../assets/constants';

import './screen-header-item.styles.css';

class ScreenHeaderItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {visible: false, inactive: false};
	}

	show = () => this.setState({visible: true, inactive: false});

	hide = () => this.setState({visible: false, inactive: false});

	//  required to achieve the fade out effect
	closeForm = () => this.setState({inactive: true});

	sorting = e => {
		// e.preventDefault();
		// e.stopPropagation();
		if (e.currentTarget.getAttribute('name') !== e.target.getAttribute('name')) {
			return;
		}
		// console.log(
		// 	e.currentTarget.getAttribute('name'),
		// 	e.target.getAttribute('name'),
		// 	e.currentTarget.getAttribute('name') === e.target.getAttribute('name'),
		// 	'sort'
		// );
		this.props.setSorting(this.props.headerName);
		// return this.props.onSort(e);
	};

	render() {
		const {
			gridColumn,
			// onSort,
			// id,
			className,
			// updateCustomIndicators,
			// setAllIntervals,
			headerName,
		} = this.props;

		// console.log(id, CUSTOM_INDICATORS[id], 'id');

		return (
			<div
				style={{gridColumn}}
				// onClick={onSort}
				onClick={this.sorting}
				id={headerName}
				className={className}
				name='screen-header'
			>
				<span id={headerName} name='screen-header'>
					{headerName}
				</span>
				{CUSTOM_INDICATORS[headerName] ? (
					<>
						<ConfigurationButton openConfigModal={this.show} tooltip={'indicator'} />

						{/* <Modal
							visible={this.state.visible}
							onClose={this.hide}
							width={30}
							height={30}
							measure={'%'}
							showCloseButton={false}
							closeOnEsc={false}
							closeMaskOnClick={false}
							// showMask={false}
						>
							<IndicatorConfigurationForm indicator={headerName} closeForm={this.hide} />
						</Modal> */}
						{this.state.visible ? (
							<Modal
								inactive={this.state.inactive}
								style={{height: '30%', width: '30%'}}
								onClose={this.hide}
							>
								<IndicatorConfigurationForm
									indicator={headerName}
									// closeForm={this.hide}
									closeForm={this.closeForm}
								/>
							</Modal>
						) : null}

						<IndicatorConfigurationDisplay indicator={headerName} />
					</>
				) : null}
				{headerName === 'Interval' ? (
					<>
						<ConfigurationButton openConfigModal={this.show} tooltip={'interval'} />

						{this.state.visible ? (
							<Modal
								inactive={this.state.inactive}
								style={{height: '30%', width: '15%'}}
								onClose={this.hide}
							>
								<IntervalConfigurationForm closeForm={this.closeForm} />
							</Modal>
						) : null}

						{/* <Modal
							visible={this.state.visible}
							onClose={this.hide}
							width={30}
							height={15}
							measure={'%'}
							showCloseButton={false}
							closeOnEsc={false}
							closeMaskOnClick={false}
						>
							<IntervalConfigurationForm closeForm={this.hide} />
						</Modal> */}
					</>
				) : null}
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	setSorting: headerName => dispatch(doSetSortingConfiguration(headerName)),
});

export default connect(null, mapDispatchToProps)(ScreenHeaderItem);
