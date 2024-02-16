<script>
	export let text, type, classes, onclick, title, style
</script>

<button {type} class={classes} on:click={onclick} title={title} style={style}>
	{@html text}
</button>

<style lang="scss">
	button {
		font-weight: 600;
		border: 2px solid var(--color_5);
		border-radius: 20px;
		padding: 9px 27px;
		background-color: var(--color_5);
		color: #fff;
		cursor: pointer;
		&.secondary {
			background-color: transparent;
			color: var(--color_5);
		}
		&.small {
			font-size: 14px;
			padding: 6px 24px;
			padding-bottom: 7px;
			font-weight: 500;
		}
		&.borderless {
			padding: 0;
			font-weight: 500;
			border: none;
		}
		:global(ion-icon) {
			display: inline-block;
			width: 24px;
		}
	}
</style>