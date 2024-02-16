<script context="module">
  import { subscribe } from '../helpers/subscribe'

  export class ModalHandler {
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
  import { fade, fly } from 'svelte/transition'
  import OutClick from 'svelte-outclick'
  
  export let columns, title, subtitle, spacingContainer, handler
  export let store = handler.store()
</script>

{#if $store.open}
  <div class="modal" in:fade={{ duration: 200 }} out:fade={{ duration: 300 }}>
    {#if $store.open}
      <OutClick
        excludeByQuerySelector={['.mobile-menu-close .icon']}
        on:outclick={handler.outsideClick()}
      >
        <div class="card columns_{columns}" transition:fly={{ y: 100, duration: 200 }}>
          {#if title}
            <h1 style="margin-left: {spacingContainer}px;">
              {title}
            </h1>
          {/if}
          {#if subtitle}
            <p class="subtitle" style="margin-left: {spacingContainer}px;">
              {subtitle}
            </p>
          {/if}
          <slot></slot>
        </div>
      </OutClick>
    {/if}
  </div>
{/if}

<style lang="scss">
  @import '../scss/media-sizes';
  .modal {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--color_32);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow-y: auto;
    padding: 84px 0;
  }
  .card {
    border-radius: 12px;
    padding: 48px 24px;
    background-color: var(--color_24);
    &.columns_1 {
      width: 420px;
    }
    &.columns_2 {
      width: 840px;
    }
    h1 {
      color: var(--color_14);
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    .modal {
      padding: 60px 18px;
    }
    .card {
      padding: 48px 0;
      &.columns_1 {
        width: 100%;
      }
      &.columns_2 {
        width: 100%;
      }
    }
  }
</style>