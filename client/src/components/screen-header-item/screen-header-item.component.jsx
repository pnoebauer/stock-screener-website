import React from 'react';

import Modal from '../modal/modal.component';

import IndicatorConfigurationForm from '../indicator-configuration-form/indicator-configuration-form.component';

import IntervalConfigurationForm from '../configure-all-intervals-form/configure-all-intervals-form.component';

import ConfigurationButton from '../configuration-button/configuration-button.component';

import IndicatorConfigurationDisplay from '../indicator-configuration-display/indicator-configuration-display.component';

import {CUSTOM_INDICATORS} from '../../assets/constants';

import './screen-header-item.styles.css';

class ScreenHeaderItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {visible: false};
	}

	show = () => this.setState({visible: true});

	hide = () => this.setState({visible: false});

	render() {
		const {
			gridColumn,
			onSort,
			id,
			className,
			updateCustomIndicators,
			setAllIntervals,
			headerName,
		} = this.props;

		return (
			<div
				style={{gridColumn}}
				onClick={onSort}
				id={id}
				className={className}
				name='screen-header'
			>
				<span id={id} name='screen-header'>
					{headerName}
				</span>
				{CUSTOM_INDICATORS[id] ? (
					<>
						<ConfigurationButton openConfigModal={this.show} tooltip={'indicator'} />

						<Modal
							visible={this.state.visible}
							onClose={this.hide}
							width={30}
							height={22}
							measure={'%'}
							showCloseButton={false}
							closeOnEsc={false}
							closeMaskOnClick={false}
						>
							<IndicatorConfigurationForm
								indicator={id}
								closeForm={this.hide}
								updateCustomIndicators={updateCustomIndicators}
							/>
						</Modal>

						<IndicatorConfigurationDisplay
							id={id}
							configuration={CUSTOM_INDICATORS[id]}
						/>
					</>
				) : null}
				{id === 'Interval' ? (
					<>
						<ConfigurationButton openConfigModal={this.show} tooltip={'interval'} />
						<Modal
							visible={this.state.visible}
							onClose={this.hide}
							width={30}
							height={15}
							measure={'%'}
							showCloseButton={false}
							closeOnEsc={false}
							closeMaskOnClick={false}
						>
							<IntervalConfigurationForm
								closeForm={this.hide}
								setAllIntervals={setAllIntervals}
							/>
						</Modal>
					</>
				) : null}
			</div>
		);
	}
}

export default ScreenHeaderItem;
