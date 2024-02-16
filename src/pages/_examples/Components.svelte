<script>
  import { navigate } from 'svelte-routing'
  import { Datatable } from 'svelte-simple-datatables'
  import { fixedHeight } from '../../helpers/fixedHeight'
	import Container from '../../components/Container.svelte'
  import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
  import Loader, { LoaderHandler } from '../../components/Loader.svelte'

  export let rows
  export let settings = {columnFilter: false}
  export const data = [
    {"component_name":"Button","description":"Button models","link":"/components/button"},
    {"component_name":"Input","description":"Our base Input","link":"/components/input"},
    {"component_name":"Select","description":"A selection combo box","link":"/components/select"},
    {"component_name":"Textarea","description":"Textarea for larger texts","link":"/components/textarea"},
    {"component_name":"Switch","description":"Toggle switch component","link":"/components/switch"},
    {"component_name":"Checkbox","description":"Checkboxes, for multiple selections","link":"/components/checkbox"},
    {"component_name":"Date Picker","description":"The calendar date picker input","link":"/components/datepicker"},
    {"component_name":"Modal","description":"One Modal to rule them all","link":"/components/modal"},
  ]

  export let loaderHandler = new LoaderHandler()
  export let loaderStore = loaderHandler.store()
  loaderHandler.init()
  setTimeout(function() {
    loaderHandler.end()
  }, 500);
</script>

<Container spacing=24>
  <PageTitle
		title="Components"
		subtitle="This is our available components"
	/>
  <Block l=100>
    <div class="content-height-table" style="position: relative;" use:fixedHeight>
      <Loader
        store={loaderStore}
        classes="content-height-table"
      />
      <Datatable
        {data}
        settings={settings}
        bind:dataRows={rows}
      >
        <thead class="case_1">
          <th></th>
          <th data-key="component_name">Component Name</th>
          <th>Description</th>
        </thead>
        <tbody class="case_1">
          {#if rows}
            {#each $rows as row}
              <tr>
                <td on:click={navigate(row.link, { replace: false })}>
                  <div class="icon">{row.component_name.slice(0, 1).toUpperCase()}</div>
                </td>
                <td on:click={navigate(row.link, { replace: false })}>{row.component_name}</td>
                <td on:click={navigate(row.link, { replace: false })}>{row.description}</td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </Datatable>
    </div>
  </Block>
</Container>
