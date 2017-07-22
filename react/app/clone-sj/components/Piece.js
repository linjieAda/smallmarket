import React from 'react'
import { observer } from 'mobx-react'

@observer
export default class App extends React.Component {

  componentDidMount() {

  }

  render() {
    return (
      <div className="app-piece">
        <div className="piece1">
          <img src="http://cdn.s.shangjiadao.cn/source/images/components/foreground/taozi1.png?19" alt="" />
        </div>
      </div>
    )
  }
}

