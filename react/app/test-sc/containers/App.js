import React from 'react'
import { observer } from 'mobx-react'

import '../css/street.scss'

@observer
export default class App extends React.Component {

  componentDidMount() {
    this.props.store.fetchData()
  }

  render() {
    const store = this.props.store

    return (
      <div className="app-mrt-virtual">
        {store.text}
      </div>
    )
  }
}
