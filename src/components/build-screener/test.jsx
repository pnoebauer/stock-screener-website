import React from 'react';

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

class Test extends React.Component {
  componentDidMount() {
    console.log('test mounted', this.props)
  }

    render() {
        console.log('props', this.props)
      return (
        <div className="">
          Test
          <button
            onClick={()=>this.props.onSort([5,8,1])}
          >
            Load data
          </button>
        </div>
      );
    }
  }

export default Test;