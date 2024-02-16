<script>
	import Container from '../../components/Container.svelte'
	import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
	import Switch, { SwitchHandler } from '../../components/Switch.svelte'
  import { DataStore } from '../../helpers/dataStore'

	export let authStore, snapshot, store

  export let collection = 'switch_example'
	export let switchHandler = new SwitchHandler()

	$: if ($authStore.user) {
	  snapshot = new DataStore(collection, switchHandler.dataModel, $authStore.user.uid)
	  store = snapshot.store()
	}
</script>

<Container spacing=24>
	<PageTitle
		title="Switch"
		breadcrumb={{
			text: 'Back to Components',
			link: '/components'
		}}
	/>
	<Block l=33 m=80>
		<Switch
			{store}
      id="switch"
      label="This is a Label"
      name="switch"
      onclick={switchHandler.action(snapshot).bind(switchHandler)}
			style="margin-left: 12px;"
		/>
	</Block>
</Container>