import React from 'react';
import Modal from '../modal/modal.component';

import IndicatorSelector from '../indicator-selector/indicator-selector.component';


const indicatorsMap = {
	'52 Week High': '52WkHigh',
	'52 Week Low': '52WkLow',
	'Ask Price': 'askPrice',
	'Ask Size': 'askSize',
	'Asset Type': 'assetType',
	'Bid Price': 'bidPrice',
	'Bid Size': 'bidSize',
	'Close Price': 'closePrice',
	'Dividend Amount': 'divAmount',
	'Dividend Date': 'divDate',
	'Dividend Yield': 'divYield',
	'Exchange': 'exchangeName',
	'High Price': 'highPrice',
	'Last Price': 'lastPrice',
	'Last Size': 'lastSize',
	'Low Price': 'lowPrice',
	'Mark': 'mark',
	'Mark Change': 'markChangeInDouble',
	'Mark Change (%)': 'markPercentChangeInDouble',
	'Net Asset Value': 'nAV',
	'Net Change': 'netChange',
	'Net Change (%)': 'netPercentChangeInDouble',
	'Open Price': 'openPrice',
	'PE Ratio': 'peRatio',
	'Volume': 'totalVolume',
	'Volatility': 'volatility' 
};

class AddColumnButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            visible: false,
            //TEMPORARY TO TEST PASSING OF STATE - REMOVE AFTERWARDS
            // availableIndicators: [
            //     {name: 'Price', id: 0, selected: false},
            //     {name: 'SMA', id: 1, selected: false}, 
            //     {name: 'EMA', id: 2, selected: false}, 
            //     {name: 'Open', id: 3, selected: true},
            //     {name: 'Close', id: 4, selected: false}
            // ],
            // usedIndicators: []
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
    

    //TEMPORARY METHOD TO TEST PASSING OF STATE - REMOVE AFTERWARDS
    handleOkCancel = (type, updatedState) => {
        this.hide();
        if(type === 'ok') {
            //USE THIS, REMOVE BELOW
            const columnNames = updatedState.usedIndicators.map(item => item.name);
            this.props.handleColumnUpdate(columnNames);

            // this.setState(updatedState
            //     ,
            //     () => {
            //         const columnNames = this.state.usedIndicators.map(item => item.name)
            //         // console.log(columnNames)
            //         this.props.handleColumnUpdate(columnNames);
            //     }
            // );
        }
    }

    render() {
        const { usedIndicators } = this.props;
        // console.log(this.deriveIndicatorsArr(usedIndicators))

        const availableIndicators = Object.keys(indicatorsMap).filter(value => !usedIndicators.includes(value));
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