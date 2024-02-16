<script>
  import { doc, setDoc } from 'firebase/firestore'
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
  import { getContext } from 'svelte'
  import Container from '../components/Container.svelte'
	import Block from '../components/Block.svelte'
	import Button from '../components/Button.svelte'
  import Input from '../components/Input.svelte'
  import Modal from '../components/Modal.svelte'
  import Placeholder from '../components/Placeholder.svelte'
  import { subscribe } from '../helpers/subscribe'

  export let modalHandler, auth, createAccountStore, snackBarHandler
  export let spacingModal = 36

  let db = getContext('db')

  export let loadingStore = subscribe()
  loadingStore.set({loaded: true})

  class NewUser {
    constructor(db) {
      this.db = db
    }
    async create(data) {
      return createUserWithEmailAndPassword(auth, data['email'], data['password'])
        .then((userCredential) => {
          this.uid = userCredential.user.uid
          let dataSettings = {
            theme: 'light',
            name: data['name']
          }
          createAccountStore.set({data: dataSettings})
          loadingStore.set({loaded: true})
          setTimeout(() => {
            return
          }, 500)
        })
        .catch((error) => {
          console.log(error.code)
          snackBarHandler.action(error.message, 4000, 'error')
          loadingStore.set({loaded: true})
        })
    }
    async profile(data) {
      return updateProfile(auth.currentUser, {
          displayName: data['name']
        })
        .then(() => {
          return
        })
        .catch((error) => {
          console.log(error.code)
          snackBarHandler.action(error.message, 4000, 'error')
        })
    }
    async setup(e) {
      e.preventDefault()
      loadingStore.set({loaded: false})
      const formData = new FormData(e.target)
      const data = {}
      for (let field of formData) {
        const [key, value] = field
        data[key] = value
      }
      await this.create(data)
      await this.profile(data)
    }
  }

  export let newUser = new NewUser(db)
</script>

<Modal
  columns=1
  title="Create an Account"
  subtitle="Enter your information"
  spacingContainer={spacingModal}
  handler={modalHandler}
>
  <form on:submit={newUser.setup.bind(newUser)}>
    <Container
      spacing={spacingModal}
    >
      <Block
        l=100
      >
        <Input
          id="name"
          label="Name"
          type="text"
          name="name"
          required={true}
        />
      </Block>
      <Block
        l=100
      >
        <Input
          id="email"
          label="Email"
          type="text"
          name="email"
          required={true}
        />
      </Block>
      <Block
        l=100
      >
        <Input
          id="password"
          label="Password"
          type="password"
          name="password"
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
          classes="secondary"
          onclick={modalHandler.action.bind(modalHandler)}
        />
      </Block>
      <Block
        style="margin-top: 24px; padding-left: 18px;"
      >
        {#if !$loadingStore.loaded}
          <Placeholder
            style="width: 94px;"
          />
        {:else}
          <Button
            text="Create"
            type="submit"
            classes="primary"
          />
        {/if}
      </Block>
    </Container>
  </form>
</Modal>