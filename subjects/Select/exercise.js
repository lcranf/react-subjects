import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import './styles.css'

const { func, any } = PropTypes


////////////////////////////////////////////////////////////////////////////////
// Requirements
//
// Make this work like a normal <select><option/></select>

const Select = React.createClass({
  getInitialState() {
    return {
      currentValue: this.props.value,
      currentText: 'label',
      isOpen: false
    }
  },
  propTypes: {
    onChange: func,
    value: any,
    defaultValue: any,
    children: PropTypes.array
  },
  componentWillReceiveProps(nextProps) {
    const { value } = nextProps
    const { currentValue } = this.state

    if (value && (value !== currentValue)) {
      this.setState({ currentValue: value })
    }
  },
  onOptionChange(value) {
    const { onChange } = this.props

    if (onChange) {
      onChange(value)
    }

    this.setState({ isOpen: false })
  },
  onLabelClick(event) {
    this.setState({ isOpen: !this.state.isOpen })
  },
  render() {

    const { currentValue } = this.state
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
         onChange: this.onOptionChange,
         whenSelected: (text) => this.setState({ currentText: text })
      })
    })

    return (
      <div className="select">
        <div className="label" onClick={this.onLabelClick}>{this.state.currentText} <span className="arrow">▾</span></div>
        <div style={{ display: this.state.isOpen ? 'block' : 'none' }} className="options">
          {children}
        </div>
      </div>
    )
  }
})


const Option = React.createClass({
  propTypes: {
    children: any,
    onChange: func,
    value: PropTypes.string.isRequired,
    whenSelected: PropTypes.func
  },

  onClick(event) {
    const { onChange, value, children, whenSelected } = this.props

    if (onChange) {
      onChange(value)

      if (whenSelected) {
        whenSelected(children)
      }
    }
  },
  render() {
    return (
      <div onClick={this.onClick} className="option">{this.props.children}</div>
    )
  }
})

const App = React.createClass({
  getInitialState() {
    return {
      selectValue: 'dosa'
    }
  },

  setToMintChutney() {
    this.setState({ selectValue: 'mint-chutney' })
  },

  render() {
    return (
      <div>
        <h1>Select/Option</h1>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>

        <h2>Controlled</h2>
        <p>
          <button onClick={this.setToMintChutney}>Set to Mint Chutney</button>
        </p>

        <Select
          value={this.state.selectValue}
          onChange={(selectValue) => this.setState({ selectValue })}
        >
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>

        <h2>Uncontrolled</h2>
        <Select defaultValue="tikka-masala">
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>
      </div>
    )
  }
})

render(<App/>, document.getElementById('app'))
