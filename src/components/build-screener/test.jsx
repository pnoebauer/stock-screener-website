import React from 'react';
import TestChild from './test-child';

// class Test extends React.Component {
//   componentDidMount() {
//     console.log('test mounted', this.props)
//   }

//     render() {
//         console.log('props', this.props)
//       return (
//         <div className="">
//           Test
//           <button
//             onClick={()=>this.props.fetchRealTimeData('https://api.tdameritrade.com/v1/marketdata/quotes','SPY')}
//           >
//             Load data
//           </button>
//         </div>
//       );
//     }
//   }

// class Test extends React.Component {
//   componentDidMount() {
//     // console.log('test mounted', this.props)
//   }

//     render() {
//         console.log('props', this.props,this.props.sortConfig,'this.props.sortConfig')
//       return (
//         <div className="">
//           Test
//           <button
//             onClick={(event)=>this.props.onSort(event,  {
//                             Symbol: ['GOOGL','AAPL','AMZN'],
//                             Interval: ['D','D','W'],
//                             Price: [100,5000,50]
//                         })
//             }
//             id='Price'
//           >
//             Load data
//           </button>
//         </div>
//       );
//     }
//   }

// export default Test;


class Test extends React.Component {
  componentDidMount() {
    // console.log('test mounted', this.props)
  }

  sortFromTest = (event) => {
        
    const sortedState = this.props.onSort(event,  {
        Symbol: ['GOOGL','AAPL','AMZN'],
        Interval: ['D','D','W'],
        Price: [100,5000,50]
    });
    // this.props.sortFromTest(event);

    console.log('sortedState',sortedState)
}

    render() {
        // console.log('props', this.props,this.props.sortConfig,'this.props.sortConfig')
      return (
        <div className="">
          Test
          <TestChild {...this.props} sortFromTest={this.sortFromTest}/>
        </div>
      );
    }
  }

export default Test;