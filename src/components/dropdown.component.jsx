import React from 'react'

import './dropdown.styles.css';

class Dropdown extends React.Component {
    constructor(props) {
      const {defaultValue} = props;
      super(props);
      this.container = React.createRef();
      this.selectionDisplay = React.createRef();

      this.state = {
          selectedValue: defaultValue,
          showList: false,
          displayedOptions: this.props.options,
          shownValue: defaultValue,
          activeItem: 0
      };
    }

    //if click happens outside the dropdown area close the list
    handleClickOutside = (event, headerCol, valueRow) => {
      const { options, onChange } = this.props;

      if(this.container.current && !this.container.current.contains(event.target)) {
        
        // console.log(options.includes(shownValue),'click')

        this.setState(prevState => {
          // if the typed in value exists in the options list then use it,
          // if it does not exist replace it with the value that was in the cell before typing in
          const insertValue = options.includes(prevState.shownValue) ? prevState.shownValue : prevState.selectedValue;
            
            // const activeValue = prevState.displayedOptions[prevState.activeItem];
            // console.log(activeValue,'activeValue')
            // const insertValue = activeValue === undefined ? prevState.selectedValue : activeValue;

          
          // use below to leave the typed in value even if value does not exist in options list
          // const insertValue = prevState.shownValue;
          
          // console.log(insertValue,'insertValue',options.includes(prevState.shownValue))
          return {
            showList: false,
            displayedOptions: options,
            selectedValue: insertValue,
            shownValue: insertValue
          }
        }
          , 
          () => {
            // console.log(this.selectionDisplay.current.innerText,event.target.innerText)
              if(this.selectionDisplay.current.innerText !== this.state.selectedValue) {
                this.selectionDisplay.current.innerText = this.state.selectedValue;
              };
              return onChange(this.state.selectedValue, headerCol, valueRow);
        // ()=>console.log('click out',this.state.selectedValue)
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
          // console.log(prevState,'prevState')
          // console.log(this.container.current,'this.container.current')
          // console.log(this.state.displayedOptions, 'this.state.displayedOptions')

          if(!prevState.showList) {
            // console.log('add listener')
            document.addEventListener('mousedown', e => this.handleClickOutside(e, headerCol, valueRow));
          }
          else if(prevState.showList) {
            // console.log('remove listener')
            document.removeEventListener('mousedown', e => this.handleClickOutside(e, headerCol, valueRow));
          }

          return { showList: !prevState.showList }
        });
        
      }

    };

    // set text based on click in displayed list
    handleOptionClick = (event, headerCol, valueRow) => {
      // console.log(this.selectionDisplay.current.innerText,'this.selectionDisplay')
      // console.log(event.target.innerText, this.state.shownValue)
      const { onChange } = this.props;

      this.setState({
        selectedValue: event.target.innerText,
        showList: false,
        shownValue: event.target.innerText,
        displayedOptions: this.props.options
      }
        , 
        () => {
          // console.log(this.selectionDisplay.current.innerText,event.target.innerText)
            if(this.selectionDisplay.current.innerText !== event.target.innerText) {
              this.selectionDisplay.current.innerText = event.target.innerText;
            }
            return onChange(this.state.selectedValue, headerCol, valueRow);
        }      
      
      );

    };

    onTextChange = event => {
      // console.log('onTextChange',event.keyCode)
      // console.log(event.currentTarget.textContent,'text change')
      const { options } = this.props;

      const currentInput = event.currentTarget.textContent;
      // console.log(currentInput)

      const newFilteredOptions = options.filter(item => {
        // console.log(item.toLowerCase().indexOf(currentInput.toLowerCase()), item)
        // return item.toLowerCase().indexOf(currentInput.toLowerCase()) > -1 //filter if occurs at all
        return item.toLowerCase().indexOf(currentInput.toLowerCase()) === 0 //filter all with the same start
      });

      // console.log(newFilteredOptions);

      this.setState({
        displayedOptions: newFilteredOptions,
        showList: true,
        shownValue: currentInput,
        activeItem: 0
      }
      // ,
      // ()=>console.log(this.state)
      )
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
            // console.log('enter active',displayedOptions[prevState.activeItem],prevState.activeItem)
            return {
              activeItem: 0,
              selectedValue: displayedOptions[prevState.activeItem],
              showList: false,
              shownValue: displayedOptions[prevState.activeItem],
              displayedOptions: this.props.options
            }
          }
          , 
          () => {
            // console.log('enter',this.state.activeItem);
            if(this.selectionDisplay.current.innerText !== this.state.selectedValue) {
              this.selectionDisplay.current.innerText = this.state.selectedValue;
            }
            return onChange(this.state.selectedValue, headerCol, valueRow);
          }
          );
          break;
    
        default:
      }
    
    }
    

  
    render() {
      const { gridRow, gridColumn } = this.props;
      const { selectedValue, showList, displayedOptions, shownValue, activeItem } = this.state;
      
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
            {selectedValue}
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