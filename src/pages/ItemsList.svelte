<script>
  import { collection, getDocs, query, orderBy } from 'firebase/firestore'
  import dayjs from 'dayjs'
  import { getContext } from 'svelte'
  import { Datatable } from 'svelte-simple-datatables'
  import { pagesTexts } from '../data/pagesTexts'
  import { fixedHeight } from '../helpers/fixedHeight'
  import { subscribe } from '../helpers/subscribe'
	import Container from '../components/Container.svelte'
  import PageTitle from '../components/PageTitle.svelte'
	import Block from '../components/Block.svelte'
	import Button from '../components/Button.svelte'
  import Loader, { LoaderHandler } from '../components/Loader.svelte'
  import { ModalHandler } from '../components/Modal.svelte'
  import ItemsDetails from './ItemsDetails.svelte'

  export let authStore, tableRows, snackBarHandler, createdDateThead
  export let currentPage = window.location.pathname.slice(1)
  let db = getContext('db')

  export let loaderHandler = new LoaderHandler()
  export let loaderStore = loaderHandler.store()
  export let tableSettings = {columnFilter: false}
  let tableDataModel = {
    data: {
      items: []
    }
  }
  export let tableDataStore = subscribe()
  tableDataStore.set(tableDataModel.data)

  function msToTime(ms) {
    let seconds = Math.floor(ms/1000)
    let minutes = Math.floor(seconds/60)
    let hours = Math.floor(minutes/60)
    seconds = seconds % 60
    minutes = minutes % 60
    return {
      h: hours,
      m: minutes,
      s: seconds
    }
  }
  function trackedTimeDisplay(ms) {
    let time = msToTime(ms)
    return `${`${time.h < 10 ? '0' : ''}${time.h}`}:${(`00${time.m}`).slice(-2)}:${(`00${time.s}`).slice(-2)}`
  }

  function projectTrackedTime(resolve, i_orig, id, ttSnapshot) {
    let i_tt = 0, totalTime = 0
    if (ttSnapshot.docs.length == 0) {
      resolve({i: i_orig, tracked_time: 0})
      return
    }
    ttSnapshot.forEach((tt_doc) => {
      i_tt++
      tt_doc.data().pid == id ? totalTime += parseInt(tt_doc.data().tracked_time) : null
      i_tt == ttSnapshot.docs.length ? resolve({i: i_orig, tracked_time: totalTime}) : null
    })
  }

  function clientTrackedTime(resolve, i_orig, id, ttSnapshot) {
    getDocs(collection(db, `projects/user_${$authStore.user.uid}/items_${$authStore.user.uid}`))
      .then((prjSnapshot) => {
        if (prjSnapshot.docs.length == 0) {
          resolve({i: i_orig, tracked_time: 0})
          return
        }
        let i_prj = 0
        let cliPrjDocs = []
        prjSnapshot.forEach((prj_doc) => {
          i_prj++
          prj_doc.data().cid == id ? cliPrjDocs.push(prj_doc) : null
          if (i_prj == prjSnapshot.docs.length) {
            if (cliPrjDocs.length == 0) {
              resolve({i: i_orig, tracked_time: 0})
              return
            }
            let i_cliPrj = 0, totalTime = 0
            cliPrjDocs.forEach((cliPrj_doc) => {
              i_cliPrj++
              new Promise(resolv => {
                projectTrackedTime(resolv, i_cliPrj, cliPrj_doc.id, ttSnapshot)
              }).then((res) => {
                totalTime += parseInt(res.tracked_time)
                if (res.i == cliPrjDocs.length) {
                  resolve({i: i_orig, tracked_time: totalTime})
                }
              })
            })
          }
        })
      })
  }

  function parentInfo(parentSnapshot, parentID) {
    if (parentSnapshot.length == 0 || parentSnapshot.docs?.length == 0) return false
    for (const doc of parentSnapshot.docs) {
      if (parentID == doc.id) {
        return doc.data().description
      }
    }
  }

  async function pageItemsLoad(valid) {
    if (!valid) return
    loaderHandler.init()
    const itemsSnapshot = await getDocs(collection(db, `${currentPage}/user_${$authStore.user.uid}/items_${$authStore.user.uid}`))
    let tableData = {
      data: {
        items: []
      }
    }
    if (itemsSnapshot.docs.length == 0) {
      tableDataStore.set(tableData.data)
      if (modalHandler.data.open) modalHandler.action()
      setTimeout(function() {
        loaderHandler.end()
      }, 200)
      return
    }
    let ttSnapshot = []
    if (['clients', 'projects'].includes(currentPage)) {
      ttSnapshot = await getDocs(collection(db, `tracked_time/user_${$authStore.user.uid}/items_${$authStore.user.uid}`))
    }
    let parentField = ''
    let parentSnapshot = []
    if (currentPage == 'tracked_time') {
      parentField = 'pid'
      parentSnapshot = await getDocs(collection(db, `projects/user_${$authStore.user.uid}/items_${$authStore.user.uid}`))
    } else if (currentPage == 'projects') {
      parentField = 'cid'
      parentSnapshot = await getDocs(collection(db, `clients/user_${$authStore.user.uid}/items_${$authStore.user.uid}`))
    }
    let i = 0
    itemsSnapshot.forEach((doc) => {
      i++
      new Promise(resolve => {
        switch (currentPage) {
          case 'clients':
            clientTrackedTime(resolve, i, doc.id, ttSnapshot)
            break
          case 'projects':
            projectTrackedTime(resolve, i, doc.id, ttSnapshot)
            break
          case 'tracked_time':
            resolve({i, tracked_time: doc.data().tracked_time})
            break
        }
      }).then((res) => {
        tableData.data.items.push({
          currentPage,
          description: doc.data().description,
          dateDisplay: new Date(dayjs(doc.data().created_date.toDate()).format('YYYY-MM-DDTHH:mm:ss')).toLocaleDateString('default', {year: 'numeric', month: 'numeric', day: 'numeric'}),
          dateValue: dayjs(doc.data().created_date.toDate()).format('YYYY-MM-DDTHH:mm:ss'),
          created_date: doc.data().created_date.toDate(),
          value_h: msToTime(res.tracked_time).h,
          value_m: msToTime(res.tracked_time).m,
          value_s: msToTime(res.tracked_time).s,
          tracked_time: `${res.tracked_time}`,
          tracked_time_display: trackedTimeDisplay(res.tracked_time),
          id: doc.id,
          cid: doc.data().cid ? doc.data().cid : null,
          pid: doc.data().pid ? doc.data().pid : null,
          parent: parentInfo(parentSnapshot, doc.data()[parentField])
        })
        if (res.i == itemsSnapshot.docs.length) {
          tableDataStore.set(tableData.data)
          setTimeout(function() {
            createdDateThead.click()
            setTimeout(function() {
              loaderHandler.end()
              if (modalHandler.data.open) modalHandler.action()
            }, 200)
          }, 100)
        }
      })
    })
  }
  pageItemsLoad(true)

  let queryData = {
    data: {
      content: null,
      page: null
    }
  }
  export let subitemsSnapshot = subscribe()
  subitemsSnapshot.set(queryData.data)
  if (['projects', 'tracked_time'].includes(currentPage)) {
    let coll
    switch (currentPage) {
      case 'projects':
        coll = 'clients'
        break
      case 'tracked_time':
        coll = 'projects'
        break
    }
    getDocs(query(collection(db, `${coll}/user_${$authStore.user.uid}/items_${$authStore.user.uid}`), orderBy('created_date', 'desc')))
      .then((querySnapshot) => {
        subitemsSnapshot.set({content: querySnapshot, page: coll})
      })
  }

  export let modalHandler = new ModalHandler()
  let dataModelModal = {
    data: {
      currentPage,
      title: pagesTexts[currentPage].newModalTitle,
      subtitle: pagesTexts[currentPage].newModalSubtitle
    }
  }
  export let modalDataStore = subscribe()
  modalDataStore.set(dataModelModal.data)

  function modalToggle(id) {
    return function() {
      if (id) {
        let index = $tableDataStore.items.findIndex((row) => row.id == id)
        let rowData = {
          data: {...{
            title: pagesTexts[currentPage].detailsModalTitle,
            subtitle: pagesTexts[currentPage].detailsModalSubtitle
          }, ...$tableDataStore.items[index]}
        }
        modalDataStore.set(rowData.data)
      } else {
        let newData = {
          data: {...dataModelModal.data, ...{
            value_h: '00',
            value_m: '00',
            value_s: '00',
            tracked_time: '0'
          }}
        }
        modalDataStore.set(newData.data)
      }
      modalHandler.action()
    }
  }
