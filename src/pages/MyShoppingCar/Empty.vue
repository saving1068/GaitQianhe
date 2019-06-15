<!-- 我的购物车（空的）页面 -->
<template>
	<div class="empty">
		
		<img src="../../assets/my_icon_cart@2x.png"/>
		<p>购物车空空如也</p>
		
	</div>
</template>

<script>
	
export default {
	data() {
		return {
			
		}
	},
	created() {
		
	},
	mounted() {

	},
	methods: {
		
	},
}	
	
</script>

<style scoped lang="less">
/*我的购物车（空的）样式*/
.empty{
	width: 100%;
	height: 100%;
	position: relative;
	img{
		width:2.8rem;
		height:2.8rem;
		position: absolute;
		top: 3.7rem;
		left: 2.35rem;
	}
	p{
		font-size:0.3rem;
		font-family:PingFang-SC-Medium;
		color:rgba(153,153,153,1);
		line-height:0.24rem;
		position: absolute;
		top: 6.8rem;
		left: 2.7rem;
	}
	
}	
</style>