<script>
  import { Link } from 'svelte-routing'
  import Block from '../components/Block.svelte'

  export let title, subtitle, breadcrumb
</script>

<Block l=100 style="margin-bottom: 12px;">
  <h1>{title}</h1>
  {#if subtitle}
    <p class="subtitle">
      {subtitle}
    </p>
  {/if}
  {#if breadcrumb}
    <p class="breadcrumb">
      <ion-icon name="chevron-back-outline"></ion-icon>
      <Link to="{breadcrumb.link}">{breadcrumb.text}</Link>
    </p>
  {/if}
</Block>

<style lang="scss">
  @import '../scss/media-sizes';
  @media screen and (max-width: $mediaQueryMid) {
    .breadcrumb {
      :global(a) {
        font-size: 15px;
      }
    }
  }
</style>