import React from 'react';

import IndicatorPopup from '../indicator-popup/indicator-popup.component';

class AddColumnButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false
        }
    }

    togglePopup = () => {
        this.setState(prevState => ({
            showPopup: !prevState.showPopup
        }))
    }

    render() {
        return (
            <>
                <>
                    <button 
                        className="add-column-button" 
                        style={{
                            gridColumn: 4,
                            width: '35px'
                        }}
                        onClick={this.togglePopup}
                    >
                        +
                    </button>
                </>
                {this.state.showPopup ? <IndicatorPopup /> : null}
            </>
        )
    }
}

export default AddColumnButton;