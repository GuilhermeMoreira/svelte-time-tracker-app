<script context="module">
  import { subscribe } from '../helpers/subscribe'

  export class SnackBarHandler {
    constructor() {
      this.data = {
        message: false,
        status: false
      }
    }
    store() {
      return this._store = subscribe()
    }
    action(message, delay, status = 'default') {
      this.data.status = status
      this.data.message = message
      this._store.set(this.data)
      this.timeout ? clearTimeout(this.timeout) : null
      this.timeout = setTimeout(() => {
        this.data.message = false
        this._store.set(this.data)
      }, delay)
    }
  }
</script>

<script>
  import { fade, fly } from 'svelte/transition'

  export let store
</script>

{#if $store.message}
  <div class="snack{$store.status ? ` ${$store.status}` : ''}" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
    <div class="message" transition:fly={{ y: 100, duration: 200 }}>
      {$store.message}
    </div>
  </div>
{/if}

<style lang="scss">
  @import '../scss/media-sizes';
  .snack {
    position: fixed;
    z-index: 300;
    right: 42px;
    bottom: 42px;
    .message {
      padding: 15px 24px;
      color: #fff;
      background-color: var(--color_33);
      border-radius: 6px;
    }
    &:global(.error) {
      .message {
        background-color: var(--color_38);
      }
    }
    &:global(.success) {
      .message {
        background-color: var(--color_39) !important;
        color: var(--color_4);
      }
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    .snack {
      right: 24px;
      bottom: 24px;
    }
  }
</style>