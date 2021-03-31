import React from 'react';
import Modal from '../modal/modal.component';

import List from '../list/list.component';

import UniverseSelector from '../stock-universe-selector/stock-universe-selector.coponent';

import { UNIVERSES } from '../../assets/constants';

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
                    selected: false
                },
                {
                    id: 'NAS100',
                    name: 'NAS100',
                    selected: false
                },
                {
                    id: 'DJ30',
                    name: 'DJ30',
                    selected: false
                },
                // {
                //     id: 'NAS1003',
                //     name: 'NAS100',
                //     selected: false
                // },
                // {
                //     id: 'NAS1004',
                //     name: 'NAS100',
                //     selected: false
                // },
                // {
                //     id: 'NAS1005',
                //     name: 'NAS100',
                //     selected: false
                // },
                // {
                //     id: 'NAS1006',
                //     name: 'NAS100',
                //     selected: false
                // }
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

    handleAddClick = e => {
        this.hide();
        // const selectedUniverses = this.state.universes.filter(universe => universe.selected).map(universe => universe.name);
        const selectedUniverses = this.state.universes.flatMap(universe => universe.selected ? [universe.name] : []);
        // console.log(selectedUniverses,'selectedUniverses');

        const extractedSymbols = selectedUniverses.flatMap(universe => UNIVERSES[universe]);
        // console.log(extractedSymbols, 'extractedSymbols')

        this.props.handleUniverseAdd(extractedSymbols);

    }

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
                    height={40}
                    measure={'%'}
                    showCloseButton={true}
                    closeOnEsc={true}
                    closeMaskOnClick={false}
                    enterAnimation={'zoom'}
                    leaveAnimation={'zoom'}
                    duration={500}
                >
                    <UniverseSelector 
                        displayedItems={
                            this.state.universes
                        }
                        onToggle={this.onToggle}
                        onAdd={this.handleAddClick}
                    />
                </Modal>
            </>
        )
    }
}

export default AddStockUniverseButton;