<script>
  import { doc, setDoc } from 'firebase/firestore'
  import { updateProfile } from 'firebase/auth'
  import { updateEmail, EmailAuthProvider, updatePassword, reauthenticateWithCredential } from 'firebase/auth'
  import { getContext } from 'svelte'
  import Container from '../components/Container.svelte'
	import Block from '../components/Block.svelte'
	import Button from '../components/Button.svelte'
  import Select from '../components/Select.svelte'
  import Input from '../components/Input.svelte'
  import Modal from '../components/Modal.svelte'
  import Placeholder from '../components/Placeholder.svelte'
  import SnackBar, { SnackBarHandler } from '../components/SnackBar.svelte'
  import { subscribe } from '../helpers/subscribe'
  
  export let modalHandler, userSettingsStore, auth, authStore//, teamStore
  export let spacingModal = 36
  let db = getContext('db')

  export let loaderStore = subscribe()
  loaderStore.set({loaded: true})

  class UserSettings {
    validEmail(email) {
      return new Promise(resolve => {
        if (email != $authStore.user.email) {
          let credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            this.formData.get('current_password')
          )
          reauthenticateWithCredential(auth.currentUser, credential)
            .then(() => {
              updateEmail(auth.currentUser, email)
                .then(() => {
                  authStore.set({
                    user: {
                      email,
                      uid: auth.currentUser.uid
                    }
                  })
                  resolve()
                })
                .catch((error) => {
                  this.reject(error)
                })
            }).catch((error) => {
              this.reject(error)
            })
        } else {
          resolve()
        }
      })
    }
    validNewPass(pass) {
      return new Promise(resolve => {
        if (pass.length > 0) {
          let credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            this.formData.get('current_password')
          )
          reauthenticateWithCredential(auth.currentUser, credential)
            .then(() => {
              updatePassword(auth.currentUser, pass)
                .then(() => {
                  resolve()
                })
                .catch((error) => {
                  this.reject(error)
                })
            }).catch((error) => {
              this.reject(error)
            })
        } else {
          resolve()
        }
      })
    }
    validName(name) {
      return new Promise(resolve => {
        if (name != $userSettingsStore.name) {
          let credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            this.formData.get('current_password')
          )
          reauthenticateWithCredential(auth.currentUser, credential)
            .then(() => {
              updateProfile(auth.currentUser, {
                displayName: name
              })
                .then(() => {
                  resolve()
                })
                .catch((error) => {
                  this.reject(error)
              })
            }).catch((error) => {
              this.reject(error)
            })
        } else {
          resolve()
        }
      })
    }
    writeDoc() {
      return new Promise(resolve => {
        setDoc(doc(db, 'settings', `user_${$authStore.user.uid}`), this.data)
          .then(() => {
            resolve()
          })
          .catch((error) => {
            this.reject(error.message)
          })
      })
    }
    async submit(e) {
      e.preventDefault()
      loaderStore.set({loaded: false})
      this.formData = new FormData(e.target)
      this.data = {}
      for (let field of this.formData) {
        const [key, value] = field
        // Skip fields
        if (
          key != 'email' && 
          key != 'current_password' && 
          key !=  'new_password'
        ) {
          this.data[key] = value
        }
      }
      new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      .then(() => {
        snackBarHandler.action('Settings updated', 3000, 'success')
        loaderStore.set({loaded: true})
      })
      .catch((error) => {
        console.log(error.message)
        snackBarHandler.action(error.message, 4000, 'error')
        loaderStore.set({loaded: true})
      })
      if (
        this.formData.get('name') != $userSettingsStore.name ||
        this.formData.get('email') != $authStore.user.email ||
        this.formData.get('new_password').length > 0
      ) {
        if (this.formData.get('current_password').length == 0) {
          this.reject({message: 'Please provide your current password'})
          return
        }
      }
      await this.validEmail(this.formData.get('email'))
      await this.validNewPass(this.formData.get('new_password'))
      await this.validName(this.formData.get('name'))
      await this.writeDoc()
      this.resolve()
    }
  }
  
  export let userSettings
  $: if ($authStore.user) {
    userSettings = new UserSettings()
  }

  let snackBarHandler = new SnackBarHandler()
  export let snackBarStore = snackBarHandler.store()
</script>

<Modal
  columns=2
  title="User Settings"
  subtitle="User settings and preferences"
  spacingContainer={spacingModal}
  handler={modalHandler}
>
  <form on:submit={userSettings.submit ? userSettings.submit.bind(userSettings) : null}>
    <Container>
      <Block
        l=50 m=100
      >
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
              value={$userSettingsStore.name}
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
              value={$authStore.user.email}
            />
          </Block>
          <Block
            l=100
          >
            <Select
              id="theme"
              label="Theme"
              name="theme"
              filter={false}
              selected={$userSettingsStore.theme}
              options={[
                {
                  text: 'Dark',
                  value: 'dark'
                },
                {
                  text: 'Light',
                  value: 'light'
                }
              ]}
            />
          </Block>
        </Container>
      </Block>
      <Block
        l=50 m=100
      >
        <Container
          spacing={spacingModal}
        >
          <Block
            l=100
          >
            <Input
              id="current_password"
              label="Current Password"
              type="password"
              name="current_password"
              required={false}
            />
          </Block>
          <Block
            l=100
          >
            <Input
              id="new_password"
              label="New Password"
              type="password"
              name="new_password"
              required={false}
            />
          </Block>
        </Container>
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
        {#if !$loaderStore.loaded}
          <Placeholder
            style="width: 112px;"
          />
        {:else}
          <Button
            text="Save"
            classes="submit"
            style="primary"
          />
        {/if}
      </Block>
    </Container>
  </form>
</Modal>

<SnackBar
  store={snackBarStore}
/>