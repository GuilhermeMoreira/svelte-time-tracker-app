<script>
  export let size, style
  if (!size) size = 'medium'
</script>

<div class="placeholder {size}" {style}>
  <div class="dot-flashing"></div>
</div>

<style lang="scss">
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    &.small {
      .dot-flashing {
        margin-left: 9px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        &:before {
          left: -9px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        &:after {
          left: 9px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
      }
    }
    &.medium {
      .dot-flashing {
        margin-left: 14px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        &:before {
          left: -14px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        &:after {
          left: 14px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
      }
    }
    &.big {
      .dot-flashing {
        margin-left: 22px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        &:before {
          left: -22px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
        }
        &:after {
          left: 22px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
        }
      }
    }
  }
  .dot-flashing {
    position: relative;
    background-color: var(--color_19);
    color: var(--color_19);
    animation: dotFlashing .5s infinite linear alternate;
    animation-delay: .2s;
    &:before, &:after {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
    }
    &:before {
      background-color: var(--color_19);
      color: var(--color_19);
      animation: dotFlashing .5s infinite alternate;
      animation-delay: 0s;
    }
    &:after {
      background-color: var(--color_19);
      color: var(--color_19);
      animation: dotFlashing .5s infinite alternate;
      animation-delay: .3s;
    }
  }
  @keyframes dotFlashing {
    0% {
      background-color: var(--color_16);
    }
    50%,
    100% {
      background-color: var(--color_2);
    }
  }
</style>