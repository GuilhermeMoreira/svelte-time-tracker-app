<script>
  import { subscribe } from '../../helpers/subscribe'
	import Container from '../../components/Container.svelte'
  import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
	import Button from '../../components/Button.svelte'
  import Placeholder from '../../components/Placeholder.svelte'
	import Input from '../../components/Input.svelte'
	import Modal, { ModalHandler } from '../../components/Modal.svelte'
  // import { Link } from 'svelte-routing'
  import { FormHandler } from '../../helpers/formHandler'
  import SnackBar, { SnackBarHandler } from '../../components/SnackBar.svelte'
  import Checkbox, { CheckboxHandler } from '../../components/Checkbox.svelte'

  export let formHandler, authStore

  function callback(valid) {
    let msg = 'Information sent to the server';
    let time = 3000
    let status = 'success'
    if (!valid) {
      msg = 'Mandatory Check is a required field';
      time = 4000
      status = 'error'
    }
    store.set({loaded: true})
    snackBarHandler.action(msg, time, status)
  }

  export let modalHandler = new ModalHandler()
  export let spacingModal = 36
  
  $: if ($authStore.user) {
    formHandler = new FormHandler(callback, $authStore.user.uid, store, dataLoading)
  }

  let snackBarHandler = new SnackBarHandler()
  export let snackBarStore = snackBarHandler.store()

  let dataLoading = {
    data: {
      loaded: true
    }
  }
  export let store = subscribe()
  store.set(dataLoading.data)

  export let checkboxHandler = new CheckboxHandler(false)
	export let storeCheckbox = checkboxHandler.store()
</script>

<Container spacing=24>
  <PageTitle
		title="Modal"
		breadcrumb={{
			text: 'Back to Components',
			link: '/components'
		}}
	/>
  <Block>
    <Button
      text="Open"
      type="button"
      style="primary small"
      onclick={modalHandler.action.bind(modalHandler)}
    />
  </Block>
</Container>

<Modal
  columns=1
  title="Modal"
  subtitle="This is the base modal"
  spacingContainer={spacingModal}
  handler={modalHandler}
>
  <form collection="form_test" on:submit={formHandler.submit.bind(formHandler)}>
    <Container
      spacing={spacingModal}
    >
      <Block
        l=100
      >
        <Input
          id="input_one"
          label="Input One"
          type="text"
          name="input_one"
          required={true}
        />
      </Block>
      <Block
        l=100
      >
        <Input
          id="input_two"
          label="Input Two"
          type="text"
          name="input_two"
          required={true}
        />
      </Block>
      <Block l=100>
        <Checkbox
          id="checkbox"
          label="Mandatory Check"
          name="mandatory_check"
          store={storeCheckbox}
          onclick={checkboxHandler.action.bind(checkboxHandler)}
          required={true}
        />
      </Block>
    </Container>
    <Container
      spacing={spacingModal}
    >
      <Block
        style="margin-top: 24px; margin-left: auto;"
      >
        <Button
          text="Close"
          type="button"
          style="secondary"
          onclick={modalHandler.action.bind(modalHandler)}
        />
      </Block>
      <Block
        style="margin-top: 24px; padding-left: 18px;"
      >
        {#if !$store.loaded}
          <Placeholder
            style="width: 96px;"
          />
        {:else}
          <Button
            text="Send"
            type="submit"
            style="primary"
          />
        {/if}
      </Block>
      <!-- <Block
        l=100
        style="text-align: right;"
      >
        <Link to="/">I Forgot my password</Link>
      </Block> -->
    </Container>
  </form>
</Modal>

<SnackBar
  store={snackBarStore}
/>