import React from 'react'
import { observer } from 'mobx-react'

@observer
export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      show: 'ani',
    }
  }


  componentDidMount() {
    setInterval(() => {
      this.setState({ show: 'ani' })

      setTimeout(() => {
        this.setState({ show: '' })
      }, 2000)
    }, 4000)
  }

  render() {
    return (
      <header className="header">
        <ul className="statics">
          <li>
            <b>1282</b>人查看
          </li>
          <li>
            <b>164</b>人分享
          </li>
          <li>
            <b>54</b>人报名
          </li>
        </ul>

        <nav className="nav">
          <a className="complaints">投诉</a>
          <a className={`qrcode ${this.state.show}`}>
            <span>活动<br />二维码</span>
          </a>
          <a className="contact">联系<br />商家</a>
        </nav>
      </header>
    )
  }

}

