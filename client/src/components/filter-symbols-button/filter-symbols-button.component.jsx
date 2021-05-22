import React from 'react';

import {RiFilter2Line, RiFilter2Fill} from 'react-icons/ri';

import Modal from '../modal/modal.component';

import FilterSymbolsForm from '../filter-symbols-form/filter-symbols-form.component';

import Tooltip from '../tooltip/tooltip.component';

import './filter-symbols-button.styles.css';

class FilterSymbolsButton extends React.Component {
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

	render() {
		const {usedIndicators, updateFilterRules} = this.props;

		return (
			<>
				<button
					onClick={this.show}
					className='filter-symbols-button tooltip'
					style={this.props.style}
				>
					{this.props.emptyFilter ? (
						<RiFilter2Line className='filter-symbols-icon' />
					) : (
						<RiFilter2Fill className='filter-symbols-icon' />
					)}

					<Tooltip tooltipText={'Click to filter symbols'} position={'center'} />
				</button>

				<Modal
					visible={this.state.visible}
					onClose={this.hide}
					width={50}
					height={50}
					measure={'%'}
					showCloseButton={true}
					closeOnEsc={false}
					closeMaskOnClick={false}
					duration={500}
				>
					<FilterSymbolsForm
						updateFilterRules={updateFilterRules}
						usedIndicators={usedIndicators}
						closeForm={this.hide}
					/>
				</Modal>
			</>
		);
	}
}

export default FilterSymbolsButton;
