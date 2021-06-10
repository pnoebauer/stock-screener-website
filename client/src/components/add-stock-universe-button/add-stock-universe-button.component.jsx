import React from 'react';

import {connect} from 'react-redux';

import {IoIosAddCircle} from 'react-icons/io';

// import Modal from '../modal/modal.component';
import Modal from '../portal-modal/modal.component';

import UniverseSelector from '../stock-universe-selector/stock-universe-selector.coponent';

import Tooltip from '../tooltip/tooltip.component';

import {UNIVERSES} from '../../assets/constants';

import './add-stock-universe-button.styles.css';
import {doAddUniverse} from '../../redux/stockData/stockData.actions';
import {getStockNumber} from '../../redux/stockData/stockData.selectors';

class AddStockUniverseButton extends React.Component {
	constructor(props) {
		// console.log('constructor add')
		super(props);
		this.state = {
			visible: false,
			inactive: false,
			universes: Object.keys(UNIVERSES).map(universe => ({
				id: universe,
				name: universe,
				selected: false,
			})),
		};
	}

	show = () => {
		this.setState(prevState => ({
			visible: true,
			inactive: false,
			universes: prevState.universes.map(item => ({
				...item,
				selected: false,
			})),
		}));
	};

	hide = () => {
		this.setState({visible: false, inactive: false});
	};

	onToggle = event => {
		const updatedID = event.target.id;

		this.setState(prevState => {
			return {
				universes: prevState.universes.map(universe => {
					if (universe.id === updatedID) {
						return {
							...universe,
							selected: !universe.selected,
						};
					} else {
						return universe;
					}
				}),
			};
		});
	};

	handleAddClick = e => {
		//  required to achieve the fade out effect
		this.setState({inactive: true});

		// const selectedUniverses = this.state.universes.filter(universe => universe.selected).map(universe => universe.name);
		const selectedUniverses = this.state.universes.flatMap(universe =>
			universe.selected ? [universe.name] : []
		);
		// console.log(selectedUniverses,'selectedUniverses');

		const addedStocks = selectedUniverses.flatMap(universe => UNIVERSES[universe]);
		// console.log(addedStocks, 'addedStocks')

		const {stockNumber} = this.props;

		this.props.addUniverse({addedStocks, stockNumber});
	};

	render() {
		return (
			<>
				<button
					onClick={this.show}
					className='add-stock-universe-button tooltip'
					style={this.props.style}
				>
					<IoIosAddCircle className='add-stock-universe-icon' />
					<Tooltip tooltipText={'Click to add stock universe'} position={'right'} />
				</button>

				{this.state.visible ? (
					<Modal
						inactive={this.state.inactive}
						style={{height: '40%', width: '40%'}}
						onClose={this.hide}
					>
						<UniverseSelector
							displayedItems={this.state.universes}
							onToggle={this.onToggle}
							onAdd={this.handleAddClick}
						/>
					</Modal>
				) : null}

				{/* <Modal
					visible={this.state.visible}
					onClose={this.hide}
					width={40}
					height={40}
					measure={'%'}
					showCloseButton={true}
					closeOnEsc={true}
					closeMaskOnClick={false}
					enterAnimation={'zoom'}
					leaveAnimation={'zoom'}
					duration={500}
				>
					<UniverseSelector
						displayedItems={this.state.universes}
						onToggle={this.onToggle}
						onAdd={this.handleAddClick}
					/>
				</Modal> */}
			</>
		);
	}
}

const mapStateToProps = state => ({
	stockNumber: getStockNumber(state),
});

const mapDispatchToProps = dispatch => ({
	addUniverse: stocks => dispatch(doAddUniverse(stocks)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddStockUniverseButton);
