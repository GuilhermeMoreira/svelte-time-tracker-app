<script>
  import Container from '../../components/Container.svelte'
	import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
  import DatePicker from '../../components/DatePicker.svelte'
</script>

<Container spacing=24>
	<PageTitle
		title="Date Picker"
		breadcrumb={{
			text: 'Back to Components',
			link: '/components'
		}}
	/>
	<Block l=33 m=80>
    <DatePicker
      name="date"
      date="06/19/2022"
    />
  </Block>
</Container>