import React from 'react';
import Modal from '../modal/modal.component';

import IndicatorSelector from '../indicator-selector/indicator-selector.component';


class AddColumnButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            visible: false,
            //TEMPORARY TO TEST PASSING OF STATE - REMOVE AFTERWARDS
            availableIndicators: [
                {name: 'Price', id: 0, selected: false},
                {name: 'SMA', id: 1, selected: false}, 
                {name: 'EMA', id: 2, selected: false}, 
                {name: 'Open', id: 3, selected: true},
                {name: 'Close', id: 4, selected: false}
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
        if(type === 'ok') {
            this.setState(updatedState
                ,
                () => {
                    const columnNames = this.state.usedIndicators.map(item => item.name)
                    // console.log(columnNames)
                    this.props.handleColumnUpdate(columnNames);
                }
            );
        }
    }

    render() {
        return (
            <>
                <button 
                    onClick={this.show}
                    className="add-column-button" 
                    style={this.props.style}
                >
                    +
                </button>

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
            </>
        )
    }
}

export default AddColumnButton;