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
          shownValue: defaultValue
      };
    }

    //if click happens outside the dropdown area close the list
    handleClickOutside = event => {
      const { options } = this.props;

      if(this.container.current && !this.container.current.contains(event.target)) {
        
        // console.log(options.includes(shownValue),'click')

        this.setState(prevState => {
          // if the typed in value exists in the options list then use it,
          // if it does not exist replace it with the value that was in the cell before typing in
          const insertValue = options.includes(prevState.shownValue) ? prevState.shownValue : prevState.selectedValue;
          
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
              }
        // ()=>console.log('click out',this.state.selectedValue)
          }
        );
      }

    }

    //handle the displaying of the list (if currently shown, then hide and vice versa)
    handleDisplay = () => {
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
            onChange(this.state.selectedValue, headerCol, valueRow);
        }      
      
      );

    };

    onTextChange = event => {
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
        shownValue: currentInput
      }
      // ,
      // ()=>console.log(this.state)
      )
    }

  
    render() {
      const { style } = this.props;
      const { selectedValue, showList, displayedOptions, shownValue } = this.state;
      
      // console.log(displayedOptions.length)
      
      let number = displayedOptions.length;
      number = number > 5 ? 5 : number < 1 ? 1 : number;
      
      const dropDownHeight = `${number*100}%`;
      const liHeight = `calc(${1/number*100}% - 1px)`;

      return (
        <div 
          className={'dropdown-container'}
          style={{ 
            gridRow: style.gridRow,
            gridColumn: style.gridColumn,
          }}
          ref = {this.container}
        >
          <div 
            className={showList ? 'selected-value active' : 'selected-value'}
            onClick={this.handleDisplay}  
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
                if(value !== selectedValue || shownValue !== selectedValue) {
                  return(
                    <li 
                      style={{height: liHeight}}
                      className='dropdown-option'
                      value={value} 
                      key={index}
                      onClick={e => this.handleOptionClick(e, style.gridColumn-1, style.gridRow-2)}
                    >
                      {value}
                    </li>
                  )}
                  else return null;
              })}
            </ul>)}
        </div>
      );
    }
  }

export default Dropdown;