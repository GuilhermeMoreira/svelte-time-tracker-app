<script context="module">
  import { subscribe } from '../helpers/subscribe'
  
  export class LoaderHandler {
    constructor() {
      this.data = {
        classes: false
      }
    }
    store() {
      return this._store = subscribe()
    }
    init() {
      this.data.classes = 'charge'
      this._store.set(this.data)
    }
    end() {
      this.data.classes += ' load-ending'
      this._store.set(this.data)
      setTimeout(() => {
        this.data.classes += ' loaded'
        this._store.set(this.data)
      }, 100);
    }
  }
</script>

<script>
  export let store, full, classes, style
</script>

<div class="page-loader {classes ? ` ${classes}` : ''} {$store.classes}{`${full ? ' full' : ''}`}" style={style}>
  <div class="loader" style="opacity: 0;"></div>
</div>

<style lang="scss">
  @import '../scss/media-sizes';
  .page-loader {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    &.full {
      z-index: 200;
      width: 100vw;
      height: 100vh;
    }
    background-color: var(--color_7);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity .1s;
    .loader {
      width: 54px;
      height: 54px;
      transition: opacity .1s;
      background-size: contain;
      background-image: url(/img/loader.svg);
    }
    &:global(.charge) {
      .loader {
        opacity: .8 !important;
      }
    }
    &:global(.load-ending) {
      opacity: 0;
    }
    &:global(.loaded) {
      display: none;
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    .page-loader {
      .loader {
        margin-top: -114px;
      }
    }
  }
</style>