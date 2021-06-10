// Modal.js
import React from 'react';
import {createPortal} from 'react-dom';

// We get hold of the div with the id modal that we have created in index.html
const modalRoot = document.getElementById('modal');

class Portal extends React.Component {
	constructor(props) {
		super(props);

		const {children, parent, className} = this.props;

		this.target = parent && parent.appendChild ? parent : document.body;

		// We create an element div for this modal
		this.element = document.createElement('div');
	}

	// We append the created div to the div#modal
	componentDidMount() {
		const {children, parent, className} = this.props;

		const classList = ['portal-container'];
		if (className) className.split(' ').forEach(item => classList.push(item));
		classList.forEach(item => this.element.classList.add(item));

		this.target.appendChild(this.element);

		// modalRoot.appendChild(this.element);
	}
	/**
	 * We remove the created div when this Modal Component is unmounted
	 * Used to clean up the memory to avoid memory leak
	 */
	componentWillUnmount() {
		this.target.removeChild(this.element);
		// modalRoot.removeChild(this.element);
	}

	render() {
		return createPortal(this.props.children, this.element);
	}
}
export default Portal;
