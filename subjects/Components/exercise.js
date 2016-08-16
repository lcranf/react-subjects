////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Render a tab for each country with its name in the tab
// - Make it so that you can click on a tab and it will appear active
//   while the others appear inactive
// - Make it so the panel renders the correct content for the selected tab
//
// Got extra time?
//
// - Make <Tabs> generic so that it doesn't know anything about
//   country data (Hint: good propTypes help)
////////////////////////////////////////////////////////////////////////////////
import React, { PropTypes } from 'react'
import { render } from 'react-dom'

const styles = {}

styles.tab = {
  display: 'inline-block',
  padding: 10,
  margin: 10,
  borderBottom: '4px solid',
  borderBottomColor: '#ccc',
  cursor: 'pointer'
}

styles.activeTab = {
  ...styles.tab,
  borderBottomColor: '#000'
}

styles.panel = {
  padding: 10
}

const Tabs = React.createClass({
  getInitialState() {
    return {
      activeIndex: 0
    }
  },
  propTypes: {
    data: PropTypes.array.isRequired
  },
  tabClicked(index) {
    this.setState({ activeIndex: index })
  },
  render() {
    const { data } = this.props
    const { activeIndex } = this.state
    const tabItem = data[activeIndex]

    return (
      <div className="Tabs">
        {
           data.map((tab, index) =>
              <div className="Tab"
                   key={index}
                   style={(index === activeIndex) ? styles.activeTab : styles.tab }
                   onClick={() => this.tabClicked(index)}>
                {tab.label}
              </div>
          )
        }

        <div className="TabPanel" style={styles.panel}>
          {tabItem.content}
        </div>
      </div>
    )
  }
})

const App = React.createClass({

  propTypes: {
    countries: PropTypes.array.isRequired
  },

  render() {
    const data = this.props.countries.map(country => (
                            { label: country.name,
                              content: country.description
                            }))

    return (
      <div>
        <h1>Countries</h1>
        <Tabs data={data}/>
      </div>
    )
  }
})

const DATA = [
  { id: 1, name: 'USA', description: 'Land of the Free, Home of the brave' },
  { id: 2, name: 'Brazil', description: 'Sunshine, beaches, and Carnival' },
  { id: 3, name: 'Russia', description: 'World Cup 2018!' }
]

render(<App countries={DATA}/>, document.getElementById('app'), function () {
  require('./tests').run(this)
})
