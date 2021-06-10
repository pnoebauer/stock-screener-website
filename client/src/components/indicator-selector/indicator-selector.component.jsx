import React from 'react';

import List from '../list/list.component';

import './indicator-selector.styles.css';

class IndicatorSelector extends React.Component {
	constructor(props) {
		super(props);
		// console.log('constructor IndicatorSelector', this.props)
		this.state = {
			availableIndicators: this.props.availableIndicatorsDefault,
			usedIndicators: this.props.usedIndicatorsDefault,
		};
	}

	onToggle = event => {
		const updatedID = event.target.id;
		const className = event.target.className;
		const indicatorListName = className.replace('selected', '').trim();

		this.setState(prevState => {
			const updated = prevState[indicatorListName].map(value => {
				if (updatedID === value.id) {
					return {
						...value,
						selected: !value.selected,
					};
				} else {
					return {
						...value,
					};
				}
			});
			return {
				[indicatorListName]: updated,
			};
		});
	};

	handleClick = event => {
		const type = event.target.className;

		const moveFrom = type === 'add' ? 'availableIndicators' : 'usedIndicators';
		const moveTo = type === 'add' ? 'usedIndicators' : 'availableIndicators';

		this.setState(
			prevState => {
				return {
					[moveFrom]: prevState[moveFrom]
						.filter(item => !item.selected)
						.map(item => ({...item, selected: false})),
					[moveTo]: [
						...prevState[moveTo],
						...prevState[moveFrom]
							.filter(item => item.selected)
							.map(item => ({...item, selected: false})),
					],
				};
			}
			// () => console.log()
		);
	};

	// NOT NEEDED ANYMORE BECAUSE PORTAL_MODAL IS NOW UNMOUNTED ONCE CLOSED AND STATE IS RESET
	// unSelect() {
	// 	this.setState({
	// 		availableIndicators: this.state.availableIndicators.map(item => ({
	// 			...item,
	// 			selected: false,
	// 		})),
	// 		usedIndicators: this.state.usedIndicators.map(item => ({...item, selected: false})),
	// 	});
	// }

	handleOk = () => {
		// console.log(this.state)
		// this.unSelect();

		const selectedIndicators = this.state.usedIndicators.map(item => item.name);
		// console.log(selectedIndicators, 'sel');
		// this.props.handleOkCancel('ok', this.state);

		this.props.handleOkCancel('ok', selectedIndicators);
	};

	handleCancel = () => {
		// const {handleOkCancel, ...priorState} = this.props;

		// // console.log(priorState, this.state)
		// const {availableIndicatorsDefault, usedIndicatorsDefault} = priorState;

		// this.setState(
		// 	{
		// 		availableIndicators: [
		// 			...this.state.availableIndicators.flatMap(item => []),
		// 			...availableIndicatorsDefault,
		// 		],
		// 		usedIndicators: [
		// 			...this.state.usedIndicators.flatMap(item => []),
		// 			...usedIndicatorsDefault,
		// 		],
		// 	}
		// 	// ,
		// 	// ()=>console.log(this.state,'s')
		// );

		// this.unSelect();
		this.props.handleOkCancel('cancel');
	};

	render() {
		// console.log(this.props.usedIndicatorsDefault, this.state.usedIndicators)
		return (
			<div className='indicator-selector'>
				<List
					displayedItems={this.state.availableIndicators}
					onToggle={this.onToggle}
					className='availableIndicators'
					headerName='Available Indicators'
				/>

				<div className='add-remove'>
					<button onClick={this.handleClick} className='add'>
						ADD
					</button>
					<button onClick={this.handleClick} className='remove'>
						REMOVE
					</button>
				</div>

				<List
					displayedItems={this.state.usedIndicators}
					onToggle={this.onToggle}
					className='usedIndicators'
					headerName='Used Indicators'
				/>

				<div className='ok-cancel'>
					<button className='cancel' onClick={this.handleCancel}>
						Cancel
					</button>
					<button className='ok' onClick={this.handleOk}>
						Okay
					</button>
				</div>
			</div>
		);
	}
}

export default IndicatorSelector;
