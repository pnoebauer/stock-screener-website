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
          activeItem: 0
      };
    }

    //if click happens outside the dropdown area close the list
    handleClickOutside = (event) => {
      // console.log('handleClickOutside')
      // const { options, onChange } = this.props;
      const { options, onChange, gridColumn, gridRow, children} = this.props;

      const headerCol = gridColumn-1;
      const valueRow = gridRow-2;

      if(this.container.current && !this.container.current.contains(event.target)) {
        
        // console.log(options.includes(shownValue),'click')

        let insertValue;

        this.setState(prevState => {
          // if the typed in value exists in the options list then use it,
          // if it does not exist replace it with the value that was in the cell before typing in
          insertValue = options.includes(prevState.shownValue) ? prevState.shownValue : children;
          // console.log(prevState.shownValue,'prevState.shownValue',children)
          // const activeValue = prevState.displayedOptions[prevState.activeItem];
          // console.log(activeValue,'activeValue',this.props.children)
          // insertValue = activeValue === undefined ? children : activeValue;
          // use below to leave the typed in value even if value does not exist in options list
          // insertValue = prevState.shownValue;
          
          return {
            showList: false,
            shownValue: insertValue
          }
        }
          , 
          () => {
            // console.log(this.selectionDisplay.current.innerText,event.target.innerText)
              if(this.selectionDisplay.current.innerText !== insertValue) {
                this.selectionDisplay.current.innerText = insertValue;
                //happens if typed in text does not match anything
                // console.log('does not match')
              };
              
              document.removeEventListener('mousedown', this.handleClickOutside);
              // console.log(insertValue)
              return onChange(insertValue, headerCol, valueRow);
          }
        );
      }

    }

    //handle the displaying of the list (if currently shown, then hide and vice versa)
    handleDisplay = (clickEvent, headerCol, valueRow) => {
      
      const { options } = this.props;
      const { shownValue } = this.state;

      // console.log('handleDisplay',options,shownValue)

      // comment if statement to allow closing the list even if value does not exist in options list
      if(options.includes(shownValue)) { 
        this.setState(prevState => {
          // console.log(prevState,'prevState')
          // console.log(this.container.current,'this.container.current')
          // console.log(this.state.displayedOptions, 'this.state.displayedOptions')

          if(!prevState.showList) {
            // console.log('add listener')
            document.addEventListener('mousedown', this.handleClickOutside);
          }
          else if(prevState.showList) {
            // console.log('remove listener')
            document.removeEventListener('mousedown', this.handleClickOutside);
          }

          return { showList: !prevState.showList }
        });
        
      }

    };

    // set text based on click in displayed list
    handleOptionClick = (event, headerCol, valueRow) => {
      // console.log('handleOptionClick')
      // console.log(this.selectionDisplay.current.innerText,'this.selectionDisplay')
      const { onChange } = this.props;

      this.setState({
        showList: false,
        shownValue: event.target.innerText
      });

      if(this.selectionDisplay.current.innerText !== event.target.innerText) {
        // console.log('set inner handleOption')
        this.selectionDisplay.current.innerText = event.target.innerText;
      }

      document.removeEventListener('mousedown', this.handleClickOutside);
      
      onChange(event.target.innerText, headerCol, valueRow);

    };

    onTextChange = event => {
      // console.log('onTextChange',event.keyCode)
      // console.log(event.currentTarget.textContent,'text change')
      const { options } = this.props;

      const currentInput = event.currentTarget.textContent;

      const newFilteredOptions = options.filter(item => {
        // return item.toLowerCase().indexOf(currentInput.toLowerCase()) > -1 //filter if occurs at all
        return item.toLowerCase().indexOf(currentInput.toLowerCase()) === 0 //filter all with the same start
      });
      // console.log(newFilteredOptions);

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
      // console.log(event.keyCode);//,activeItem,filteredSuggestions.length);
      //40 down, 38 up, 13 enter
    
      switch (event.keyCode) {
        // down
        case 40:
          if(activeItem < (displayedOptions.length-1)) {
            this.setState(prevState => {
              return {
                activeItem: prevState.activeItem + 1
              }
            }
            // , () => console.log('down',this.state.activeItem, displayedOptions[this.state.activeItem])
            );
              
          } 
          break;
        // up
        case 38:
          if(activeItem > 0) {
            this.setState(prevState => {
              return {
                activeItem: prevState.activeItem - 1
              }
            }
            // , () => console.log('up',this.state.activeItem)
            );
              
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
            console.log('enter',this.state.shownValue);
            if(this.selectionDisplay.current.innerText !== this.state.shownValue) {
              this.selectionDisplay.current.innerText = this.state.shownValue;
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
      
      const { gridRow, gridColumn, children } = this.props;
      
      // console.log('dd',this.state, this.props.children);

      const { showList, displayedOptions, activeItem } = this.state;
      
      // console.log(displayedOptions.length)
      
      let number = displayedOptions.length;
      number = number > 5 ? 5 : number < 1 ? 1 : number;
      
      const dropDownHeight = `${number*100}%`;
      const liHeight = `calc(${1/number*100}% - 1px)`;

      // console.log(showList,'showList')
      return (
        <div 
          className={'dropdown-container'}
          style={{
            gridRow,
            gridColumn
          }}
          ref = {this.container}
        >
          <div 
            className={showList ? 'selected-value active' : 'selected-value'}
            onClick={clickEvent => this.handleDisplay(clickEvent, gridColumn-1, gridRow-2)} 
            onKeyDown={e => this.onKeyDown(e, gridColumn-1, gridRow-2)}
            contentEditable='true'
            suppressContentEditableWarning={true}
            onInput={this.onTextChange}
            ref = {this.selectionDisplay}
          >
            {children}
          </div>

            {showList && (<ul className='options-list' style={{height: dropDownHeight}}>
              {displayedOptions.map((value, index) => {
                // exclude the selectedValue from dropdown list options 
                // except if the shownValue is different to the selectedValue (happens if user types into search field)
                // if(value !== selectedValue || shownValue !== selectedValue) {
                  return (
                    <li 
                      style={{height: liHeight}}
                      className={`dropdown-option ${index === activeItem ? 'active' : ''}`}
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

export default Dropdown;