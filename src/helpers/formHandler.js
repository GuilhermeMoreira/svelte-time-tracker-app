import { collection, doc, addDoc, setDoc, deleteDoc  } from 'firebase/firestore'
import { getContext } from 'svelte'
import { deleteHandler } from './deleteHandler'

export class FormHandler {
  constructor(_collection, uid, callback, store, snapshot, snackBarHandler, db = getContext('db')) {
    this._collection = _collection
    this.uid = uid
    this.callback = callback
    this._store = store
    this.snapshot = snapshot
    this.snackBar = snackBarHandler
    this.db = db
  }
  #loader() {
    let previousData = this.snapshot.data
    previousData.loaded = false
    this._store.set(previousData)
  }
  async submit(form) {
    this.#loader()
    const formData = new FormData(form)
    const data = {}
    let id, ref, action
    for (let field of formData) {
      const [key, value] = field
      switch (key) {
        case 'id':
          id = value
          break;
        case 'created_date':
          data[key] = new Date(value)
          break;
        case 'cid':
        case 'pid':
          if (value == 'undefined') {
            this._store.set({loaded: true})
            this.snackBar.action('Please, choose an option.', 4000, 'error')
            return
          }
          data[key] = value
          break;
        case 'delete':
          if (value != 'false') {
            action = deleteDoc
            const deleteDependecies = await deleteHandler(value, this.db, this.uid, formData.get('id'))
            if (!deleteDependecies) {
              this._store.set({loaded: true})
              this.snackBar.action('An unexpected error occurred.', 4000, 'error')
              return
            }
          }
          break;
        default:
          data[key] = value
          break;
      }
    }
    if (id) {
      ref = doc(this.db, `${this._collection}/user_${this.uid}/items_${this.uid}/${id}`)
      data.updated_date = new Date()
      action = action ? action : setDoc
    } else {
      ref = collection(this.db, `${this._collection}/user_${this.uid}/items_${this.uid}`)
      data.created_date = new Date()
      action = addDoc
    }
    await action(ref, data)
      .then(() => {
        setTimeout(() => {
          this._store.set({loaded: true})
          this.snackBar.action('Data updated successfully.', 3000, 'success')
          this.callback(true)
        }, 400)
      })
      .catch((error) => {
        this._store.set({loaded: true})
        this.snackBar.action(error.message, 4000, 'error')
        this.callback(false)
      })
  }
}