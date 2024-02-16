<script context="module">
  import { subscribe } from '../helpers/subscribe'
  
  export class MobMenuHandler {
    constructor() {
      this.data = {
        open: false
      }
    }
    store() {
      return this._store = subscribe()
    }
    action() {
      this.data.open = !this.data.open ? true : false
      this._store.set(this.data)
    }
    outsideClick() {
      if (this.data.open) {
        this.action()
      }
    }
  }
</script>

<script>
  import { signOut } from 'firebase/auth';
  import { Link, navigate } from 'svelte-routing'
  import OutClick from 'svelte-outclick'
  import DropDown, {DropDownHandler} from './DropDown.svelte'
  import { menuAside } from '../helpers/menuAside'
  import { PageMarker } from '../helpers/pageMarker'
  import SnackBar, { SnackBarHandler } from '../components/SnackBar.svelte'

  export let mobMenuHandler, pages, userSettingsHandler, createAccountHandler, logInHandler, authStore, auth, userSettingsStore
  export let menuStore = mobMenuHandler.store()

  export let dropDownStore = subscribe()
  export let dropDownHandler = new DropDownHandler()
  export let dropDownItems = []

  $: if ($authStore.user) {
    let items = [{
        text: 'User Settings',
        onclick: userSettingsHandler.action.bind(userSettingsHandler)
      },{
        text: 'Log Out',
        onclick: logOut
    }]
    dropDownStore.set({items: [...dropDownItems, ...items]})
  } else if (typeof $authStore.user != 'undefined') {
    let items = [{
        text: 'Log In',
        onclick: logInHandler.action.bind(logInHandler)
      },{
        text: 'Create an Account',
        onclick: createAccountHandler.action.bind(createAccountHandler)
    }]
    dropDownStore.set({items: [...items, ...dropDownItems]})
  } else {
    dropDownStore.set({items: dropDownItems})
  }
  
  export let pageMarker = new PageMarker()
  export let pageMarkerStore = pageMarker.store()
  pageMarkerStore.set({currentPage: window.location.pathname})
  window.addEventListener('popstate', function() {
    pageMarker.action()
  })

  export let snackBarHandler = new SnackBarHandler()
  export let snackBarStore = snackBarHandler.store()

  export let menu = pages.menu

  function menuClick() {
    pageMarker.action()
    mobMenuHandler.action.bind(mobMenuHandler)()
  }

  function logOut() {
    signOut(auth).then(() => {
      // Sign-out successful.
      snackBarHandler.action('You are Logged Out', 3000)
      pageMarkerStore.set({currentPage: '/'})
      navigate('/', { replace: false })
    }).catch((error) => {
      // console.log(error.code)
      // console.log(error.message)
      snackBarHandler.action(error.message, 4000, 'error')
    });
  }
</script>

<OutClick
  excludeByQuerySelector={['.mobile-menu-close .icon']}
  on:outclick={mobMenuHandler.outsideClick()}
