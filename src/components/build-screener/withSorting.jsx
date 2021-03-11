import React from 'react';

function withSorting(WrappedComponent) {
    class WithSorting extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                sortConfig: {}
            };
        }

        sortTable = (tableObject, sortedField, direction) => {
            // console.log('sort')
	
            const stateClone = JSON.parse(JSON.stringify(tableObject));
            delete stateClone.header;
            delete stateClone.sortConfig;
            
            // console.log(stateClone,'stateClone orig');
            const list = [...stateClone[sortedField]];
            
            // console.log(list);
        
            // temporary array holds objects with position and sort-value
            const mapped = list.map((value, index) => {
                if(typeof(value) ==='string') value = value.toLowerCase();
                  
                return { 
                      index, 
                      value 
                    };
                }
            );
        
            // console.log(mapped);
        
            // sorting the mapped array containing the reduced values
            mapped.sort((a, b) => {
                if (a.value > b.value) {
                    return direction;
                }
                if (a.value < b.value) {
                    return -direction;
                }
                return 0;
            });
        
            // console.log(mapped);
            // table headers (Symbol, Interval, Price, ...)
            const columnHeaders = Object.keys(stateClone);
        
            // loop over each header and resort its rows based on mapped array
            columnHeaders.forEach(column => {
                // reorders the current column based on the resorted list (stored in mapped)
                stateClone[column] = mapped.map(element => stateClone[column][element.index]);
                // console.log(stateClone[column],'mapped')
                // console.log(stateClone,'stateClone')
            })
        
            // console.log(stateClone,'stateClone fin')
        
            return stateClone;
        }

        onSort = (event, state) => {
            const { sortConfig } = this.state;
            // console.log('click',event.target.id)
            // console.log('click',event.target.id, list)
            
            const sortedField = event.target.id;
            // // const list = [...this.state[sortedField]]
    
            let direction = 1;
    
            if(sortConfig.sortedField === sortedField) {
                if(sortConfig.direction === direction) {
                    direction = -1;
                }
            }
    
            // const sortedData = sortTable(this.state, sortedField, direction);
            const sortedData = this.sortTable(state, sortedField, direction);
            // this.setState(sortedData);
        
            this.setState({
                sortConfig: {
                    sortedField,
                    direction
                }
            });

            return sortedData;
    
        }

        render() {
            return (
                <WrappedComponent onSort={this.onSort} {...this.state} {...this.props}/>
            )
        }
    }
    return WithSorting;
}

export default withSorting;