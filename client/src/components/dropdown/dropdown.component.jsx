import React from 'react';

import {connect} from 'react-redux';

import {createStructuredSelector} from 'reselect';

// import {selectField} from '../../redux/stockData/stockData.selectors';
import {doSetInputField} from '../../redux/stockData/stockData.actions';

import {getField} from '../../redux/stockData/stockData.selectors';
// import {getColumn} from '../../redux/stockData/stockData.selectors';

import './dropdown.styles.css';

class Dropdown extends React.Component {
	constructor(props) {
		const {cellValue} = props;
		super(props);
		this.container = React.createRef();
		this.selectionDisplay = React.createRef();

		// console.log('ai', this.props.options.indexOf(cellValue), cellValue);
		// console.log(Math.max(this.props.options.indexOf(cellValue), 0), 'b');

		// this.state = {
		// 	showList: false,
		// 	displayedOptions: this.props.options,
		// 	shownValue: cellValue,
		// 	activeItem: this.props.options.indexOf(cellValue),
		// };

		// const newFilteredOptions = options.filter(item => {
		// 	return item.toLowerCase().indexOf(currentInput.toLowerCase()) === 0; //filter all with the same start
		// });

		const activeItem = this.props.options.indexOf(cellValue);
		// const displayedOptions = this.props.options.slice(activeItem, activeItem + 5);
		const displayedOptions = this.props.options;

		this.state = {
			showList: false,
			displayedOptions,
			shownValue: cellValue,
			activeItem,
		};
	}

	//if click happens outside the dropdown area close the list
	handleClickOutside = event => {
		const {
			updateInputField,
			headerName,
			options,
			onChange,
			gridColumn,
			gridRow,
			cellValue,
		} = this.props;

		const headerCol = gridColumn - 1;
		const valueRow = gridRow - 2;

		// container exists and the click (event.target) occurs outside that container
		if (this.container.current && !this.container.current.contains(event.target)) {
			let insertValue;

			this.setState(
				prevState => {
					// if the typed in value exists in the options list then use it,
					// if it does not exist replace it with the value that was in the cell before typing in
					insertValue = options.includes(prevState.shownValue)
						? prevState.shownValue
						: cellValue;

					return {
						showList: false,
						shownValue: insertValue,
					};
				},
				() => {
					if (this.selectionDisplay.current.innerText !== insertValue) {
						//happens if typed in text does not match anything
						this.selectionDisplay.current.innerText = insertValue;
						// this.setState(prevState => ({key: prevState.key+1}))
					}
					document.removeEventListener('mousedown', this.handleClickOutside);

					const fieldInfo = {value: insertValue, headerName, valueRow};
					// console.log(fieldInfo);

					updateInputField(fieldInfo);

					return onChange(insertValue, headerCol, valueRow);
				}
			);
		}
	};

	//handle the displaying of the list (if currently shown, then hide and vice versa)
	handleDisplay = (clickEvent, headerCol, valueRow) => {
		const {options, cellValue} = this.props;
		const {shownValue} = this.state;
		// comment if statement to allow closing the list even if value does not exist in options list
		if (options.includes(shownValue)) {
			this.setState(prevState => {
				if (!prevState.showList) {
					document.addEventListener('mousedown', this.handleClickOutside);
				} else if (prevState.showList) {
					document.removeEventListener('mousedown', this.handleClickOutside);
				}
				return {
					showList: !prevState.showList,
					activeItem: Math.max(prevState.displayedOptions.indexOf(cellValue), 0),
				};
			});
		}
	};

	// set text based on click in displayed list
	handleOptionClick = (event, headerCol, valueRow) => {
		const {updateInputField, headerName, onChange} = this.props;

		this.setState({
			showList: false,
			shownValue: event.target.innerText,
		});

		const fieldInfo = {value: event.target.innerText, headerName, valueRow};
		// console.log(fieldInfo);

		updateInputField(fieldInfo);

		onChange(event.target.innerText, headerCol, valueRow);

		// dispatch action !!!!
		// const fieldInfo = {value: event.target.innerText, headerCol, valueRow};
		// console.log(fieldInfo);

		if (this.selectionDisplay.current.innerText !== event.target.innerText) {
			// occurs when we type in, the text is not completed and then click on the same value that was in before
			// i.e. current value: Monthly,
			//      type in: Mon
			//      click on Monthly
			//  Because the state has not changed Mon will remain in the cell
			this.selectionDisplay.current.innerText = event.target.innerText;
			// this.setState(prevState => ({key: prevState.key+1}));
		}

		document.removeEventListener('mousedown', this.handleClickOutside);
		// onChange(event.target.innerText, headerCol, valueRow);
	};

	onTextChange = event => {
		const {options} = this.props;

		const currentInput = event.currentTarget.textContent;

		const newFilteredOptions = options.filter(item => {
			return item.toLowerCase().indexOf(currentInput.toLowerCase()) === 0; //filter all with the same start
		});

		this.setState({
			displayedOptions: newFilteredOptions,
			showList: true,
			shownValue: currentInput,
			activeItem: 0,
		});
	};

