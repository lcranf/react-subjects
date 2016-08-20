/*eslint-disable no-alert */
////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Using context, implement the <Form>, <SubmitButton>, and <TextInput>
// components such that:
//
// - Clicking the <SubmitButton> "submits" the form
// - Hitting "Enter" while in a <TextInput> submits the form
// - Don't use a <form> element, we're intentionally recreating the
//   browser's built-in behavior
//
// Got extra time?
//
// - Send the values of all the <TextInput>s to the <Form onChange> handler
//   without using DOM traversal APIs
// - Implement a <ResetButton> that resets the <TextInput>s in the form
//
////////////////////////////////////////////////////////////////////////////////
import React, { PropTypes } from 'react'
import { render } from 'react-dom'

const Form = React.createClass({
  getInitialState() {
    return {
      isReset: false
    }
  },

  propTypes: {
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.any
  },

  childContextTypes: {
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    onReset: PropTypes.func,
    isReset: PropTypes.bool
  },

  onFormChange(e) {
    let newState = this.state

    newState[e.target.name] = e.target.value
    newState['isReset'] = false
    this.setState(newState)
  },

  onFormSubmit() {
    let newState = this.state

    newState['isReset'] = false
    this.setState(newState)
    this.props.onSubmit(this.state)
  },

  onFormReset() {
    let newState = this.state

    newState['isReset'] = true
    this.setState(newState)
  },

  getChildContext() {
    return {
      onSubmit:  this.onFormSubmit,
      onChange: this.onFormChange,
      onReset: this.onFormReset,
      isReset: this.state.isReset
    }
  },

  render() {
    return <div>
              <pre>{ JSON.stringify(this.state, null, 2) }</pre>
              <div>
                {this.props.children}
              </div>
           </div>
  }
})

const SubmitButton = React.createClass({
  propTypes: {
    children: PropTypes.any
  },
  contextTypes: {
    onSubmit: PropTypes.func
  },
  onClick(event) {
    if (this.context.onSubmit) {
      this.context.onSubmit()
    }
  },
  render() {
    return <button onClick={this.onClick}>{this.props.children}</button>
  }
})

const ResetButton = React.createClass({
  contextTypes: {
    onReset: PropTypes.func
  },
  render() {
    return <button onClick={() => this.context.onReset() }>{this.props.children}</button>
  }
})

const TextInput = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string
  },
  contextTypes: {
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    isReset: PropTypes.bool
  },
  componentWillUpdate(nextProps, nextState, nextContext) {
    if (this.context.isReset !== nextContext.isReset && nextContext.isReset) {
      this.input.value = ''
    }
  },

  onKeyPress(event) {
    if (event.key === 'Enter' && this.context.onSubmit) {
      this.context.onSubmit()
    }
  },
  onChange(event) {
    if (this.context.onChange) {
      this.context.onChange(event)
    }
  },
  render() {
    return (
      <input
        type="text"
        ref={ (node) => this.input = node }
        name={this.props.name}
        onKeyPress={this.onKeyPress}
        onChange={this.onChange}
        placeholder={this.props.placeholder}
      />
    )
  }
})

const App = React.createClass({
  handleSubmit(formState) {
    alert(JSON.stringify(formState))
  },

  render() {
    return (
      <div>
        <h1>This isn't even my final <code>&lt;Form/&gt;</code>!</h1>

        <Form onSubmit={this.handleSubmit}>
          <p>
            <TextInput name="firstName" placeholder="First Name"/> {' '}
            <TextInput name="lastName" placeholder="Last Name"/>
          </p>
          <p>
            <SubmitButton>Submit</SubmitButton>
            <ResetButton>Reset</ResetButton>
          </p>
        </Form>
      </div>
    )
  }
})

render(<App/>, document.getElementById('app'))
