import { collection, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore'

export async function deleteHandler(type, db, uid, item_id, i_origin) {
  async function itemDelete(db, coll, uid, doc_id, i, length) {
    return new Promise((resolve) => {
      deleteDoc(doc(db, `${coll}/user_${uid}/items_${uid}/${doc_id}`))
        .then(() => {
          if (i == length) resolve(true)
        })
        .catch((error) => {
          console.log(error.message)
          resolve(false)
        })
    })
  }
  return new Promise((resolve) => {
    if (type == 'tracked_time') return resolve(true)
    let coll
    let field
    switch (type) {
      case 'projects':
        coll = 'tracked_time'
        field = 'pid'
        break
      case 'clients':
        field = 'cid'
        coll = 'projects'
        break
    }
    getDocs(query(collection(db, `${coll}/user_${uid}/items_${uid}`), where(field, '==', item_id)))
      .then((itemsSnapshot) => {
        if (itemsSnapshot.docs.length == 0) resolve(i_origin ? {i: i_origin} : true)
        let i = 0
        itemsSnapshot.forEach((doc) => {
          i++
          itemDelete(db, coll, uid, doc.id, i, itemsSnapshot.docs.length)
            .then(() => {
              if (type == 'projects') resolve(i_origin ? {i: i_origin} : true)
            })
          if (type == 'clients') {
            deleteHandler('projects', db, uid, doc.id, i)
              .then((res) => {
                if (res.i == itemsSnapshot.docs.length) resolve(true)
              })
          }
        })
      })
  })
}