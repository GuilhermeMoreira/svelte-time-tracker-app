<script>
	import Container from '../../components/Container.svelte'
	import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
	import Input from '../../components/Input.svelte'
</script>

<Container spacing=24>
	<PageTitle
		title="Input"
		breadcrumb={{
			text: 'Back to Components',
			link: '/components'
		}}
	/>
	<Block l=33 m=80>
		<Input
      id="input"
      label="This is a Label"
			type="text"
      name="input"
		/>
	</Block>
</Container>