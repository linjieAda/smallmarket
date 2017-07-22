import { observable, action } from 'mobx'
import { getURLParameter } from 'sspquery'
import { queryForGetMarket } from './query'
import { setDocumentTitle } from 'utils/setDocumentTitle'

class ClonesjStore {

  @observable musicStatus = 'on'

  @action updateMusic(b) {
    this.musicStatus = b
  }

  fetchData() {
    setDocumentTitle('钓鱼赢好礼，38元换购8斤油桃+1盒')
  }

}

export default new ClonesjStore
