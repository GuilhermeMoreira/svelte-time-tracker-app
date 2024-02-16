<script>
  import { subscribe } from '../helpers/subscribe'
  import Modal from '../components/Modal.svelte'
  import { FormHandler } from '../helpers/formHandler'
  import Container from '../components/Container.svelte'
  import Block from '../components/Block.svelte'
	import Button from '../components/Button.svelte'
  import Placeholder from '../components/Placeholder.svelte'
  import Input from '../components/Input.svelte'
  import Select from '../components/Select.svelte'

  export let authStore, modalHandler, modalDataStore, snackBarHandler, createAccountHandler, logInHandler, formCallback, subitemsSnapshot, formHandler, formNode, pageCapital
  export let spacingModal = 36

  let dataLoaded = {
    data: {
      loaded: true
    }
  }
  export let loaderStore = subscribe()
  loaderStore.set(dataLoaded.data)

  $: if ($authStore.user) {
    formHandler = new FormHandler($modalDataStore.currentPage, $authStore.user.uid, formCallback, loaderStore, dataLoaded, snackBarHandler)
  }

  let deleteData = {
    data: {
      delete: false
    }
  }

  export let deleteStore = subscribe()
  deleteStore.set(deleteData.data)
  function delete_item() {
    if (window.confirm(`Are you sure you want to delete this item and all its associated content?`)) {
      deleteStore.set({delete: $modalDataStore.currentPage})
      setTimeout(function() {
        formHandler.submit(formNode)
      }, 100);
    }
  }

  let selectOptions = {
    data: {
      items: []
    }
  }
  export let selectStore = subscribe()
  selectStore.set(selectOptions.data)
  $: if ($subitemsSnapshot.content?.docs.length > 0) {
    let options = []
    let i = 0
    $subitemsSnapshot.content.forEach((doc) => {
      i++
      options.push({
        text: doc.data().description,
        value: doc.id
      })
      if (i == $subitemsSnapshot.content.docs.length) {
        selectStore.set({items: options})
      }
    })
  } else if ($subitemsSnapshot.page) {
    pageCapital = $subitemsSnapshot.page.replace(/^\w/, (c) => c.toUpperCase())
  }

  function goToPageBtn(page) {
    return function() {
      modalHandler.action.bind(modalHandler)
      setTimeout(function() {
        document.querySelector(`.main-nav a[href="/${page}"]`).click()
      }, 100)
    }
  }

  function tensMax(val) {
    let ten = val.slice(0,1)
    ten = parseInt(ten) > 5 ? 5 : ten
    return `${ten}${val.slice(-1)}`
  }

  function trackedTimeUpdate() {
    let
      h = document.querySelector('#hours'),
      m = document.querySelector('#minutes'),
      s = document.querySelector('#seconds'),
      tt = document.querySelector('#tracked_time')
    h.value = (`00${h.value.replace(/[^0-9]/g, '')}`).slice(-2)
    m.value = tensMax((`00${m.value.replace(/[^0-9]/g, '')}`).slice(-2))
    s.value = tensMax((`00${s.value.replace(/[^0-9]/g, '')}`).slice(-2))
    tt.value = Math.floor(h.value*60*60*1000) + Math.floor(m.value*60*1000) + Math.floor(s.value*1000)
  }

  function login() {
    logInHandler.action()
    setTimeout(function() {
      modalHandler.action()
    }, 100);
  }

  function createAccount() {
    createAccountHandler.action()
    setTimeout(function() {
      modalHandler.action()
    }, 100);
  }
</script>

<Modal
  columns=1
  title={$modalDataStore.title}
  subtitle={$modalDataStore.subtitle}
  spacingContainer={spacingModal}
  handler={modalHandler}
