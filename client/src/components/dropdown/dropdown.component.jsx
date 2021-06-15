import React from 'react';

import {connect} from 'react-redux';

import {doSetInputField, doAddRow} from '../../redux/stockData/stockData.actions';

import './dropdown.styles.css';

class Dropdown extends React.Component {
	constructor(props) {
		const {children} = props;
		super(props);
		this.container = React.createRef();
		this.selectionDisplay = React.createRef();

		const activeItem = this.props.options.indexOf(children);

		const displayedOptions = this.props.options;

		this.state = {
			showList: false,
			displayedOptions,
			shownValue: children,
			activeItem,
		};
	}

	//if click happens outside the dropdown area close the list
	handleClickOutside = event => {
		const {updateInputField, options, children} = this.props;

		// container exists and the click (event.target) occurs outside that container
		if (this.container.current && !this.container.current.contains(event.target)) {
			let insertValue;

			this.setState(
				prevState => {
					// if the typed in value exists in the options list then use it,
					// if it does not exist replace it with the value that was in the cell before typing in
					insertValue = options.includes(prevState.shownValue)
						? prevState.shownValue
						: children;

					return {
						showList: false,
						shownValue: insertValue,
					};
				},
				() => {
					if (this.selectionDisplay.current.innerText !== insertValue) {
						//happens if typed in text does not match anything
						this.selectionDisplay.current.innerText = insertValue;
					}
					document.removeEventListener('mousedown', this.handleClickOutside);

					updateInputField(insertValue);
				}
			);
		}
	};

	//handle the displaying of the list (if currently shown, then hide and vice versa)
	handleDisplay = () => {
		const {options, children} = this.props;
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
					activeItem: Math.max(prevState.displayedOptions.indexOf(children), 0), //if the value (=children) exists in the list set the activeItem to it, otherwise to the first item in the list
				};
			});
		}
	};

	// set text based on click in displayed list
	handleOptionClick = event => {
		const {updateInputField} = this.props;

		this.setState({
			showList: false,
			shownValue: event.target.innerText,
		});

		updateInputField(event.target.innerText);

		if (this.selectionDisplay.current.innerText !== event.target.innerText) {
			// occurs when we type in, the text is not completed and then click on the same value that was in before
			// i.e. current value: Monthly,
			//      type in: Mon
			//      click on Monthly
			//  Because the state has not changed Mon will remain in the cell
			this.selectionDisplay.current.innerText = event.target.innerText;
		}

		document.removeEventListener('mousedown', this.handleClickOutside);
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

	onKeyDown = event => {
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
				const {updateInputField} = this.props;

				this.setState(
					prevState => {
						const displayedValue = prevState.displayedOptions[prevState.activeItem];

						return {
							activeItem: 0,
							showList: false,
							shownValue: displayedValue,
						};
					},
					() => {
						if (this.selectionDisplay.current.innerText !== this.state.shownValue) {
							this.selectionDisplay.current.innerText = this.state.shownValue;
						}

						updateInputField(this.state.shownValue);
					}
				);

				document.removeEventListener('mousedown', this.handleClickOutside);
				break;

			default:
		}
	};

	componentDidUpdate(prevProps) {
		if (prevProps.children !== this.props.children) {
			const activeItem = this.props.options.indexOf(this.props.children);

			this.setState({activeItem, shownValue: this.props.children});
		}
	}

	render() {
		const {gridRow, gridColumn, customStyles, className, children} = this.props;
		const {showList, displayedOptions, activeItem} = this.state;

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
					gridColumn,
				}}
				ref={this.container}
			>
				<div
					className={`selected-value ${this.props.className} ${showList ? 'active' : ''}`}
					onClick={this.handleDisplay}
					onKeyDown={this.onKeyDown}
					contentEditable='true'
					// contentEditable={`${this.props.contentEditable ?? 'true'}`}
					suppressContentEditableWarning={true}
					onInput={this.onTextChange}
					ref={this.selectionDisplay}
				>
					{children}
				</div>

				{showList && (
					<ul className={`options-list`} style={{height: dropDownHeight}}>
						{displayedOptions.map((value, index) => {
							return (
								<li
									style={{height: liHeight}}
									className={`dropdown-option ${className}${
										index === activeItem && this.props.contentEditable !== false
											? ' active'
											: ''
									}`}
									value={value}
									key={index}
									onClick={this.handleOptionClick}
								>
									{value}
								</li>
							);
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

const mapDispatchToProps = (dispatch, {className, headerName, stockDataIdx}) => {
	const action = className === 'add-row' ? doAddRow : doSetInputField;

	return {
		updateInputField: value =>
			dispatch(action({value, headerName, valueRow: stockDataIdx})),
	};
};

export default connect(null, mapDispatchToProps)(Dropdown);
