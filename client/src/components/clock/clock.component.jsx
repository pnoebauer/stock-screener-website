import React from 'react';

class Clock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dateTime: this.convertDateTime()
    };
  }

  convertDateTime() {
    const {type} = this.props;

    if (type === 'time') {
        return new Date().toLocaleTimeString()
    }
    else {
        return new Date().toLocaleDateString()
    }
  }

  //method that updates the time property of state to the current time
  tick() {
    this.setState({
        dateTime: this.convertDateTime()
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
    const {dateTime} = this.state;
    return (
      <span>
          {dateTime}
      </span>
    );
  }
} 

export default Clock;