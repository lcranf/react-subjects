////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Implement a radio group form control with the API found in <App>.
//
// - Clicking a <RadioOption> should update the value of <RadioGroup>
// - The selected <RadioOption> should pass the correct value to its <RadioIcon>
// - The `defaultValue` should be set on first render
//
// Hints to get started:
//
// - <RadioGroup> will need some state
// - It then needs to pass that state to the <RadioOption>s so they know
//   whether or not they are active
//
// Got extra time?
//
// Implement a `value` prop and allow this to work like a "controlled input"
// (https://facebook.github.io/react/docs/forms.html#controlled-components)
//
// - Add a button to <App> that sets `this.state.radioValue` to a pre-determined
//   value, like "tape"
// - Make the <RadioGroup> update accordingly
//
// Implement keyboard controls on the <RadioGroup> (you'll need tabIndex="0" on
// the <RadioOption>s so the keyboard will work)
//
// - Enter and space bar should select the option
// - Arrow right, arrow down should select the next option
// - Arrow left, arrow up should select the previous option
////////////////////////////////////////////////////////////////////////////////
import React, { PropTypes } from 'react'
import { render, findDOMNode } from 'react-dom'

const KeyCodes = {
  Enter: 13,
  Space: 32,
  RightArrow: 39,
  DownArrow: 40,
  LeftArrow: 37,
  UpArrow: 38
}

const RadioGroup = React.createClass({

  propTypes: {
    defaultValue: PropTypes.string,
    children: PropTypes.any
  },

  getInitialState() {
    return {
      selectedOption: this.props.defaultValue
    }
  },

  componentWillReceiveProps(nextProps) {
    const { selectedOption } = this.state

    if (selectedOption !== nextProps.defaultValue) {
      this.setState({ selectedOption: nextProps.defaultValue })
    }
  },

  onOptionChange(value) {
    this.setState({ selectedOption: value })
  },

  render() {
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
         selectedOption: this.state.selectedOption,
         onOptionChange: this.onOptionChange
      })
    })
    return <div>{ children }</div>
  }
})

const RadioOption = React.createClass({
  propTypes: {
    value: PropTypes.string,
    selectedOption: PropTypes.string,
    children: PropTypes.node,
    onOptionChange: PropTypes.func
  },

  onFocus() {
    const { onOptionChange, value } = this.props

    if (onOptionChange) {
      onOptionChange(value)
    }
  },

  isSelected() {
    const { value, selectedOption } = this.props

    return value === selectedOption
  },

  handleKeyDown(event) {

    const { onOptionChange, value } = this.props

    switch (event.keyCode) {
      case KeyCodes.Enter:
      case KeyCodes.Space:
        if (onOptionChange) {
          this.isSelected() ? onOptionChange('unselect') : onOptionChange(value)
        }
        break
      case KeyCodes.RightArrow:
      case KeyCodes.DownArrow:
        let nextSibling = findDOMNode(this).nextSibling

        if (nextSibling) {
          nextSibling.focus()
        } else {
          findDOMNode(this).parentNode.firstChild.focus()
        }
        break
      case KeyCodes.UpArrow:
      case KeyCodes.LeftArrow:
        let prevSibling = findDOMNode(this).previousSibling

        if (prevSibling) {
          prevSibling.focus()
        } else {
          findDOMNode(this).parentNode.lastChild.focus()
        }
        break
      default:
        break
    }
  },

  render() {
    const { value, selectedOption } = this.props

    return (
      <div tabIndex="0" onKeyDown={this.handleKeyDown} onFocus={this.onFocus}>
        <RadioIcon isSelected={ value === selectedOption }/> {this.props.children}
      </div>
    )
  }
})

const RadioIcon = React.createClass({
  propTypes: {
    isSelected: PropTypes.bool.isRequired
  },

  render() {
    return (
      <div
        style={{
          borderColor: '#ccc',
          borderSize: '3px',
          borderStyle: this.props.isSelected ? 'inset' : 'outset',
          height: 16,
          width: 16,
          display: 'inline-block',
          cursor: 'pointer',
          background: this.props.isSelected ? 'rgba(0, 0, 0, 0.05)' : ''
        }}
      />
    )
  }
})

const App = React.createClass({
  getInitialState() {
    return {
      radioValue: 'fm'
    }
  },
  setRadioValue() {
    this.setState({
      radioValue: 'tape'
    })
  },
  render() {
    return (
      <div>
        <h1>♬ It's about time that we all turned off the radio ♫</h1>
        <div>
          <pre>{ JSON.stringify(this.state, null, 2) }</pre>
        </div>
        <button type="button" onClick={this.setRadioValue}>Set Tape</button>

        <RadioGroup defaultValue={ this.state.radioValue }>
          <RadioOption value="am">AM</RadioOption>
          <RadioOption value="fm">FM</RadioOption>
          <RadioOption value="tape">Tape</RadioOption>
          <RadioOption value="aux">Aux</RadioOption>
        </RadioGroup>
      </div>
    )
  }
})

render(<App/>, document.getElementById('app'))
