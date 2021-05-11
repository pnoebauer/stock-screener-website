import React from 'react';

import Modal from '../modal/modal.component';

import IndicatorConfigurationForm from '../indicator-configuration-form/indicator-configuration-form.component';

import {CUSTOM_INDICATORS_C} from '../../assets/constants';

class ScreenHeaderItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {visible: false, ...CUSTOM_INDICATORS_C[this.props.id]};
	}

	show = () => {
		this.setState({visible: true});
	};

	hide = () => {
		this.setState({visible: false});
	};

	render() {
		const {
			gridColumn,
			onSort,
			id,
			className,
			updateCustomIndicators,
			children,
		} = this.props;
		// console.log(id, 'id', CUSTOM_INDICATORS_C[id], this.state);
		return (
			<>
				<div style={{gridColumn}} onClick={onSort} id={id} className={className}>
					{children}
					{CUSTOM_INDICATORS_C[id] ? (
						<button
							style={{
								position: 'absolute',
								top: '0px',
								right: '0px',
							}}
							onClick={this.show}
							name='configuration'
						>
							x
						</button>
					) : null}
				</div>
				{CUSTOM_INDICATORS_C[id] ? (
					<Modal
						visible={this.state.visible}
						onClose={this.hide}
						width={30}
						height={30}
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
				) : null}
			</>
		);
	}
}

export default ScreenHeaderItem;
