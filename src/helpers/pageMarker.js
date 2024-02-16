import { subscribe } from '../helpers/subscribe'

export class PageMarker {
  constructor() {
    this.data = {
      currentPage: null
    }
  }
  store() {
    return this._store = subscribe()
  }
  action() {
    setTimeout(() => {
      this.data.currentPage = `/${window.location.pathname.split('/')[1]}`
      this._store.set(this.data)
    }, 100);
  }
}