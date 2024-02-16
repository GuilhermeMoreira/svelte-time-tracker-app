<script>
	import Container from '../../components/Container.svelte'
	import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
	import Textarea from '../../components/Textarea.svelte'
</script>

<Container spacing=24>
	<PageTitle
		title="Textarea"
		breadcrumb={{
			text: 'Back to Components',
			link: '/components'
		}}
	/>
	<Block l=50 m=100>
		<Textarea
      id="textarea"
      label="This is a Label"
      name="textarea"
		/>
	</Block>
</Container>