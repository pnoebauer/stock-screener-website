import React from 'react';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleString()
    };
  }

  //method that updates the time property of state to the current time
  tick() {
    this.setState({
      time: new Date().toLocaleString()
    });
  }

  //upon mounting setInterval to continuously call the tick method
  componentDidMount() {
      this.intervalId = setInterval(() => this.tick());
  }

  //upon unmounting remove setInterval to free memory
  componentWillUnmount() {
      clearInterval(this.intervalId);
  }

  render() {
    return (
      <p className="App-clock">
        The time is {this.state.time}.
      </p>
    );
  }
} 

export default Clock;