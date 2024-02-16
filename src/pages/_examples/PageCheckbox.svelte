<script>
	import Container from '../../components/Container.svelte'
	import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
	import Checkbox, { CheckboxHandler } from '../../components/Checkbox.svelte'

	export let checkboxHandler = new CheckboxHandler(false)
	export let store = checkboxHandler.store()
</script>

<Container spacing=24>
	<PageTitle
		title="Checkbox"
		breadcrumb={{
			text: 'Back to Components',
			link: '/components'
		}}
	/>
	<Block l=33 m=80>
		<Checkbox
      id="checkbox"
      label="This is a Label"
      name="checkbox"
      store={store}
      onclick={checkboxHandler.action.bind(checkboxHandler)}
      required={false}
		/>
	</Block>
</Container>