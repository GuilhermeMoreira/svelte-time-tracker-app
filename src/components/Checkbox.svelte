<script context="module">
  import { subscribe } from '../helpers/subscribe'

  export class CheckboxHandler {
    constructor(checked) {
      this.data = {
        checked
      }
    }
    action() {
      this.data.checked = this.data.checked ? false : true
      this._store.set(this.data)
    }
    store() {
      return this._store = subscribe()
    }
  }
</script>

<script>
  export let id, label, name, store, onclick, required
</script>

<input id={id} name={name} value={$store.checked ? 1 : 0} type="hidden">
<div class="box">
  <label class="{`${$store.checked ? 'checked' : 'unchecked'}`}" for="{id}" on:click={onclick}>
    <div class="icon">
      <div class="checkbox"></div>
      <ion-icon class="check" name="checkmark-outline"></ion-icon>
    </div>
    <span>
      {label}{required ? ' *' : ''}
    </span>
  </label>
</div>

<style lang="scss">
  .box {
    display: inline-block;
  }
  label {
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 24px;
  }
  ion-icon {
    cursor: pointer;
    display: none;
    width: 39px;
    height: 39px;
    color: var(--color_5);
  }
  .icon {
    position: relative;
    margin-right: 12px;
  }
  .check {
    position: absolute;
    top: -10px;
    left: -3px;
  }
  // .icon_checked {
  //   filter: var(--filter_main);
  // }
  .checkbox {
    width: 24px;
    height: 24px;
    background-color: transparent;
    border: 2px solid var(--color_31);
    border-radius: 3px;
  }
  .checked {
    .check {
      display: inline-block;
    }
  }
  .unchecked {
    .check {
      display: none;
    }
  }
</style>