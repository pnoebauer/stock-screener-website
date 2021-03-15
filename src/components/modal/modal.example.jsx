import React from 'react';
import Modal from './modal.component';

import IndicatorSelector from '../indicator-selector/indicator-selector.component';

// include styles
import './modal.styles.css';

class ModalExample extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            visible: false,
            //TEMPORARY TO TEST PASSING OF STATE - REMOVE AFTERWARDS
            availableIndicators: [
                {name: 'SMA', id: 0, selected: false}, 
                {name: 'EMA', id: 1, selected: false}, 
                {name: 'Open', id: 2, selected: true},
                {name: 'Close', id: 3, selected: false}
            ],
            usedIndicators: []
        };
    }

    show = () => {
        this.setState({ visible: true });
    }

    hide = () => {
        this.setState({ visible: false });
    }

    //TEMPORARY METHOD TO TEST PASSING OF STATE - REMOVE AFTERWARDS
    handleOkCancel = (type, updatedState) => {
        this.hide();
        if(type === 'ok') this.setState(updatedState);
    }

    render() {
        return (
            <div>
                <button onClick={this.show}>show</button>

                <Modal 
                    visible={this.state.visible} 
                    onClose={this.hide}
                    width={60}
                    height={50}
                    measure={'%'}
                    showCloseButton={false}
                    closeOnEsc={false}
                    closeMaskOnClick={false}
                >
                    <IndicatorSelector 
                        handleOkCancel={this.handleOkCancel}
                        availableIndicators={this.state.availableIndicators}
                        usedIndicators={this.state.usedIndicators}
                    />
                </Modal>
            </div>
        )
    }
}

export default ModalExample;