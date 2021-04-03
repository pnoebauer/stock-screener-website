import React from 'react'

import './dropdown.styles.css';

class Dropdown extends React.Component {
    constructor(props) {
      const {children} = props;
      super(props);
      this.container = React.createRef();
      this.selectionDisplay = React.createRef();

      this.state = {
          showList: false,
          displayedOptions: this.props.options,
          shownValue: children,
          activeItem: 0,
          // key: 0
      };
    }

    //if click happens outside the dropdown area close the list
    handleClickOutside = (event) => {
      const { options, onChange, gridColumn, gridRow, children} = this.props;

      const headerCol = gridColumn-1;
      const valueRow = gridRow-2;

      // container exists and the click (event.target) occurs outside that container 
      if(this.container.current && !this.container.current.contains(event.target)) {
        let insertValue;

        this.setState(prevState => {
          // if the typed in value exists in the options list then use it,
          // if it does not exist replace it with the value that was in the cell before typing in
          insertValue = options.includes(prevState.shownValue) ? prevState.shownValue : children;
          
          return {
            showList: false,
            shownValue: insertValue
          }
        }
          , 
          () => {
              if(this.selectionDisplay.current.innerText !== insertValue) {
                //happens if typed in text does not match anything
                this.selectionDisplay.current.innerText = insertValue;
                // this.setState(prevState => ({key: prevState.key+1}))
              };
              document.removeEventListener('mousedown', this.handleClickOutside);
              return onChange(insertValue, headerCol, valueRow);
          }
        );
      }
    }

    //handle the displaying of the list (if currently shown, then hide and vice versa)
    handleDisplay = (clickEvent, headerCol, valueRow) => {
      const { options } = this.props;
      const { shownValue } = this.state;

      // comment if statement to allow closing the list even if value does not exist in options list
      if(options.includes(shownValue)) { 
        this.setState(prevState => {
 
          if(!prevState.showList) {
            document.addEventListener('mousedown', this.handleClickOutside);
          }
          else if(prevState.showList) {
            document.removeEventListener('mousedown', this.handleClickOutside);
          }
          return { showList: !prevState.showList }
        }); 
      }
    };

    // set text based on click in displayed list
    handleOptionClick = (event, headerCol, valueRow) => {
      const { onChange } = this.props;

      this.setState({
        showList: false,
        shownValue: event.target.innerText
      });

      onChange(event.target.innerText, headerCol, valueRow);

      if(this.selectionDisplay.current.innerText !== event.target.innerText) {
        // occurs when we type in, the text is not completed and then click on the same value that was in before
        // i.e. current value: Monthly,
        //      type in: Mon
        //      click on Monthly
        //  Because the state has not changed Mon will remain in the cell
        this.selectionDisplay.current.innerText = event.target.innerText;
        // this.setState(prevState => ({key: prevState.key+1}));
      }

      document.removeEventListener('mousedown', this.handleClickOutside);
      // onChange(event.target.innerText, headerCol, valueRow);
    };

    onTextChange = event => {
      const { options } = this.props;

      const currentInput = event.currentTarget.textContent;

      const newFilteredOptions = options.filter(item => {
        return item.toLowerCase().indexOf(currentInput.toLowerCase()) === 0 //filter all with the same start
      });

      this.setState({
        displayedOptions: newFilteredOptions,
        showList: true,
        shownValue: currentInput,
        activeItem: 0
      });
    }

    onKeyDown = (event, headerCol, valueRow) => {
      const { onChange } = this.props;
      const { activeItem, displayedOptions } = this.state;
    
      switch (event.keyCode) {
        // down
        case 40:
          if(activeItem < (displayedOptions.length-1)) {
            this.setState(prevState => {
              return {
                activeItem: prevState.activeItem + 1
              }
            });           
          } 
          break;
        // up
        case 38:
          if(activeItem > 0) {
            this.setState(prevState => {
              return {
                activeItem: prevState.activeItem - 1
              }
            });
          } 
          break;
        // enter
        case 13:
          event.preventDefault();
          this.setState(prevState => {
            const displayedValue = prevState.displayedOptions[prevState.activeItem];
            return {
              activeItem: 0,
              showList: false,
              shownValue: displayedValue
            }
          }
          ,
          () => {
            if(this.selectionDisplay.current.innerText !== this.state.shownValue) {
              this.selectionDisplay.current.innerText = this.state.shownValue;
              // this.setState(prevState => ({key: prevState.key+1}));
            }
            return onChange(this.state.shownValue, headerCol, valueRow);
          }
          );
          
          document.removeEventListener('mousedown', this.handleClickOutside);
          break;
    
        default:
      }
    }

    render() {
      const { gridRow, gridColumn, customStyles, className, children } = this.props;
      const { showList, displayedOptions, activeItem } = this.state;
      
      let number = displayedOptions.length;
      number = number > 5 ? 5 : number < 1 ? 1 : number;
      
      const dropDownHeight = `${number*100}%`;
      const liHeight = `calc(${1/number*100}% - 1px)`;

      return (
        <div 
          className={'dropdown-container'}
          style={{
            ...customStyles,
            gridRow,
            gridColumn: `${gridColumn+1}`
          }}
          ref = {this.container}
        >
          <div 
            className={`selected-value ${this.props.className} ${showList ? 'active' : ''}`}
            onClick={clickEvent => this.handleDisplay(clickEvent, gridColumn-1, gridRow-2)} 
            onKeyDown={e => this.onKeyDown(e, gridColumn-1, gridRow-2)}
            contentEditable='true'
            suppressContentEditableWarning={true}
            onInput={this.onTextChange}
            ref = {this.selectionDisplay}
            // key={key}
          >
            {children}
          </div>

            {showList && (<ul className={`options-list`} style={{height: dropDownHeight}}>
              {displayedOptions.map((value, index) => {
                // exclude the selectedValue from dropdown list options 
                // except if the shownValue is different to the selectedValue (happens if user types into search field)
                // if(value !== selectedValue || shownValue !== selectedValue) {
                  return (
                    <li 
                      style={{height: liHeight}}
                      className={`dropdown-option ${className} ${index === activeItem ? 'active' : ''}`}
                      value={value} 
                      key={index}
                      onClick={e => this.handleOptionClick(e, gridColumn-1, gridRow-2)}
                    >
                      {value}
                    </li>
                  )
                // }
                //   else return null;
              })}
            </ul>)}
        </div>
      );
    }
}

Dropdown.defaultProps = {
  className: '',
  customStyles: {}
};

export default Dropdown;