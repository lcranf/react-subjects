////////////////////////////////////////////////////////////////////////////////
// Exercise
//
// - When the checkbox is checked:
//   - Fill in the shipping fields with the values from billing
//   - Disable the shipping fields so they are not directly editable
//   - Keep the shipping fields up to date as billing fields change
//   - Hint: you can get the checkbox value from `event.target.checked`
// - When the form submits, console.log the values
//
// Got extra time?
//
// - If there are more than two characters in the "state" field, let the user
//   know they should use the two-character abbreviation
// - If the user types something into shipping, then checks the checkbox, then
//   unchecks the checkbox, ensure the field has the information from
//   before clicking the checkbox the first time

import React from 'react'
import { render } from 'react-dom'
import serializeForm from 'form-serialize'

const CheckoutForm = React.createClass({
  getInitialState() {
    return {
      billingName: '',
      billingState: '',
      shippingName: '',
      shippingState: '',
      sameAsBilling: false,
      serializedForm: {}
    }
  },

  updateSameAsBilling(event) {
    this.setState({
      sameAsBilling: event.target.checked
    })
  },

  printFormValues(event) {
    event.preventDefault()
    const serializedData = serializeForm(event.target, { hash: true })
    this.setState({ serializedForm: serializedData })
  },

  render() {
    const {
      billingName,
      billingState,
      shippingName,
      shippingState,
      sameAsBilling
    } = this.state

    return (
      <div>
        <h1>Checkout</h1>
        <pre>{ JSON.stringify(this.state, null, 2) }</pre>
        <form onSubmit={this.printFormValues}>
          <fieldset>
            <legend>Billing Address</legend>
            <p>
              <label>Billing Name: <input
                                        type="text"
                                        name="billingName"
                                        defaultValue={billingName}
                                        onChange={event => this.setState({ billingName: event.target.value })}/></label>
            </p>
            <p>
              <label>Billing State: <input type="text"
                                           name="billingState"
                                           defaultValue={billingState}
                                           onChange={event => this.setState({ billingState: event.target.value })}
                                           size="2"/></label>
            </p>
          </fieldset>

          <br/>

          <fieldset>
            <label><input type="checkbox" onChange={this.updateSameAsBilling}/> Same as billing</label>
            <legend>Shipping Address</legend>
            <p>
              <label>Shipping Name: <input
                                        type="text"
                                        name="shippingName"
                                        value={sameAsBilling ? billingName : shippingName}
                                        disabled={sameAsBilling}
                                        onChange={event => this.setState({ shippingName: event.target.value })}/></label>
            </p>
            <p>
              <label>Shipping State: <input
                                        type="text"
                                        name="shippingState"
                                        value={sameAsBilling ? billingState : shippingState}
                                        disabled={sameAsBilling}
                                        onChange={event => this.setState({ shippingState: event.target.value })}
                                        size="2"/></label>
            </p>
          </fieldset>
          <button type="submit">Save</button>
        </form>
      </div>
    )
  }
})

render(<CheckoutForm/>, document.getElementById('app'))
