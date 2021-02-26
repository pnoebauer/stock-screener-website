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
        !event.target.classList.contains('dropdown-option') && 
        !event.target.classList.contains('selected-value')
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
            // showList: false
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
      const { options, style, className } = this.props;
      const { selectedValue, showList } = this.state;
      // console.log('a',this.props)
      return (
        <div 
          className={'dropdown-container'}
          style={{ 
            gridRow: style.gridRow,
            gridColumn: style.gridColumn,
          }}
        >
          <div 
            className={showList ? 'selected-value active' : 'selected-value'}
            onClick={this.handleDisplay}  
          >
            {selectedValue}
          </div>
            {showList && (<ul className='options-list'>
              {options.map((value, index) => {
                if(value !== selectedValue) {
                  return(
                    <li 
                      className='dropdown-option'
                      value={value} 
                      key={index}
                      onClick={this.handleOptionClick}
                    >
                      {value}
                    </li>
                  )}
              })}
            </ul>)}
        </div>
      );
    }
  }

export default Dropdown;