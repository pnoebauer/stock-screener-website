import React from 'react'

class Select extends React.Component {
    constructor(props) {
      const {options} = props;
      super(props);
      this.state = {
          value: options[0]
      };
    }
  
    handleChange = (event) => {
      this.setState({value: event.target.value});
        //update price data
        //...
    }
  
    render() {
      const {options} = this.props;
      // console.log(options)
      return (
        <select value={this.state.value} onChange={this.handleChange}>
            {options.map((value, index) => {
              return(
                <option 
                  value={value} 
                  key={index}
                >
                  {value}
                </option>
              )
            })}
        </select>
      );
    }
  }

export default Select;