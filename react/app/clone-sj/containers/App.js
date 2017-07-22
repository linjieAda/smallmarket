import React from 'react'
import { observer } from 'mobx-react'
import Menu from '../components/Menu'
import Music from '../components/Music'
import Head from '../components/Head'
import Banner from '../components/Banner'
import CardBox from '../components/CardBox'
import Reminder from '../components/Reminder'
import Piece from '../components/Piece'

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
        <Menu />
        <Music store={store} />
        <Head />
        <Banner store={store} />
        <CardBox />
        <Reminder />
        <Piece />
      </div>
    )
  }
}
