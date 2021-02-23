import React from 'react'

import './dropdown.styles.css';

class Dropdown extends React.Component {
    constructor(props) {
      const {defaultValue} = props;
      super(props);
      this.state = {
          selectedValue: defaultValue,
          showList: false
      };
    }
    
    //on mounting add event listener to handle click outside the Custom Select Container
    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside);
    }

    //remove the event listner on component unmounting
    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }

    //if click happens outside the dropdown area close the list
    handleClickOutside = event => {
      if(
        !event.target.classList.contains('custom-select-option') && 
        !event.target.classList.contains('selected-text')
      ) {
        this.setState({
          showList: false
        });
      }
    }

    //handle the displaying of the list (if currently shown, then hide and vice versa)
    handleDisplay = () => {
      this.setState(prevState => ({
            showList: !prevState.showList
          })
      );
    };

    // set text based on click in displayed list
    handleOptionClick = event => {
      // console.log(event.target.getAttribute('value'))
      this.setState({
        selectedValue: event.target.getAttribute('value'),
        showList: false
      });
    };

  
    render() {
      const { options } = this.props;
      const { selectedValue, showList } = this.state;
      console.log('a',this.props)
      return (
        <div 
          className='custom-select-container'
          style={{ 
            gridRow: 2,
            gridColumn: 4,
          }}
        >
          <div 
            className={showList ? 'selected-text active' : 'selected-text'}
            onClick={this.handleDisplay}  
          >
            {selectedValue}
          </div>
            {showList && (<ul className='select-options'>
              {options.map((value, index) => {
                return(
                  <li 
                    className='custom-select-option'
                    value={value} 
                    key={index}
                    onClick={this.handleOptionClick}
                  >
                    {value}
                  </li>
                )
              })}
            </ul>)}
        </div>
      );
    }
  }

export default Dropdown;