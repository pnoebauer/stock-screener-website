import React from 'react';

class TestChild extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

    sortFromChild = (event) => {
        
        // const sortedState = this.props.onSort(event,  {
        //     Symbol: ['GOOGL','AAPL','AMZN'],
        //     Interval: ['D','D','W'],
        //     Price: [100,5000,50]
        // });
        this.props.sortFromTest(event);

        // console.log('sortedState',sortedState)
    }

    handleClick() {
      console.log('Click happened');
    }
  
      render() {
          console.log('props', this.props,this.props.sortConfig,'this.props.sortConfig')
        return (
            <button
              // onClick={(event) => this.sortFromChild(event)}
              // onClick={() => this.handleClick()}
              onClick={this.handleClick}
              id='Price'
            >
              Load data
            </button>
        );
      }
    }
  
  export default TestChild;