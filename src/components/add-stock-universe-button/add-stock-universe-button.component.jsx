import React from 'react';
import Modal from '../modal/modal.component';

import List from '../list/list.component';

import { INDICATORS_TO_API } from '../../assets/constants';

import './add-stock-universe-button.styles.css';

class AddStockUniverseButton extends React.Component {

    constructor(props) {
        // console.log('constructor add')
        super(props);
        this.state = { 
            visible: false,
            universes: [
                {
                    id: 'SP500',
                    name: 'SP500',
                    selected: true
                },
                {
                    id: 'NAS100',
                    name: 'NAS100',
                    selected: false
                }
            ]
        };
    }

    show = () => {
        this.setState(prevState => ({ 
            visible: true,
            universes: prevState.universes.map(item => ({
                ...item,
                selected: false
            }))
        }));
    }

    hide = () => {
        this.setState({ visible: false });
    }

    onToggle = event => {
        const updatedID = event.target.id;

        this.setState(prevState => {
                return {
                    universes: prevState.universes.map(universe => {
                        if(universe.id === updatedID) {
                            return {
                                ...universe,
                                selected: !universe.selected
                            }
                        }
                        else {
                            return universe;
                        }
                    })
                }
        })
    }

    // handleOkCancel = (type, updatedState) => {
    //     this.hide();
    //     if(type === 'ok') {
    //         const columnNames = updatedState.usedIndicators.map(item => item.name);
    //         this.props.handleColumnUpdate(columnNames);
    //     }
    // }

    render() {

        return (
            <>
                <button 
                    onClick={this.show}
                    className="add-stock-universe-button" 
                    style={this.props.style}
                >
                    +
                </button>

                <Modal 
                    visible={this.state.visible} 
                    onClose={this.hide}
                    width={40}
                    height={30}
                    measure={'%'}
                    showCloseButton={true}
                    closeOnEsc={true}
                    closeMaskOnClick={false}
                    enterAnimation={'zoom'}
                    leaveAnimation={'zoom'}
                    duration={500}
                >
                    <List 
                        displayedItems={
                            this.state.universes
                        }
                        onToggle={this.onToggle}
                        className={'universes'}
                        headerName={'Universe'}
                        style={{width: '80%',marginTop: '20px'}}
                    />
                </Modal>
            </>
        )
    }
}

export default AddStockUniverseButton;