	onKeyDown = (event, headerCol, valueRow) => {
		// console.log('kd');
		const {onChange} = this.props;
		const {activeItem, displayedOptions} = this.state;

		switch (event.keyCode) {
			// down
			case 40:
				if (activeItem < displayedOptions.length - 1) {
					this.setState(prevState => {
						return {
							activeItem: prevState.activeItem + 1,
						};
					});
				}
				break;
			// up
			case 38:
				if (activeItem > 0) {
					this.setState(prevState => {
						return {
							activeItem: prevState.activeItem - 1,
						};
					});
				}
				break;
			// enter
			case 13:
				event.preventDefault();

				// console.log('enter', this.state);
				const {headerName, updateInputField} = this.props;

				this.setState(
					prevState => {
						const displayedValue = prevState.displayedOptions[prevState.activeItem];
						// console.log(
						// 	'displayedValue',
						// 	displayedValue,
						// 	prevState.displayedOptions,
						// 	prevState.activeItem
						// );

						return {
							activeItem: 0,
							showList: false,
							shownValue: displayedValue,
						};
					},
					() => {
						// console.log('A dd enter', this.state.shownValue, headerCol, valueRow);

						// console.log(
						// 	'this.selectionDisplay.current.innerText',
						// 	this.selectionDisplay.current.innerText
						// );
						if (this.selectionDisplay.current.innerText !== this.state.shownValue) {
							this.selectionDisplay.current.innerText = this.state.shownValue;
							// this.setState(prevState => ({key: prevState.key+1}));
						}

						const fieldInfo = {value: this.state.shownValue, headerName, valueRow};
						// console.log(fieldInfo);

						updateInputField(fieldInfo);

						// console.log('dd enter', this.state.shownValue, headerCol, valueRow);
						return onChange(this.state.shownValue, headerCol, valueRow);
					}
				);

				document.removeEventListener('mousedown', this.handleClickOutside);
				break;

			default:
		}
	};

	// componentDidMount() {
	// 	if (this.props.className === 'add-row') console.log(this.state, 'dd state');
	// }

	componentDidUpdate(prevProps) {
		// if (this.props.className === 'add-row')
		// 	console.log('updated child', this.props.cellValue, prevProps.cellValue);
		if (prevProps.cellValue !== this.props.cellValue) {
			const activeItem = this.props.options.indexOf(this.props.cellValue);
			// const displayedOptions = this.props.options.slice(activeItem, activeItem + 5);

			this.setState(
				// {activeItem, displayedOptions, shownValue: this.props.cellValue},
				{activeItem, shownValue: this.props.cellValue}
				// () => {
				// 	if (this.props.className === 'add-row')
				// 		console.log(this.state, 'upated dd state');
				// }
			);
		}
	}

	render() {
		const {gridRow, gridColumn, customStyles, className, cellValue} = this.props;
		const {showList, displayedOptions, activeItem} = this.state;

		// console.log(this.props.cellValue, 'redux cellValue', gridRow);

		// console.log(displayedOptions, 'displayedOptions', showList);
		// console.log(
		// 	'activeItem',
		// 	activeItem,
		// 	displayedOptions[activeItem],
		// 	cellValue,
		// 	this.state.shownValue
		// );

		// if (this.props.className === 'add-row') console.log(cellValue, 'cellValue');

		let number = displayedOptions.length;
		number = number > 5 ? 5 : number < 1 ? 1 : number;

		const dropDownHeight = `${number * 100}%`;
		const liHeight = `calc(${(1 / number) * 100}% - 1px)`;

		return (
			<div
				className={'dropdown-container'}
				style={{
					...customStyles,
					gridRow,
					gridColumn: `${gridColumn + 1}`,
				}}
				ref={this.container}
			>
				<div
					className={`selected-value ${this.props.className} ${showList ? 'active' : ''}`}
					onClick={clickEvent =>
						this.handleDisplay(clickEvent, gridColumn - 1, gridRow - 2)
					}
					onKeyDown={e => this.onKeyDown(e, gridColumn - 1, gridRow - 2)}
					// contentEditable='true'
					// contentEditable={`${this.props.contentEditable === false ? 'false' : 'true'}`}
					contentEditable={`${this.props.contentEditable ?? 'true'}`}
					suppressContentEditableWarning={true}
					onInput={this.onTextChange}
					ref={this.selectionDisplay}
					// key={key}
				>
					{cellValue}
				</div>

				{showList && (
					<ul className={`options-list`} style={{height: dropDownHeight}}>
						{displayedOptions.map((value, index) => {
							// exclude the selectedValue from dropdown list options
							// except if the shownValue is different to the selectedValue (happens if user types into search field)
							// if(value !== selectedValue || shownValue !== selectedValue) {
							return (
								<li
									style={{height: liHeight}}
									// className={`dropdown-option ${className} ${
									// 	index === activeItem ? 'active' : ''
									// }`}
									className={`dropdown-option ${className}${
										index === activeItem && this.props.contentEditable !== false
											? ' active'
											: ''
									}`}
									value={value}
									key={index}
									onClick={e => this.handleOptionClick(e, gridColumn - 1, gridRow - 2)}
								>
									{value}
								</li>
							);
							// }
							//   else return null;
						})}
					</ul>
				)}
			</div>
		);
	}
}

Dropdown.defaultProps = {
	className: '',
	customStyles: {},
};

// const mapStateToProps = (state, {headerName, gridRow, className}) => {
// 	// console.log(state, headerName, gridRow - 2, className, 'state,ownProps');
// 	const cellValue =
// 		(state.stockData[headerName] && state.stockData[headerName][gridRow - 2]) ?? 0;

// 	// const cellValue = className ? 0 : state.stockData[headerName][gridRow - 2];

// 	return {
// 		cellValue,
// 	};
// };

// const mapStateToProps = (state, {headerName, gridRow}) => ({
// 	cellValue: selectField({headerName, index: gridRow - 2})(state),
// });

const mapStateToProps = (state, {headerName, gridRow}) => {
	const index = gridRow - 2;
	// console.log(
	// 	headerName,
	// 	gridRow,
	// 	'headerName, gridRow',
	// 	getField(state, headerName, index)
	// );
	return {
		cellValue: getField(state, headerName, index),
	};
};

const mapDispatchToProps = dispatch => ({
	updateInputField: fieldInfo => dispatch(doSetInputField(fieldInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dropdown);
// export default Dropdown;
