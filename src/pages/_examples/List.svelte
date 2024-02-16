<script>
  import { Datatable } from 'svelte-simple-datatables'
  import { fixedHeight } from '../../helpers/fixedHeight'
	import Container from '../../components/Container.svelte'
  import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
  import Loader, { LoaderHandler } from '../../components/Loader.svelte'
  import { data } from '../../helpers/data.example'

  export let rows
  export let settings = {columnFilter: false}

  export let loaderHandler = new LoaderHandler()
  export let loaderStore = loaderHandler.store()
  loaderHandler.init()
  setTimeout(function() {
    loaderHandler.end()
  }, 500);
</script>

<Container spacing=24>
  <PageTitle
		title="List"
		subtitle="An example of a large list of items"
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
          <th data-key="first_name">First Name</th>
          <th data-key="last_name">Last Name</th>
          <th data-key="email">Email</th>
        </thead>
        <tbody class="no-click case_1">
        {#if rows}
            {#each $rows as row}
            <tr>
                <td>
                  <div class="icon">{row.first_name.slice(0, 1).toUpperCase()}</div>
                </td>
                <td>{row.first_name}</td>
                <td>{row.last_name}</td>
                <td>{row.email}</td>
            </tr>
            {/each}
        {/if}
        </tbody>
      </Datatable>
    </div>
  </Block>
</Container>
