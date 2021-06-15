import React from 'react';

import {connect} from 'react-redux';

import {doSetSortingConfiguration} from '../../redux/sorting/sorting.actions';

import Modal from '../portal-modal/modal.component';

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
		// only if the main cell was clicked (not the button) sort
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
	};

	render() {
		const {gridColumn, className, headerName} = this.props;

		return (
			<div
				style={{gridColumn}}
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

						{this.state.visible ? (
							<Modal
								inactive={this.state.inactive}
								style={{height: '30%', width: '30%'}}
								onClose={this.hide}
							>
								<IndicatorConfigurationForm
									indicator={headerName}
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
