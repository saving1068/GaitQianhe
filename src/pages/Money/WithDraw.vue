<template>
	<div  style="background:#FFF;min-height:100vh;padding:0.2rem;box-sizing:border-box;">
    <div  v-html="content">

    </div>
	</div>
</template>

<script>
	export default{
		   data(){
				 return{
					 content:""
				 }
			 },
			 created(){

               this.getData()
			 },
			 methods:{
            getData(){

               this.$Api.Common.QuerySetting({key:this.$route.query.key}).then((res)=>{
                    console.log(res)
										if(res.q.s==0){
                      this.$Api.Common.ArticleDetails({id:res.q.settings.value}).then((res)=>{
                            console.log(res)
                            this.content=res.q.article.content
											})


										}

							 })

						}


			 }

	}
</script>

<style scoped="scoped" lang="scss">
</style>
