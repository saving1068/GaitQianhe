<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'App',
		created() {

		},

		methods: {


		}

	}
</script>
<style>
	li {
		list-style: none;
	}

	html,
	body {
		height: 100%;
	}

	#app {
		height: 100%;
		width: 100%;
		background: rgba(255, 255, 255, 1);
	}

	.van-icon-search {
		color: #FADC56 !important;
	}
</style>
