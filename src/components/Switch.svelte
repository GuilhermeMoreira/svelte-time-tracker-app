<script context="module">
  export class SwitchHandler {
    constructor() {
      this.dataModel = {
        checked: false
      }
    }
    loader(snapshot) {
      let previousData = snapshot.data
      previousData.loaded = false
      snapshot._store.set(previousData)
    }
    action(snapshot) {
      return function() {
        this.loader(snapshot)
        snapshot.data.checked = snapshot.data.checked ? false : true
        snapshot.update(snapshot.data)
      }
    }
  }
</script>

<script>
  import Placeholder from './Placeholder.svelte'

  export let id, label, name, store, onclick, style
</script>

<input id={id} name={name} value={$store.checked ? 1 : 0} type="checkbox" checked="checked">
<label class="{`${ $store.loaded ? ($store.checked ? 'checked' : 'unchecked') : ''}`}" for="{id}" on:click={onclick}>
  <span>
    {label}
  </span>
  {#if !$store.loaded}
    <Placeholder
      style="margin-left: 6px; width: 48px; margin-top: 3px;"
    />
  {/if}
  <ion-icon class="icon_unchecked" style={style} name="toggle-outline"></ion-icon>
  <ion-icon class="icon_checked" style={style} name="toggle"></ion-icon>
</label>

<style lang="scss">
  label {
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 48px;
  }
  ion-icon {
    cursor: pointer;
    display: none;
    width: 48px;
    height: 48px;
  }
  .icon_unchecked {
    transform: rotate(180deg);
    opacity: .6;
  }
  .icon_checked {
    color: var(--color_5);
    filter: var(--filter_main);
  }
  .checked {
    .icon_checked {
      display: inline-block;
    }
    .icon_unchecked {
      display: none;
    }
  }
  .unchecked {
    .icon_checked {
      display: none;
    }
    .icon_unchecked {
      display: inline-block;
    }
  }
</style>