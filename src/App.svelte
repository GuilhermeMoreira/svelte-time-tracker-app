<script>
  import { initializeApp } from 'firebase/app'
  import { getAuth, onAuthStateChanged } from 'firebase/auth'
  import { getFirestore, doc, getDoc } from 'firebase/firestore'
  import { firebaseConfig } from './firebaseConfig';
	import { Router, Route } from 'svelte-routing'
  import { setContext } from 'svelte'
  import { subscribe } from './helpers/subscribe'
  import { pages } from './data/pages'
  import { DataStore } from './helpers/DataStore'
  import TopBar from './components/TopBar.svelte'
  import { PageMarker } from './helpers/pageMarker'
  import LeftMenuBar from './components/LeftMenuBar.svelte'
  import RightColumn, { MobMenuHandler } from './components/RightColumn.svelte'
  import Loader, { LoaderHandler } from './components/Loader.svelte'
  import { ModalHandler } from './components/Modal.svelte'
  import SnackBar, { SnackBarHandler } from './components/SnackBar.svelte'
  import { Tracker } from './pages/TimeTracker.svelte'

  export let authStore = subscribe()

  // Account creation / Settings
  export let createAccountStore = subscribe()
  export let settingsSnapshot, userSettingsStore
  $: if ($authStore.user) {
    let dataModel = $createAccountStore.data ? $createAccountStore.data : {}
    settingsSnapshot = new DataStore('settings', dataModel, `user_${$authStore.user.uid}`)
    userSettingsStore = settingsSnapshot.store()
  }
  $: if (!$authStore.user && $userSettingsStore) {
    userSettingsStore.set({})
  }

  // Theme
  let themeStore = subscribe()
  themeStore.set({theme: localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'})
  $: if ($userSettingsStore && $userSettingsStore.theme) {
    themeStore.set({theme: $userSettingsStore.theme})
  }
  $: if ($themeStore.theme) {
    localStorage.setItem('theme', $themeStore.theme)
    let prefix = 'theme_'
    let regx = new RegExp(`\\b${prefix}[^ ]*[ ]?\\b`, 'g')
    document.body.className = document.body.className.replace(regx, '')
    document.body.classList.add(`theme_${$themeStore.theme}`)
  }
  
  // Auth
  export const firebaseApp = initializeApp(firebaseConfig)
  export const auth = getAuth(firebaseApp)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // const uid = user.uid
      // console.log('User is signed in')
      // console.log(user.accessToken)
      authStore.set({
        user: {
          email: user.email,
          uid: user.uid,
          token: user.accessToken
        }
      })
      snackBarHandler.action('You are Logged In', 3000)
      setTimeout(function() {
        loaderHandler.end()
      }, 1000);
    } else {
      // User is signed out
      // ...
      // console.log('User is signed out')
      authStore.set({user: false})
      setTimeout(function() {
        loaderHandler.end()
      }, 1000);
    }
  });

  const db = getFirestore(firebaseApp)
  setContext('db', db)

  export let pageMarker = new PageMarker()

  export let mobMenuHandler = new MobMenuHandler()

  export let loaderHandler = new LoaderHandler()
  export let loaderStore = loaderHandler.store()
  loaderHandler.init()

  export let snackBarHandler = new SnackBarHandler()
  export let snackBarStore = snackBarHandler.store()
  
  export let url = ''

  // Time Tracker
  let trackerDataModel = {
    time: {
      sec: '00',
      min: '00',
      hr: '00'
    },
    state: 'off'
  }
  export let tracker = new Tracker(trackerDataModel)
  export let trackerStore = tracker.store()
  trackerStore.set(trackerDataModel)
  window.onbeforeunload = function() {
    let msg = `You have unsaved tracked time. Your tracked data will be lost. Are you sure?`
    if ($trackerStore.state != 'off') return msg
  }
  export let timerSecStore = subscribe()
  export let timerMinStore = subscribe()
  export let timerHrStore = subscribe()
  
  // Modal pages
  import CreateAccount from './pages/CreateAccount.svelte'
  export let CreateAccountModal = new ModalHandler()
  import LogIn from './pages/LogIn.svelte'
  export let logInModal = new ModalHandler()
  import UserSettings from './pages/UserSettings.svelte'
  export let userSettingsModal = new ModalHandler()
</script>

{#if !$authStore.user}
  <CreateAccount
    {auth}
    {authStore}
    {createAccountStore}
    {snackBarHandler}
    modalHandler={CreateAccountModal}
  />
  <LogIn
    {auth}
    modalHandler={logInModal}
  />
{:else}
  <UserSettings
    {auth}
    {authStore}
    userSettingsStore={userSettingsStore}
    modalHandler={userSettingsModal}
  />
{/if}

<Loader
  store={loaderStore}
  full={true}
/>
<Router url="{url}">
  <div class="outter-container">
    <LeftMenuBar
      {auth}
      {authStore}
      pageMarker={pageMarker}
      items={pages.menu}
    />
    <main class="main-content">
      <TopBar
        {authStore}
        mobMenuAction={mobMenuHandler.action.bind(mobMenuHandler)}
      />
      {#each pages.routes as page}
        {#if ($authStore.user && !page.public) || page.public}
          <Route
            {authStore}
            {snackBarHandler}
            path={page.path}
            component={page.component}
            tracker={page.path == '/' ? tracker : null}
            trackerStore={page.path == '/' ? trackerStore : null}
            timerSecStore={page.path == '/' ? timerSecStore : null}
            timerMinStore={page.path == '/' ? timerMinStore : null}
            timerHrStore={page.path == '/' ? timerHrStore : null}
            createAccountHandler={page.path == '/' ? CreateAccountModal : null}
            logInHandler={page.path == '/' ? logInModal : null}
          />
        {/if}
      {/each}
    </main>
    <RightColumn
      {auth}
      {authStore}
      {pages}
      mobMenuHandler={mobMenuHandler}
      userSettingsHandler={userSettingsModal}
      userSettingsStore={userSettingsStore}
      createAccountHandler={CreateAccountModal}
      logInHandler={logInModal}
    />
  </div>

  <!-- svelte-ignore css-unused-selector -->  
  <style lang="scss">
    @import './scss/theme-dark';
    @import './scss/theme-light';
    @import './scss/reset';
    @import './scss/media-sizes';
    @import './scss/grid';
    @import './scss/global';
    @import './scss/datatables';
  </style>
</Router>

<SnackBar
  store={snackBarStore}
/>