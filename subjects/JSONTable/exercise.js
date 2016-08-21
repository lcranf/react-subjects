////////////////////////////////////////////////////////////////////////////////
// Requirements
//
// - fetch the src with getJSON((error, payload) => {})
// - render the content of the th's from the field names (hint: use
//   the field names from the first record)
// - render each result as a row in <tbody>
import 'purecss/build/pure.css'
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import getJSON from './lib/getJSON'

const JSONTable = React.createClass({
  getInitialState() {
    return {
      contracts: []
    }
  },
  propTypes: {
    src: PropTypes.string.isRequired,
    getData: PropTypes.func.isRequired
  },
  getHeader(contact) {
    var rows = []

    for (var key in contact) {
      if (contact.hasOwnProperty(key)) {
        rows.push(<th key={key}>{key}</th>)
      }
    }

    return <tr>{rows}</tr>
  },
  getRow(contract) {
    var row = []

    for (var key in contract) {
      if (contract.hasOwnProperty(key)) {
        let value = contract[key]

        row.push(<td key={value}>{value}</td>)
      }
    }

    return row
  },
  componentDidMount() {
    const { src, getData } = this.props

    getJSON(src, (error, payload) => this.setState({ contracts: getData(payload) }))
  },
  render() {
    const { contracts } = this.state

    return (
      <div>
        <table className="pure-table pure-table-striped">
          <thead>
             { this.getHeader(contracts[0]) }
          </thead>
          <tbody>
            {
              contracts.map((contract, index) => (
                <tr key={index}>{ this.getRow(contract) }</tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
})

const App = React.createClass({
  render() {
    return (
      <div>
        <h1>JSONTable</h1>
        <JSONTable
          src="https://addressbook-api.herokuapp.com/contacts"
          getData={payload => payload.contacts}
        />
      </div>
    )
  }
})

render(<App/>, document.getElementById('app'))