>
  <form
    on:submit|preventDefault={formHandler.submit.bind(formHandler, this)}
    bind:this={formNode}
  >
    {#if $modalDataStore.id}
      <input type="hidden" name="id" value={$modalDataStore.id}>
      <input type="hidden" name="created_date" value={$modalDataStore.created_date}>
      <input type="hidden" name="delete" value={$deleteStore.delete}>
    {/if}
    
    {#if ['projects', 'tracked_time'].includes($modalDataStore.currentPage) && $subitemsSnapshot.content.docs.length == 0}
      <Container
        spacing={spacingModal}
        style={!$authStore.user ? 'justify-content: center;' : ''}
      >  
        {#if $authStore.user}
          <Block>
            <p style="text-align: center; padding: 0 48px;">
              You have no {`${pageCapital}`} to associate with
            </p>
          </Block>
          <Container
            style="justify-content: center;"
          >
            <Block>
              <Button
                text="Cancel"
                type="button"
                classes="secondary"
                onclick={modalHandler.action.bind(modalHandler)}
              />
            </Block>
            <Block
              style="padding-left: 24px;"
            >
              <Button
                text={`Go to ${pageCapital}`}
                type="button"
                classes="primary"
                onclick={goToPageBtn($subitemsSnapshot.page)}
                style="display: block; margin: 0 auto;"
              />
            </Block>
          </Container>
        {:else}
          <Block>
            <p style="text-align: center; padding: 0 12px;">
              You need to <strong>Create an Account</strong> or <strong>Log In</strong> to save your Tracked Time
            </p>
          </Block>
          <Block>
            <Button
              text="Create an Account"
              type="button"
              classes="primary"
              onclick={createAccount}
              style="display: block; margin: 0 auto;"
            />
          </Block>
          <Block>
            <Button
              text="Cancel"
              type="button"
              classes="secondary"
              onclick={modalHandler.action.bind(modalHandler)}
            />
          </Block>
          <Block>
            <Button
              text="Log In"
              type="button"
              classes="primary"
              onclick={login}
              style="display: block; margin: 0 auto;"
            />
          </Block>
        {/if}
      </Container>
    {:else}
      <Container
        spacing={spacingModal}
        style="align-items: end;"
      >
        <Block
          l=100
        >
          <Input
            id="description"
            label="Description"
            type="text"
            name="description"
            required={true}
            value={$modalDataStore.description}
          />
        </Block>
        {#if $modalDataStore.currentPage == 'tracked_time'}
          {#if $modalDataStore.tracked_time}
            <input id="tracked_time" type="hidden" name="tracked_time" value={$modalDataStore.tracked_time}>
          {/if}
          <Block
            l=33
          >
            <Input
              id="hours"
              label="Hours"
              type="text"
              required={true}
              value={(`0${$modalDataStore.value_h}`).slice(-2)}
              oninput={trackedTimeUpdate}
            />
          </Block>
          <Block
            l=33
          >
            <Input
              id="minutes"
              label="Minutes"
              type="text"
              required={true}
              value={(`0${$modalDataStore.value_m}`).slice(-2)}
              oninput={trackedTimeUpdate}
            />
          </Block>
          <Block
            l=33
          >
            <Input
              id="seconds"
              label="Seconds"
              type="text"
              required={true}
              value={(`0${$modalDataStore.value_s}`).slice(-2)}
              oninput={trackedTimeUpdate}
            />
          </Block>
          <Block
            l=100
          >
            <Select
              id="select"
              label="Project"
              name="pid"
              required={true}
              filter={true}
              options={$selectStore.items}
              selected={$modalDataStore.pid}
            />
          </Block>
        {/if}
        {#if $modalDataStore.currentPage == 'projects'}
          <Block
            l=100
          >
            <Select
              id="select"
              label="Client"
              name="cid"
              required={true}
              filter={true}
              options={$selectStore.items}
              selected={$modalDataStore.cid}
            />
          </Block>
        {/if}
      </Container>
      <Container
        spacing={spacingModal}
        style="align-items: center; margin-top: 24px;"
      >
        {#if $modalDataStore.id}
          <Block style="margin-left: auto;">
            <Button
              text="Delete"
              type="button"
              classes="small secondary borderless"
              style="opacity: .75;"
              onclick={delete_item}
            />
          </Block>
        {/if}
        <Block
          style={$modalDataStore.id ? 'padding-left: 18px;' : 'margin-left: auto'}
        >
          <Button
            text="Cancel"
            type="button"
            classes="secondary"
            onclick={modalHandler.action.bind(modalHandler)}
          />
        </Block>
        <Block
          style="padding-left: 18px;"
        >
          {#if !$loaderStore.loaded}
            <Placeholder
              style="width: 96px;"
            />
          {:else}
            <Button
              text="Save"
              type="submit"
              classes="primary"
            />
          {/if}
        </Block>
      </Container>
    {/if}
  </form>
</Modal>