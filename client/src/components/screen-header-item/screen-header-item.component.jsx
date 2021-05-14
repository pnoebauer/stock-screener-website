import React from 'react';

import {RiSettings5Fill} from 'react-icons/ri';

import Modal from '../modal/modal.component';

import IndicatorConfigurationForm from '../indicator-configuration-form/indicator-configuration-form.component';

import {CUSTOM_INDICATORS, API_TO_INDICATORS} from '../../assets/constants';

import './screen-header-item.styles.css';

class ScreenHeaderItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {visible: false, ...CUSTOM_INDICATORS[this.props.id]};
	}

	show = event => {
		event.preventDefault();
		event.stopPropagation();
		this.setState({visible: true});
	};

	hide = () => {
		this.setState({visible: false});
	};

	render() {
		const {gridColumn, onSort, id, className, updateCustomIndicators, children} =
			this.props;
		// console.log(id, 'id', CUSTOM_INDICATORS[id], this.state);
		console.log(children);
		return (
			<>
				<div style={{gridColumn}} onClick={onSort} id={id} className={className}>
					{/* <div style={{gridColumn}} className={className}> */}
					<span onClick={onSort} id={id}>
						{children}
					</span>
					{CUSTOM_INDICATORS[id] ? (
						<>
							<button
								onClick={this.show}
								// name='configuration'
								className='indicator-config-button'
								id={id}
							>
								<RiSettings5Fill className='indicator-config-icon' />
							</button>
							<div
								style={{
									position: 'absolute',
									// top: '0px',
									// left: '0px',
									bottom: '0px',
									right: '0px',
									fontSize: '80%',
									fontStyle: 'italic',
									// marginTop: '-5px',
								}}
								// name='configuration'
								onClick={onSort}
								id={id}
							>
								{`${API_TO_INDICATORS[CUSTOM_INDICATORS[id].parameter].replace(
									' Price',
									''
								)}-${CUSTOM_INDICATORS[id].lookBack}`}
							</div>
							{/* <span
								style={{
									position: 'absolute',
									bottom: '0px',
									left: '0px',
								}}
							>
								{CUSTOM_INDICATORS[id].lookBack}
							</span> */}
						</>
					) : null}
				</div>
				{CUSTOM_INDICATORS[id] ? (
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
