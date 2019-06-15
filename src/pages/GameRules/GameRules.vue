<template>
	<div class="warp">
		<div v-html="content"></div>
	</div>
</template>

<script>
	export default{
		created(){
			this.getQuerySetting()
		},
		data(){
			return{
				content:null
			}
		},
		methods:{
			getQuerySetting(){
				this.$Api.Common.QuerySetting({key:"游戏规则"}).then((res)=>{
					this.$Api.UserPage.ArticleDetails(res.q.settings.value).then((data)=>{
						console.log(data)
						this.content = data.q.article.content
					})
				})
			},
		}
	}
</script>

<style scoped="scoped">
	.warp{
		padding: .24rem;
	}
</style>