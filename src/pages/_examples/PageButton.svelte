<script>
	import Container from '../../components/Container.svelte'
	import Block from '../../components/Block.svelte'
	import PageTitle from '../../components/PageTitle.svelte'
	import Button from '../../components/Button.svelte'
	import { DataStore } from '../../helpers/dataStore'
	import Placeholder from '../../components/Placeholder.svelte'

	export class ButtonCount {
		constructor() {
			this.dataModel = {
				count: 0
			}
		}
		loader(snapshot) {
			let previousData = snapshot.data
			previousData.loaded = false
			snapshot._store.set(previousData)
		}
		action(snapshot) {
			return function() {
				this.loader(snapshot)
				snapshot.data.count++
				snapshot.update(snapshot.data)
			}
		}
		render(content) {
			return `click to add ${typeof content.count != 'undefined' ? content.count : ''}`
		}
	}

	export let snapshot, store, authStore
	export let collection = 'button_count'
	export let buttonCount = new ButtonCount()

	$: if ($authStore.user) {
		snapshot = new DataStore(collection, buttonCount.dataModel, $authStore.user.uid)
		store = snapshot.store()
	}
</script>

<Container spacing=24 style="align-items: center;">
	<PageTitle
		title="Button"
		breadcrumb={{
			text: 'Back to Components',
			link: '/components'
		}}
	/>
	<Block>
		<Button
			text="Small"
			type="button"
			style="primary small"
		/>
	</Block>
	<Block>
		<Button
			text="Secondary"
			type="button"
			style="secondary"
		/>
	</Block>
	<Block>
		{#if !$store.loaded}
			<Placeholder
				style="width: 234px; height: 40px;"
			/>
		{:else}
			<Button
				text={`Primary, ${buttonCount.render($store)}`}
				type="button"
				style="primary"
				onclick={buttonCount.action(snapshot).bind(buttonCount)}
			/>
		{/if}
	</Block>
</Container>