<script>
  import SveltyPicker from 'svelty-picker'
  
  export let date, name

  date = date ? date : null

  function blur(e) {
    e.target.blur()
  }
</script>

<label for="datepicker">
  This is a label
</label>
<div class="datepicker">
  <SveltyPicker
    {name}
    inputClasses="input"
    format="mm/dd/yyyy"
    bind:value={date}
    weekStart={0}
    on:input={blur}
  />
  <ion-icon name="calendar-clear-outline"></ion-icon>
</div>

<style lang="scss">
  @import '../scss/media-sizes';
  .datepicker {
    display: flex;
    align-items: center;
    :global(.input) {
      background-color: var(--color_10);
      color: var(--color_3);
      border-radius: 6px;
      padding: 12px;
      width: 100%;
    }
    ion-icon {
      height: 36px;
      margin-left: 9px;
      display: block;
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    .datepicker {
      :global(.input) {
        font-size: 18px;
        padding: 15px;
      }
    }
  }
</style>