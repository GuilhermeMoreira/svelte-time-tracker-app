<script>
	import Container from '../../components/Container.svelte'
	import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
	import Select from '../../components/Select.svelte'
</script>

<Container spacing=24>
	<PageTitle
		title="Select"
		breadcrumb={{
			text: 'Back to Components',
			link: '/components'
		}}
	/>
	<Block l=33 m=80>
		<Select
      id="select"
      label="This is a Label"
      name="select"
      filter={true}
      options={[
        {
          text: 'Option 1',
          value: 1
        },
        {
          text: 'Option 2',
          value: 2
        },
        {
          text: 'Option with a long long text just to try',
          value: 3
        },
      ]}
		/>
	</Block>
</Container>