>
  <aside class:active={$menuStore.open}>
    <nav class="secondary-nav">
      <div class="mobile-menu-close">
        <div class="icon" on:click={mobMenuHandler.action.bind(mobMenuHandler)}>
          <ion-icon name="close-outline"></ion-icon>
        </div>
      </div>
      <ul>
        <!-- {#if $authStore.user}
          <li title="Notifications">
            <ion-icon name="notifications-outline"></ion-icon>
          </li>
        {/if} -->
        <li class="user-icon" on:click={dropDownHandler.action()} title="My Account">
          <div class="icon">
            {#if $userSettingsStore && $userSettingsStore.name}
              {$userSettingsStore.name.slice(0, 1).toUpperCase()}
            {:else}
              <ion-icon class="anonymous" name="person-outline"></ion-icon>
            {/if}
          </div>
          <ion-icon name="chevron-down-outline"></ion-icon>
          <DropDown
            items={$dropDownStore.items}
            anchor="right"
            handler={dropDownHandler}
            excludeClick={['.user-icon']}
          />
        </li>
      </ul>
    </nav>
    <nav class="mob-menu-aside">
      <ul>
        {#each menu as item}
          {#if ($authStore.user && !item.public) || item.public}
            <li class:active={item.link == $pageMarkerStore.currentPage}>
              <Link to="{item.link}" on:click={menuClick}>
                <span>{item.text} {@html item.icon}</span>
              </Link>
            </li>
          {/if}
        {/each}
      </ul>
    </nav>
    <nav class="menu-aside">
      <ul>
        {#each menuAside as item}
          {#if ($authStore.user && !item.public) || item.public}
            <li class:active={item.link ? item.link == $pageMarkerStore.currentPage : null}>
              {#if item.onclick}
                <span class="link" on:click="{item.onclick}">
                  <span>{item.text}</span>
                  {@html item.external ? '<ion-icon name="open-outline"></ion-icon>' : ''}
                </span>
              {:else}
                <Link to="{item.link}" on:click={menuClick}>
                  <span>{item.text}</span>
                  {@html item.external ? '<ion-icon name="open-outline"></ion-icon>' : ''}
                </Link>
              {/if}
            </li>
          {/if}
        {/each}
      </ul>
    </nav>
  </aside>
</OutClick>

<SnackBar
  store={snackBarStore}
/>

<style lang="scss">
  @import '../scss/media-sizes';
  aside {
    width: 200px;
    background: var(--color_8);
    padding: 18px 21px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    flex-wrap: wrap;
    :global(a) {
      color: var(--color_37);
    }
    :global(.link) {
      color: var(--color_37);
    }
  }
  .secondary-nav {
    width: 100%;
    ul {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    :global(ion-icon) {
      color: var(--color_15);
      display: block;
      width: 21px;
      height: 21px;
    }
  }
  li {
    margin-left: 15px;
    cursor: pointer;
    &:global(.active a) {
      color: var(--color_23);
    }
    &:global(.active span) {
      color: var(--color_23);
    }
  }
  .user-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      background-color: var(--color_19);
      color: var(--color_23);
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 50%;
      font-family: "Poppins";
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    :global(ion-icon) {
      display: block;
      width: 15px;
      color: var(--color_15)
    }
    .anonymous {
      display: block;
      width: 18px;
      height: 18px;
      margin: 0;
      color: var(--color_23);
      margin-top: -1px;
    }
  }
  .mobile-menu-close {
    display: none;
  }
  .mob-menu-aside {
    display: none;
  }
  .menu-aside {
    margin-top: auto;
  }
  .menu-aside,
  .mob-menu-aside {
    width: 100%;
    ul {
      display: block;
      li {
        text-align: right;
        margin: 30px 0;
        font-weight: 500;
        :global(a) {
          text-decoration: none !important;
        }
        :global(.link) {
          text-decoration: none !important;
        }
      }
    }
    :global(ion-icon) {
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-left: 3px;
      vertical-align: middle;
      margin-top: -3px;
    }
  }
  .menu-aside {
    ul {
      li {
        margin: 18px 0;
        font-size: 14px;
      }
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    aside {
      padding-top: 24px;
      transition: transform .2s;
      transform-origin: top right;
      transform: scaleX(0);
      // display: block;
      position: fixed;
      right: 0;
      top: 0;
      width: 80vw;
      height: 100vh;
      z-index: 90;
      box-shadow: 0 0 12px 0 rgba(0,0,0,.2);
      &.active {
        transform: scaleX(1);
      }
    }
    .secondary-nav {
      ul {
        padding: 6px;
      }
    }
    .mob-menu-aside {
      display: block;
      // margin-top: 48px;
      margin-top: auto;
      ul {
        padding-right: 6px;
      }
      li {
        font-size: 21px;
        margin: 42px 0 !important;
        &:last-of-type {
          margin-bottom: 24px !important;
        }
      }
    }
    .mobile-menu-close {
      display: flex;
      justify-content: flex-end;
      margin-top: -6px;
      margin-right: -5px;
      margin-bottom: 18px;
      .icon {
        cursor: pointer;
      }
      :global(ion-icon) {
        display: block;
        width: 39px !important;
        height: 39px !important;
        color: var(--color_21);
      }
    }
    .menu-aside {
      ul {
        padding-right: 6px;
      }
      margin-top: unset;
      margin: 0 -21px;
      width: calc(100% + 42px);
      padding: 9px 21px;
      background-color: var(--color_25);
      padding-bottom: 54px;
    }
    .secondary-nav {
      .user-icon {
        .icon {
          font-size: 20px;
          width: 38px;
          height: 38px;
        }
        :global(ion-icon) {
          width: 21px;
          height: 21px;
        }
        .anonymous {
          width: 24px;
          height: 24px;
          margin-top: -2px;
        }
      }
    }
    .secondary-nav,
    .mob-menu-aside {
      :global(ion-icon) {
        width: 27px;
        height: 27px;
      }
    }
  }
</style>