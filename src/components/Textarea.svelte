<script>
  export let id, label, name, value, required
</script>

<label for="{id}">
  {label}{required ? ' *' : ''}
</label>
<textarea id={id} name={name} value={value || null} required={required ? 'required' : null}/>

<style lang="scss">
  @import '../scss/media-sizes';
  textarea {
    background-color: var(--color_10);
    color: var(--color_3);
    border-radius: 6px;
    padding: 12px;
    width: 100%;
    height: 150px;
  }
  @media screen and (max-width: $mediaQueryMid) {
    textarea {
      font-size: 18px;
      padding: 15px;
    }
  }
</style>