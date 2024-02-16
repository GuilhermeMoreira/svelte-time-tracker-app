<script>
  import { Link } from 'svelte-routing'
  import { onAuthStateChanged } from 'firebase/auth'
  import { subscribe } from '../helpers/subscribe'
  
  export let items, pageMarker, auth, authStore

  export let pageMarkerStore = pageMarker.store()
  pageMarkerStore.set({currentPage: window.location.pathname})
  window.addEventListener('popstate', function() {
    pageInfo()
  })

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      setTimeout(function() {
        pageInfo()
      }, 100);
    }
  })

  function pageInfo() {
    pageMarker.action()
    setTimeout(function() {
      for (let item of items) {
        if (item.link == $pageMarkerStore.currentPage) {
          pageTitleStore.set({title: `${item.text} - Svelte Time Tracker App`})
        }
      }
    }, 100);
  }

  pageInfo()

  export let pageTitleStore = subscribe()
  pageTitleStore.set({title: 'Svelte Time Tracker App'})

</script>

<svelte:head>
  <title>
    {$pageTitleStore.title}
  </title>
</svelte:head>

<nav class="main-nav">
  <ul>
    <li class="logo" title="Svelte Time Tracker App">
      <img src="/img/logo.svg" class="main-logo" alt="Logo">
    </li>
    {#each items as item}
      {#if ($authStore.user && !item.public) || item.public}
        <li class:active={item.link == $pageMarkerStore.currentPage}>
          <Link to={item.link} title={item.text} on:click={pageInfo}>
            {@html item.icon}
          </Link>
        </li>
      {/if}
    {/each}
  </ul>
</nav>

<style lang="scss">
  @import '../scss/media-sizes';
  nav {
    background: var(--color_8);
    padding-top: 9px;
  }
  .logo {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
  }
  li {
    margin: 6px 0;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      top: 12px;
      right: 0;
      z-index: 1;
      width: 2px;
      height: calc(100% - 24px);
      background-color: var(--color_15);
      transition: opacity .2s;
      opacity: 0;
    }
    &.active {
      &:after {
        opacity: 1 !important;
      }
    }
  }
  :global(.main-nav ion-icon) {
    color: var(--color_15);
    width: 24px;
    height: 24px;
    display: block;
    transition: color .2s;
  }
  :global(.main-nav a) {
    padding: 18px;
    display: block;
    transition: background-color .2s;
    &:hover {
      background-color: var(--color_13);
      :global(ion-icon) {
        color: var(--color_18);
      }
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    nav {
      display: none;
    }
  }
</style>