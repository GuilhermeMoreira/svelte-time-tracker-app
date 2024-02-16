<script>
  export let classes
</script>

<div class="scrollabel {classes}">
  <slot></slot>
</div>

<style lang="scss">
  .scrollabel {
    overflow-x: auto;
    margin-right: -12px;
    padding-right: 12px;
  }
</style>