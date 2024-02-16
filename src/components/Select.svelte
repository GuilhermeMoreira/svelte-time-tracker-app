<script>
  import { subscribe } from '../helpers/subscribe'
  import DropDown, {DropDownHandler} from './DropDown.svelte'

  export let id, label, name, selected, options, required, searchInput, dropDown, filter

  class SelectHandler {
    constructor(filter) {
      this.data = {
        selected: null,
        text: null,
        open: null,
        filter
      }
    }
    store() {
      return this._store = subscribe()
    }
    action(selected, text) {
      return () => {
        this.data.selected = selected
        this.data.text = text
        this._store.set(this.data)
      }
    }
    toggleSearch(open, searchInput) {
      this.data.open = open
      this._store.set(this.data)
      if (this.data.filter) { 
        setTimeout(function() {
          open ? searchInput.focus() : null
        }, 100);
      }
    }
    async optionsInit(options, handler) {
      return new Promise(resolve => {
        for (const i in options) {
          options[i].onclick = handler.action(options[i].value, options[i].text)
          if (options[i].value == selected) {
            handler.action(selected, options[i].text)()
          }
          if (i == options.length - 1) {
            options.unshift({text: 'No matches found', value: 'no-matches'})
            resolve(options)
          }
        }
      })
    }
    search(elem, dropDown) {
      dropDown.classList.remove('no-result')
      const value = elem.value.toLowerCase()
      const list = dropDown.querySelectorAll('li')
      let match = false
      for (var i = 0; i < list.length; i++) {
        const pattern = new RegExp('\\b' + value, 'i');
        if (pattern.test(list[i].innerHTML.toLowerCase())) {
          match = true
          list[i].classList.remove('no-match')
        } else {
          list[i].classList.add('no-match')
        }
        if (i == list.length - 1 && !match && value.length > 0) {
          dropDown.classList.add('no-result')
        }
      }
    }
  }
  
  export let selectHandler = new SelectHandler(filter)
  export let store = selectHandler.store()
  selectHandler.action(selected, 'Choose an option')()

  export let optionsProcess = []
  selectHandler.optionsInit(options, selectHandler)
    .then((data) => {
      optionsProcess = data
    })

  export let dropDownHandler = new DropDownHandler()
  dropDownHandler.secondaryAction = function(param) {
    selectHandler.toggleSearch(param, searchInput)
  }
    
</script>

<label class="label" for="{id}" on:click={dropDownHandler.action()}>
  {label}{required ? ' *' : ''}
  <span class="arrow">
    <ion-icon name="chevron-down-outline"></ion-icon>
  </span>
</label>
<div id={id} class="select" title={$store.text} on:click={dropDownHandler.action()}>
  &nbsp;
  <div class="selected-text">
    {$store.text}
  </div>
  <input class="search{$store.open ? ' active' : ''}" type="text" bind:this={searchInput} on:input={selectHandler.search(this, dropDown)} placeholder={filter ? 'Filter...' : 'Select...'}>
  <div bind:this={dropDown}>
    <DropDown  bind:this={dropDown}
      items={optionsProcess}
      anchor="left"
      handler={dropDownHandler}
      selectedText={$store.text}
      excludeClick={['.label', '.select', '.search', '.arrow']}
      noLineBreak={true}
    >
    </DropDown>
  </div>
</div>
<input type="hidden" name={name} value={$store.selected}>

<style lang="scss">
  @import '../scss/media-sizes';
  label {
    cursor: pointer;
    position: relative;
    .arrow {
      position: absolute;
      top: calc(100% + 19px);
      right: 7px;
      z-index: 2;
      cursor: pointer;
      :global(ion-icon) {
        display: inline-block;
        width: 18px;
        height: 18px;
      }
    }
  }
  .select {
    position: relative;
    background-color: var(--color_10);
    color: var(--color_3);
    border-radius: 6px;
    padding: 12px;
    padding-right: 33px;
    width: 100%;
    :global(.no-match) {
      display: none;
    }
    :global(.no-matches) {
      display: none;
    }
    :global(.no-result) {
      :global(.no-matches) {
        display: block;
      }
    }
    cursor: pointer;
  }
  .selected-text {
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--color_10);
    color: var(--color_3);
    border-radius: 6px;
    padding: 12px;
    padding-right: 33px;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .search {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: var(--color_10);
    color: var(--color_3);
    border-radius: 6px;
    padding: 12px;
    padding-right: 33px;
    width: 100%;
    cursor: auto;
    display: none;
    &:global(.active) {
      display: block
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    .select,
    .selected-text {
      padding: 15px;
      font-size: 18px;
      padding-right: 36px;
    }
    .search {
      font-size: 18px;
      padding: 15px;
      padding-right: 36px;
    }
    label {
      .arrow {
        top: calc(100% + 21px);
        right: 8px;
        cursor: pointer;
        :global(ion-icon) {
          width: 23px;
          height: 23px;
        }
      }
    }
  }
</style>