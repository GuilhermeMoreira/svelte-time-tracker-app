import { getContext } from 'svelte'
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { subscribe } from './subscribe'

export class DataStore {
  constructor(collection, dataModel, DocID, observe = true, db = getContext('db')) {
    if (!DocID) {
      console.log('Missing doc id')
      return;
    }
    this.db = db
    this.DocID = DocID
    this.collection = collection
    this.observe = observe
    this.#init(dataModel)
      .then((data)=> {
        this.data = data
      })
  }
  store() {
    return this._store = subscribe()
  }
  update(data) {
    delete data.loaded
    updateDoc(doc(this.db, this.collection, this.DocID), data)
    // console.log('...Wrote', collection)
  }
  async #init(dataModel) {
    let data = dataModel
    const docRef = doc(this.db, this.collection, this.DocID)
    const docGet = await getDoc(docRef)
    // console.log('Fetched...', this.collection)
    if (docGet.exists()) {
      // console.log('...Server data:', docGet.data())
      data = docGet.data()
    } else {
      // console.log('...No such document! Writing new one')
      await setDoc(doc(this.db, this.collection, this.DocID), dataModel)
    }
    if (this.observe) {  
      onSnapshot(doc(this.db, this.collection, this.DocID), (docSnap) => {
        // const source = docSnap.metadata.hasPendingWrites ? '...Local' : '...Server'
        // console.log(source, 'snapshot: ', docSnap.data())
        let snapData = docSnap.data()
        snapData.loaded = true
        setTimeout(() => {
          this._store.set(snapData)
        }, 300)
      })
    }
    return data
  }
}