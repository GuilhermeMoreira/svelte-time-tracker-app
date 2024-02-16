<script>
	import { chart } from 'svelte-apexcharts';
	import { fixedHeight } from '../../helpers/fixedHeight'
	import Container from '../../components/Container.svelte'
	import PageTitle from '../../components/PageTitle.svelte'
	import Block from '../../components/Block.svelte'
	import Scrollabel from '../../components/Scrollabel.svelte'

	let options1 = {
		series: [{
			name: 'series1',
			data: [31, 40, 28, 51, 42, 109, 100]
		}, {
			name: 'series2',
			data: [11, 32, 45, 32, 34, 52, 41]
		}],
			chart: {
			height: 350,
			type: 'area'
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth'
		},
		xaxis: {
			type: 'datetime',
			categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
		},
		tooltip: {
			x: {
				format: 'dd/MM/yy HH:mm'
			},
		}
	}
</script>

<Container spacing=24>
	<PageTitle
		title="Miscellaneous Page"
		subtitle="A base templates for creating informative pages"
	/>
	<Block l=100>
		<div use:fixedHeight>
			<Scrollabel
				classes="content-height-text"
			>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sem risus, aliquam non felis nec, iaculis interdum ex. Aliquam erat volutpat. Donec eleifend nunc eget tellus vehicula, laoreet porta justo faucibus. Praesent lacus erat, iaculis non odio quis, lobortis ultrices diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent quam orci, porta vitae metus in, vulputate eleifend felis. Pellentesque at ullamcorper lectus. Mauris vel dictum velit. Aliquam ornare, felis id facilisis aliquam, leo ante scelerisque lacus, eget rhoncus leo arcu quis magna.
				</p>

				<div use:chart={options1} class="chart-box"/>

				<p>
					Cras aliquet sodales quam a hendrerit. Suspendisse eu fermentum leo, at laoreet nibh. Nulla facilisi. Maecenas nibh nisl, eleifend sit amet tempor sit amet, pharetra nec velit. Phasellus ut molestie velit, at dapibus sapien. Mauris in erat vehicula, sagittis velit id, pellentesque turpis. Aliquam laoreet augue eu sem vehicula, id malesuada eros molestie. Mauris condimentum accumsan elit, ac pretium lacus. Donec a hendrerit sapien, vel ultricies eros. Curabitur lobortis eget lectus eu ultrices. Ut ut leo tempor, maximus nisi et, consequat erat. Curabitur interdum sodales libero, sit amet cursus orci pharetra vitae. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse porta magna a diam aliquam, at imperdiet tellus efficitur. Aenean viverra lacus erat, at pellentesque neque molestie non.
				</p>

				<p>
					Phasellus convallis id turpis in commodo. Praesent pulvinar, urna ut rhoncus mollis, nisl dui volutpat odio, sed pharetra massa justo ut sem. Aliquam erat volutpat. Fusce eleifend sollicitudin venenatis. Cras tellus nisi, consectetur in lobortis quis, pharetra non lectus. Cras turpis est, consequat et tincidunt sit amet, ultricies ac justo. In a nibh tempor orci pulvinar sagittis. Cras elementum, ex nec porta mollis, dui risus facilisis enim, et pretium risus enim eget augue. Sed luctus enim id porta consequat.
				</p>

				<p>
					Fusce vitae lectus ultricies, egestas urna eget, suscipit augue. Etiam urna enim, egestas nec erat sed, suscipit vulputate purus. Sed sollicitudin libero et enim pellentesque, ac fringilla odio consequat. Morbi vulputate volutpat nunc, sit amet fringilla nunc sodales sed. Fusce ac finibus nibh, quis iaculis nisl. In ullamcorper mi a urna congue porta. Maecenas porttitor egestas accumsan.
				</p>

				<p>
					Sed ornare metus non elit elementum, ornare semper ligula varius. Aenean vestibulum leo at dolor pretium, sit amet aliquet nibh feugiat. Donec in justo ornare, vulputate mauris eget, bibendum leo. Nulla convallis fringilla varius. Cras eu ullamcorper felis, quis interdum risus. Aliquam vitae libero sit amet diam pretium vestibulum a vel orci. Suspendisse sed enim sed erat consequat iaculis.
				</p>

				<p>
					Cras aliquet sodales quam a hendrerit. Suspendisse eu fermentum leo, at laoreet nibh. Nulla facilisi. Maecenas nibh nisl, eleifend sit amet tempor sit amet, pharetra nec velit. Phasellus ut molestie velit, at dapibus sapien. Mauris in erat vehicula, sagittis velit id, pellentesque turpis. Aliquam laoreet augue eu sem vehicula, id malesuada eros molestie. Mauris condimentum accumsan elit, ac pretium lacus. Donec a hendrerit sapien, vel ultricies eros. Curabitur lobortis eget lectus eu ultrices. Ut ut leo tempor, maximus nisi et, consequat erat. Curabitur interdum sodales libero, sit amet cursus orci pharetra vitae. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse porta magna a diam aliquam, at imperdiet tellus efficitur. Aenean viverra lacus erat, at pellentesque neque molestie non.
				</p>

				<p>
					Phasellus convallis id turpis in commodo. Praesent pulvinar, urna ut rhoncus mollis, nisl dui volutpat odio, sed pharetra massa justo ut sem. Aliquam erat volutpat. Fusce eleifend sollicitudin venenatis. Cras tellus nisi, consectetur in lobortis quis, pharetra non lectus. Cras turpis est, consequat et tincidunt sit amet, ultricies ac justo. In a nibh tempor orci pulvinar sagittis. Cras elementum, ex nec porta mollis, dui risus facilisis enim, et pretium risus enim eget augue. Sed luctus enim id porta consequat.
				</p>

				<p>
					Fusce vitae lectus ultricies, egestas urna eget, suscipit augue. Etiam urna enim, egestas nec erat sed, suscipit vulputate purus. Sed sollicitudin libero et enim pellentesque, ac fringilla odio consequat. Morbi vulputate volutpat nunc, sit amet fringilla nunc sodales sed. Fusce ac finibus nibh, quis iaculis nisl. In ullamcorper mi a urna congue porta. Maecenas porttitor egestas accumsan.
				</p>

				<p>
					Sed ornare metus non elit elementum, ornare semper ligula varius. Aenean vestibulum leo at dolor pretium, sit amet aliquet nibh feugiat. Donec in justo ornare, vulputate mauris eget, bibendum leo. Nulla convallis fringilla varius. Cras eu ullamcorper felis, quis interdum risus. Aliquam vitae libero sit amet diam pretium vestibulum a vel orci. Suspendisse sed enim sed erat consequat iaculis.
				</p>
			</Scrollabel>
		</div>
	</Block>
</Container>
