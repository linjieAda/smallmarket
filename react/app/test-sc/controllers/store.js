import { observable, action } from 'mobx'
import { getURLParameter } from 'sspquery'
import { queryForGetMarket } from './query'
import { setDocumentTitle } from 'utils/setDocumentTitle'
class StreetStore {
  @observable text = ''

  @action update(text) {
    this.text = text
  }

  fetchData() {
    setDocumentTitle('小市场')
    this.update('开始开工了吗？!!!!!')
  }

}

export default new StreetStore
