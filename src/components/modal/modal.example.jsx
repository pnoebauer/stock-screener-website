import React from 'react';
import Modal from './modal.component';

// include styles
import './modal.styles.css';

class ModalExample extends React.Component {

    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    render() {
        return (
            <div>
                <button onClick={this.show.bind(this)}>show</button>

                <Modal 
                    visible={this.state.visible} 
                    onClose={this.hide.bind(this)}
                >
                    <div>Content</div>
                </Modal>
            </div>
        )
    }
}

export default ModalExample;