import React from 'react';
import Modal from '../modal/modal.component';

import IndicatorSelector from '../indicator-selector/indicator-selector.component';

import { INDICATORS_TO_API } from '../../assets/constants';

class AddColumnButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            visible: false
        };
    }

    show = () => {
        this.setState({ visible: true });
    }

    hide = () => {
        this.setState({ visible: false });
    }

    deriveIndicatorsArr = indicators => indicators.map((indicator, index) => ({
            name: indicator, id: indicator, selected: false
        })
    )
    

    handleOkCancel = (type, updatedState) => {
        this.hide();
        if(type === 'ok') {
            const columnNames = updatedState.usedIndicators.map(item => item.name);
            this.props.handleColumnUpdate(columnNames);
        }
    }

    render() {
        const { usedIndicators } = this.props;
        // console.log(this.deriveIndicatorsArr(usedIndicators))

        const availableIndicators = Object.keys(INDICATORS_TO_API).filter(value => !usedIndicators.includes(value));
        // console.log(availableIndicators,'k')

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
                        availableIndicators={this.deriveIndicatorsArr(availableIndicators)}
                        usedIndicators={this.deriveIndicatorsArr(usedIndicators)}
                    />
                </Modal>
            </>
        )
    }
}

export default AddColumnButton;