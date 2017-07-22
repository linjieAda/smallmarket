import React from 'react'
import { observer } from 'mobx-react'

@observer
export default class App extends React.Component {

  componentDidMount() {
    const audio = document.getElementById('js-audio')
    audio.play()
  }

  switchMusic() {
    const store = this.props.store
    const audio = document.getElementById('js-audio')
    if (store.musicStatus === 'off') {
      store.updateMusic('on')
      audio.play();
    } else {
      store.updateMusic('off')
      audio.pause();
    }
  }

  render() {
    return (
      <div className="app-music">
        <div className={`music ${this.props.store.musicStatus === 'off' ? 'off' : 'on'}`} onClick={() => this.switchMusic()}></div>
        <audio
          id="js-audio"
          className="audio"
          preload="metadata"
          src="http://cdn.s.shangjiadao.cn/source/mp3/activity/normal/wozainayijiaoluohuanguoshanfen.mp3"
          loop="loop"
        >
        </audio>
      </div>
    )
  }
}

