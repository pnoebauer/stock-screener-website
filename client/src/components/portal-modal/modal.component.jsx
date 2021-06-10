// Modal.js
import React from 'react';

import Portal from './portal.component';

import './modal.styles.css';

const modalRoot = document.getElementById('modal');

class Modal extends React.Component {
	constructor(props) {
		super(props);

		this.popup = React.createRef();

		this.state = {
			active: false,
			inactive: false,
		};
	}

	componentDidMount() {
		window.addEventListener('keyup', this.keyHandler);

		// console.log(this.popup.current, this.popup, 'this.popup.current');
		this.popup.current.addEventListener('transitionend', this.transitionEnd);

		window.setTimeout(() => {
			document.activeElement.blur();
			this.setState({active: true});
			document.querySelector('#root').setAttribute('inert', 'true');
		}, 10);
	}

	transitionEnd = event => {
		if (this.props.inactive || this.state.inactive) {
			// console.log(
			// 	'called transitionEnd inactive',
			// 	event.propertyName,
			// 	event.propertyName === 'transform',
			// 	event.currentTarget,
			// 	event.target.className,
			// 	new Date().getTime()
			// );
			if (
				event.target.className === 'content modal-content' &&
				event.propertyName === 'transform'
			) {
				// console.log('END---------');
				this.props.onClose();
			}
		}
	};

	componentWillUnmount() {
		// console.log('unmounting');
		window.removeEventListener('keyup', this.keyHandler);

		if (this.popup) {
			this.popup.current.removeEventListener('transitionend', this.transitionEnd);
		}

		document.querySelector('#root').removeAttribute('inert');
	}

	keyHandler = event => {
		// console.log(event.keyCode, 'keys');

		if (event.keyCode === 27) {
			this.setState({inactive: true});
		}
	};

	render() {
		// console.log(this.state, 'set state');
		const {active} = this.state;
		const {inactive, children, style} = this.props;

		const inactiveStateOrProp = inactive || this.state.inactive;
		const activePopup = !inactiveStateOrProp && active;
		// console.log(active, inactiveStateOrProp, activePopup, 'active');

		return (
			<Portal parent={modalRoot}>
				<div
					ref={this.popup}
					className={`backdrop ${activePopup ? 'active' : ''}${
						inactiveStateOrProp ? 'inactive' : ''
					}`}
				>
					<div className='content modal-content' style={style}>
						{children}
					</div>
				</div>
			</Portal>
		);
	}
}
export default Modal;
