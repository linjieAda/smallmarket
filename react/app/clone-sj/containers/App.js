import React from 'react'
import { observer } from 'mobx-react'
import Menu from '../components/Menu'

import '../css/clonesj.scss'

@observer
export default class App extends React.Component {

  componentDidMount() {
    this.props.store.fetchData()
  }

  render() {
    const store = this.props.store

    return (
      <div className="app-clone-sj">
        <Menu store={store} />
      </div>
    )
  }
}
