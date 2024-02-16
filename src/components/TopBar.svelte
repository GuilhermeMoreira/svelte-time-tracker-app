<script>
  import Container from '../components/Container.svelte'
  import Block from '../components/Block.svelte'

  export let mobMenuAction
</script>

<div class="top-bar">
  <Container spacing=24 style="align-items: center;">
    <Block>
      <img src="/img/logo.svg" class="main-logo" alt="Logo">
    </Block>
    <Block style="margin-left: auto;">
      <div class="mobile-menu" on:click={mobMenuAction()}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Block>
  </Container>
</div>

<style lang="scss">
  @import '../scss/media-sizes';
  .top-bar {
    display: none;
  }
  :global(.top-nav a, .top-nav .link) {
    text-decoration: none;
    font-family: "Poppins";
    font-size: 14px;
  }
  :global(.top-nav ion-icon) {
    display: inline-block;
    vertical-align: middle;
    width: 16px;
  }
  .mobile-menu {
    display: none;
    margin-left: auto;
    cursor: pointer;
    div {
      width: 24px;
      height: 3.2px;
      margin-bottom: 4.8px;
      background-color: var(--color_21);
      border-radius: 2px;
    }
  }
  @media screen and (max-width: $mediaQueryMid) {
    .top-bar {
      display: block;
    }
    .mobile-menu {
      display: block;
    }
  }
</style>