</script>

<Container spacing=24>
  <PageTitle
		title={pagesTexts[currentPage].pageTitle}
		subtitle={pagesTexts[currentPage].pageSubtitle}
	/>
  <Block l=100 style="display: flex; justify-content: flex-end;">
    <Button
      text={pagesTexts[currentPage].newItemBtn}
      type="button"
      classes="secondary small"
      onclick={modalToggle(null)}
    />
  </Block>
  <Block l=100>
    <div class="content-height-table-top-button" style="position: relative;" use:fixedHeight>
      <Loader
        store={loaderStore}
        classes="content-height-table-top-button"
      />
      {#if $tableDataStore.items.length > 0}
        <Datatable
          data={$tableDataStore.items}
          settings={tableSettings}
          bind:dataRows={tableRows}
        >
          <thead class="case_1">
            <!-- <th></th> -->
            <th data-key="description">Description</th>
            {#if ['tracked_time', 'projects'].includes(currentPage)}              
              <th data-key="parent">
                {`${currentPage == 'tracked_time' ? 'Project' : ''}`}
                {`${currentPage == 'projects' ? 'Client' : ''}`}
              </th>
            {/if}
            <th class="asc" data-key="(row) => row.dateValue" bind:this={createdDateThead}>Created date</th>
            <th data-key="(row) => parseInt(row.tracked_time)">Traked Time</th>
            <th></th>
          </thead>
          <tbody class="case_1">
            {#if $tableRows}
              {#each $tableRows as row}
                <tr class="link_items" on:click={modalToggle(row.id)}>
                  <!-- <td>
                    <div class="icon">{row.description.slice(0, 1).toUpperCase()}</div>
                  </td> -->
                  <td title={row.description}>{row.description}</td>
                  {#if ['tracked_time', 'projects'].includes(currentPage)}                  
                    <td title={row.parent}>{row.parent}</td>
                  {/if}
                  <td>{row.dateDisplay}</td>
                  <td>{row.tracked_time_display}</td>
                  <td>
                    <span class="link">Details</span>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </Datatable>
      {:else}
        <div class="empty-msg">
          <ion-icon name="file-tray-outline"></ion-icon>
          <p class="subtitle">
            Nothing here yet.
          </p>
        </div>
      {/if}
    </div>
  </Block>
</Container>

<ItemsDetails
  {authStore}
  {modalHandler}
  {modalDataStore}
  {snackBarHandler}
  {subitemsSnapshot}
  formCallback={pageItemsLoad}
/>

<style lang="scss">
  .link_items td {
    cursor: pointer !important;
  }
  .empty-msg {
    padding-top: 60px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    p {
      width: 100%;
      text-align: center;
    }
    ion-icon {
      display: block;
      width: 200px;
      opacity: .25;
    }
  }
</style>