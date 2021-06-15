import React from 'react';

import {connect} from 'react-redux';

import {RiFilter2Line, RiFilter2Fill} from 'react-icons/ri';

import Modal from '../portal-modal/modal.component';

import FilterSymbolsForm from '../filter-symbols-form/filter-symbols-form.component';

import Tooltip from '../tooltip/tooltip.component';

import {getUsedIndicators} from '../../redux/stockData/stockData.selectors';
import {getFilterRulesNumber} from '../../redux/filtering/filtering.selectors';

import './filter-symbols-button.styles.css';

class FilterSymbolsButton extends React.Component {
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

	closeForm = () => {
		this.setState({inactive: true});
	};

	render() {
		const {usedIndicators, numberFilterRules} = this.props;

		return (
			<>
				<button
					onClick={this.show}
					className='filter-symbols-button tooltip'
					style={this.props.style}
				>
					{numberFilterRules ? (
						<RiFilter2Fill className='filter-symbols-icon' />
					) : (
						<RiFilter2Line className='filter-symbols-icon' />
					)}

					<Tooltip tooltipText={'Click to filter symbols'} position={' left'} />
				</button>

				{this.state.visible ? (
					<Modal
						inactive={this.state.inactive}
						style={{height: '50%', width: '50%'}}
						onClose={this.hide}
					>
						<FilterSymbolsForm
							usedIndicators={usedIndicators}
							closeForm={this.closeForm}
						/>
					</Modal>
				) : null}
			</>
		);
	}
}

const mapStateToProps = state => ({
	usedIndicators: getUsedIndicators(state),
	numberFilterRules: getFilterRulesNumber(state),
});

export default connect(mapStateToProps)(FilterSymbolsButton);
