import React from 'react';

import IndicatorsList from '../indicators-list/indicators-list.component';

import './indicator-selector.styles.css';

class IndicatorSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availableIndicators: this.props.availableIndicators,
            usedIndicators: this.props.usedIndicators
        }
    }

    onToggle = event => {
        const updatedIndex = event.target.id;
        const className = event.target.className;
        const indicatorListName = className.replace('selected', '').trim()

        // console.log(indicatorListName);

        // console.log(className.includes('available-indicators'))

        //  METHOD 1 ------------------
        // this.setState(prevState => {
        //     const updatedIndicator = {
        //         ...prevState.availableIndicators[updatedIndex],
        //         selected: newSelect
        //     };
        //     return {
        //         availableIndicators: Object.assign([], prevState.availableIndicators, {[updatedIndex]: updatedIndicator})
        //     }
        // });
        // const updatedIndicator = {
        //     ...prevState.availableIndicators[updatedIndex],
        //     selected: newSelect
        // };
        // return {
        //     availableIndicators: Object.assign([], prevState.availableIndicators, {[updatedIndex]: updatedIndicator})
        // }
        //  METHOD 2 ------------------
        this.setState(prevState => {
            const updated = prevState[indicatorListName].map((value, index) => {
                if(updatedIndex==index) {
                    return {
                        ...value,
                        selected: !value.selected
                    };
                }
                else {
                    return {
                        ...value
                    };
                }
            });
            return {
                [indicatorListName]: updated
            }
        });
    }

    // onAdd = e => {
    //     this.setState(prevState => {            
    //         return {
    //             availableIndicators: 
    //                 prevState.availableIndicators.filter(item => !item.selected),
    //             usedIndicators: 
    //             [...prevState.usedIndicators,
    //                 ...prevState.availableIndicators.filter(item => item.selected).map(item => ({...item, selected: false}))
    //             ]
    //         }
    //     })
    // }

    // onRemove = e => {
    //     this.setState(prevState => {            
    //         return {
    //             usedIndicators: 
    //                 prevState.usedIndicators.filter(item => !item.selected),
    //             availableIndicators: 
    //             [...prevState.availableIndicators,
    //                 ...prevState.usedIndicators.filter(item => item.selected).map(item => ({...item, selected: false}))
    //             ]
    //         }
    //     })
    // }

    handleClick = event => {
        const type = event.target.className;
        
        const moveFrom = type === 'add' ? 'availableIndicators' : 'usedIndicators';
        const moveTo = type === 'add' ? 'usedIndicators' : 'availableIndicators';

        this.setState(prevState => {            
            return {
                [moveFrom]: 
                    prevState[moveFrom].filter(item => !item.selected).map(item => ({...item, selected: false})),
                [moveTo]: 
                    [
                        ...prevState[moveTo],
                        ...prevState[moveFrom].filter(item => item.selected).map(item => ({...item, selected: false}))
                    ]
            }
        })
    }
    
    unSelect() {
        this.setState({
            availableIndicators: this.state.availableIndicators.map(item => ({...item, selected: false})),
            usedIndicators: this.state.usedIndicators.map(item => ({...item, selected: false}))
        })
    }

    handleOk = () => {
        // console.log(this.state)
        this.unSelect();
        this.props.handleOkCancel('ok',this.state);
    }

    handleCancel = () => {
        const { handleOkCancel, ...priorState} = this.props;
        // console.log(priorState, this.state)

        this.setState(priorState);
        this.unSelect();
        this.props.handleOkCancel('cancel');
    }

    render() {
        return (
            <div className="indicator-selector">
                
                <IndicatorsList 
                    displayedIndicators={this.state.availableIndicators}
                    onToggle={this.onToggle}
                    className="availableIndicators"
                />
                
                <div className="add-remove">
                    <button 
                        onClick={this.handleClick}
                        className='add'
                    >
                        ADD
                    </button>
                    <button 
                        onClick={this.handleClick}
                        className='remove'
                    >
                        REMOVE
                    </button>
                </div>
                
                <IndicatorsList 
                    displayedIndicators={this.state.usedIndicators}
                    onToggle={this.onToggle}
                    className="usedIndicators"
                />

                <div className="ok-cancel">
                    <button 
                        className="cancel"
                        onClick={this.handleCancel}
                    >
                        Cancel
                    </button>
                    <button 
                        className="ok"
                        onClick={this.handleOk}
                    >
                        Okay
                    </button>  
                </div>
                
                
            </div>
            
        )
    }
}

export default IndicatorSelector;