<script>
  export let l, m, s, style
</script>

<div class="block{l ? ` l_${l}` : ''}{m ? ` m_${m}` : ''}{s ? ` s_${s}` : ''}" style={style || style}>
  <slot></slot>
</div>
