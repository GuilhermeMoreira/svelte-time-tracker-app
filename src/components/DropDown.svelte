<script context="module">
  import { subscribe } from '../helpers/subscribe'

  export class DropDownHandler {
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
      if (this.secondaryAction) {
        this.secondaryAction(this.data.open)
      }
    }
    outsideClick() {
      if (this.data.open) {
        this.action()
      }
    }
  }
</script>

<script>
  import OutClick from 'svelte-outclick'

  export let items, anchor, handler, excludeClick, noLineBreak
  export let store = handler.store()
</script>

<OutClick
  includeSelf={true}
  excludeByQuerySelector={excludeClick}
  on:outclick={handler.outsideClick()}
>
  <ul class={`${$store.open ? 'active' : ''} anchor_${anchor}`}>
    {#each items as item}
      <li on:click={item.onclick} class={`${!noLineBreak ? 'noLineBreak ' : ''}${item.value == 'no-matches' ? 'no-matches' : ''}`}>
        {item.text}
      </li>
    {/each}
  </ul>
</OutClick>

<style lang="scss">
  @import '../scss/media-sizes';
  ul {
    position: absolute;
    z-index: 2;
    top: calc(100% + 3px);
    background-color: var(--color_28);
    border-radius: 9px;
    padding: 9px 0;
    box-shadow: 0 6px 9px 0 rgba(0, 0, 0, 0.2);
    transform: scale(0);
    transition: transform .1s, opacity .1s;
    opacity: 0;
    max-width: 80vw;
    &.active {
      transform: scale(1);
      opacity: 1;
    }
    &.anchor_right {
      right: 0;
      transform-origin: top right;
      li {
        text-align: right;
      }
    }
    &.anchor_left {
      left: 0;
      transform-origin: top left;
      li {
        text-align: left;
      }
    }
    li {
      padding: 12px 36px;
      transition: background-color .1s, color .1s;
      color: var(--color_27);
      &:hover {
        background-color: var(--color_22);
        color: var(--color_26);
      }
      &.noLineBreak {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    ul {
      li {
        font-size: 19px;
        padding: 15px 39px;
      }
    }
  }
</style>