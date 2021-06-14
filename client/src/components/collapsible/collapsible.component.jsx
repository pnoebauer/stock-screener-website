import React from 'react';

import './collapsible.styles.css';

class Collapsible extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}

	togglePanel = e => {
		this.setState({open: !this.state.open});
	};

	render() {
		return (
			<>
				<div
					className={`collapsible-header ${this.state.open ? 'active' : ''}`}
					onClick={this.togglePanel}
				>
					{this.props.title}
				</div>
				{this.state.open ? (
					<div className='collapsible-content'>{this.props.children}</div>
				) : null}
			</>
		);
	}
}

export default Collapsible;
