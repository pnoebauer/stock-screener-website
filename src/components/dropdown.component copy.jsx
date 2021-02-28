import React from 'react'

import './dropdown.styles.css';

class Dropdown extends React.Component {
    constructor(props) {
      const {defaultValue} = props;
      super(props);
      this.state = {
          selectedValue: defaultValue,
          showList: false,
          displayedOptions: this.props.options
      };
    }
    
    //on mounting add event listener to handle click outside the Custom Select Container
    componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside);
    }

    //remove the event listener on component unmounting
    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }

    //if click happens outside the dropdown area close the list
    handleClickOutside = event => {
      if(!this.node.contains(event.target)) {
        const priorValue = this.state.selectedValue;
        console.log(priorValue, this.state.shownValue)
        
        this.setState((prevState) => ({
          showList: false,
          shownValue: priorValue
        }),
        ()=>console.log('click out',this.state.selectedValue));
        // console.log(this.node2, 'node2')

        // this.node2.innerText = 'test'
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
    handleOptionClick = (event, headerCol, valueRow) => {
      // console.log(event.target.getAttribute('value'))
      // console.log(event)

      this.setState({
        selectedValue: event.target.getAttribute('value'),
        showList: false
      }, () => this.props.onChange(this.state.selectedValue, headerCol, valueRow)      
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

      console.log(newFilteredOptions);

      this.setState({
        displayedOptions: newFilteredOptions,
        showList: true,
        shownValue: currentInput
      },
      ()=>console.log(this.state))

      
    }

  
    render() {
      const { options, style } = this.props;
      const { selectedValue, showList, displayedOptions, shownValue } = this.state;
      // console.log('a',this.props)
      

      return (
        <div 
          className={'dropdown-container'}
          style={{ 
            gridRow: style.gridRow,
            gridColumn: style.gridColumn,
          }}
          ref = {node => this.node=node}
        >
          <div 
            className={showList ? 'selected-value active' : 'selected-value'}
            onClick={this.handleDisplay}  
            contentEditable='true'
            suppressContentEditableWarning={true}
            onInput={this.onTextChange}
            ref = {node2 => this.node2=node2}
          >
            {selectedValue}
          </div>
          {/* WON'T WORK AS INPUT DOES NOT SUPPORT PSEUDO ELEMENTS
          <input
            className={showList ? 'selected-value active' : 'selected-value'}
            type='text'
            name='userInput'
            value={selectedValue}
            onClick={this.handleDisplay}  
          /> */}

            {showList && (<ul className='options-list'>
              {displayedOptions.map((value, index) => {
                if(value !== selectedValue || shownValue !== selectedValue) {
                  return(
                    <li 
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